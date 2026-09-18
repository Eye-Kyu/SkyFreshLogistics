import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isInternalRequest } from "@/lib/internalAuth";
import { priceQuote, type DimensionLine } from "@/lib/pricing";

interface PriceRequestBody {
  origin: string;
  destination: string;
  commodity: string;
  airline: string;
  readyDate: string;
  grossWeightKg: number;
  dimensions: DimensionLine[];
  managementOverrideRateUsdKg?: number | null;
}

const REQUIRED_FIELDS: (keyof PriceRequestBody)[] = [
  "origin",
  "destination",
  "commodity",
  "airline",
  "readyDate",
  "grossWeightKg",
];

// POST /api/quotes/price — prices a shipment without logging it (equivalent to
// filling in the QUOTE sheet, before it's copied into QUOTE_LOG). Sales staff get
// only the approved rate and freight total; the internal key + ?internal=1 unlocks
// the confidential breakdown (buy rate, surcharges, margin) — see
// PRICING_ENGINE's own access-control note in db/README.md.
export async function POST(request: Request) {
  let body: PriceRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length > 0) {
    return NextResponse.json({ error: `missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }
  if (!Array.isArray(body.dimensions)) {
    return NextResponse.json({ error: "dimensions must be an array" }, { status: 400 });
  }

  const result = await priceQuote(pool, {
    origin: body.origin,
    destination: body.destination,
    commodity: body.commodity,
    airline: body.airline,
    readyDate: body.readyDate,
    grossWeightKg: Number(body.grossWeightKg),
    dimensions: body.dimensions,
    managementOverrideRateUsdKg: body.managementOverrideRateUsdKg ?? null,
  });

  const url = new URL(request.url);
  const wantsInternal = url.searchParams.get("internal") === "1";
  const internal = wantsInternal && isInternalRequest(request);

  if (!internal) {
    return NextResponse.json({
      rateFound: result.rateFound,
      chargeableWeightKg: result.chargeableWeightKg,
      weightBasis: result.weightBasis,
      approvedFreightRateUsdKg: result.approvedFreightRateUsdKg,
      freightTotalUsd: result.freightTotalUsd,
    });
  }

  return NextResponse.json(result);
}
