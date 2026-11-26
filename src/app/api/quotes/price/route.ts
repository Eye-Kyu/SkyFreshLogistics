import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isInternalRequest } from "@/lib/internalAuth";
import { priceQuote } from "@/lib/pricing";
import { parsePriceQuoteBody } from "@/lib/quoteInput";

// POST /api/quotes/price — prices a shipment without logging it (equivalent to
// filling in the QUOTE sheet, before it's copied into QUOTE_LOG). Sales staff get
// only the approved rate and freight total; the internal key + ?internal=1 unlocks
// the confidential breakdown (buy rate, surcharges, margin) — see
// PRICING_ENGINE's own access-control note in db/README.md.
export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = parsePriceQuoteBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const input = parsed.value;

  const url = new URL(request.url);
  const wantsInternal = url.searchParams.get("internal") === "1";
  const internal = wantsInternal && isInternalRequest(request);

  const result = await priceQuote(pool, {
    ...input,
    // The override is a management decision: only honour it on internal
    // requests, or any public caller could set their own rate (and a tiny
    // override would expose the route's confidential minimum charge).
    managementOverrideRateUsdKg: internal ? input.managementOverrideRateUsdKg : null,
  });

  // With no matching Active rate the engine falls back to a buy rate of 0,
  // which still produces a plausible-looking price (surcharges + fallback
  // margin, floored at GLOBAL_MIN_CHARGE_USD). Refuse rather than quote it.
  if (!result.rateFound) {
    return NextResponse.json(
      { rateFound: false, error: "no active rate for this route, commodity, airline and ready date" },
      { status: 422 }
    );
  }

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
