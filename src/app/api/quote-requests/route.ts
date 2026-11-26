import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isInternalRequest } from "@/lib/internalAuth";
import { priceQuote } from "@/lib/pricing";
import { parseQuoteRequestBody, type EstimateLane } from "@/lib/quoteInput";

interface PublicEstimate {
  airline: string;
  approvedFreightRateUsdKg: number;
  chargeableWeightKg: number;
  weightBasis: "GROSS" | "VOLUMETRIC";
  freightTotalUsd: number;
}

/** Re-prices the customer's estimate lane on the server (never trusting a price
 * sent by the browser), using the same public fields the estimate panel shows.
 * "Any airline" prices every airline and keeps the lowest total. Returns null if
 * no airline has an active rate. */
async function priceLane(lane: EstimateLane): Promise<PublicEstimate | null> {
  let airlines: string[];
  if (lane.airline) {
    airlines = [lane.airline];
  } else {
    const { rows } = await pool.query<{ name: string }>("select name from airlines order by name");
    airlines = rows.map((r) => r.name);
  }

  let best: PublicEstimate | null = null;
  for (const airline of airlines) {
    const r = await priceQuote(pool, { ...lane, airline, managementOverrideRateUsdKg: null });
    if (!r.rateFound) continue;
    if (best === null || r.freightTotalUsd < best.freightTotalUsd) {
      best = {
        airline,
        approvedFreightRateUsdKg: r.approvedFreightRateUsdKg,
        chargeableWeightKg: r.chargeableWeightKg,
        weightBasis: r.weightBasis,
        freightTotalUsd: r.freightTotalUsd,
      };
    }
  }
  return best;
}

// POST /api/quote-requests — public: the contact page's "Request a Quote" form.
// Stores the lead (plus any instant-estimate inputs) for Sales to follow up.
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = parseQuoteRequestBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const req = parsed.value;

  // Honeypot filled in: answer exactly like a success so bots learn nothing,
  // but store nothing.
  if (req.isSpam) {
    return NextResponse.json({ received: true }, { status: 201 });
  }

  // A pricing failure must not lose the lead: store it without an estimate.
  let estimate: PublicEstimate | null = null;
  if (req.lane) {
    try {
      estimate = await priceLane(req.lane);
    } catch (err) {
      console.error("quote-requests: re-pricing estimate failed", err);
    }
  }

  const { rows } = await pool.query<{ id: number }>(
    `insert into quote_requests
       (name, company, email, phone, product_type, estimated_volume, destination, message, lane, estimate)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     returning id`,
    [
      req.name,
      req.company,
      req.email,
      req.phone,
      req.productType,
      req.estimatedVolume,
      req.destination,
      req.message,
      req.lane ? JSON.stringify(req.lane) : null,
      estimate ? JSON.stringify(estimate) : null,
    ]
  );

  return NextResponse.json({ received: true, id: rows[0].id }, { status: 201 });
}

const STATUSES = new Set(["new", "contacted", "quoted", "closed"]);

// GET /api/quote-requests?status=new&limit=50 — internal-key gated: lists
// submitted requests, newest first, for Sales to work through.
export async function GET(request: Request) {
  if (!isInternalRequest(request)) {
    return NextResponse.json({ error: "internal API key required" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  if (status !== null && !STATUSES.has(status)) {
    return NextResponse.json({ error: `status must be one of: ${[...STATUSES].join(", ")}` }, { status: 400 });
  }
  const limitParam = Number(url.searchParams.get("limit") ?? 50);
  const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 50;

  const { rows } = await pool.query(
    `select id, created_at as "createdAt", status, name, company, email, phone,
            product_type as "productType", estimated_volume as "estimatedVolume",
            destination, message, lane, estimate
     from quote_requests
     where ($1::text is null or status = $1)
     order by created_at desc, id desc
     limit $2`,
    [status, limit]
  );

  return NextResponse.json({ requests: rows });
}
