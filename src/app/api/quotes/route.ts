import { NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import { isInternalRequest } from "@/lib/internalAuth";
import { priceQuote } from "@/lib/pricing";
import {
  QUOTE_TIMEZONE,
  buildQuoteCode,
  buildQuoteNumber,
  quoteCodePeriod,
  quoteNumberPeriod,
} from "@/lib/quoteCode";
import { parseCreateQuoteBody, type ServiceCharges } from "@/lib/quoteInput";

function sumServiceCharges(charges: ServiceCharges): number {
  const total = Object.values(charges).reduce((sum: number, v) => sum + (v ?? 0), 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

/** Reserves the next value of a quote counter. The upsert's row lock serializes
 * concurrent requests for the same period until this transaction ends. */
async function nextSequence(client: PoolClient, scope: "code" | "number", period: string): Promise<number> {
  const { rows } = await client.query<{ last_value: number }>(
    `insert into quote_sequences (scope, period, last_value) values ($1, $2, 1)
     on conflict (scope, period) do update set last_value = quote_sequences.last_value + 1
     returning last_value`,
    [scope, period]
  );
  return rows[0].last_value;
}

// POST /api/quotes — logs a finalized quotation, the API equivalent of copying the
// QUOTE sheet's "READY TO LOG" row into QUOTE_LOG as values. Internal-key gated:
// this is a management/booking action, not something the public quote form exposes
// directly (per the workbook's role-based access notes: Sales sees the QUOTE
// sheet's results, but logging is what makes a quote code/number permanent).
export async function POST(request: Request) {
  if (!isInternalRequest(request)) {
    return NextResponse.json({ error: "internal API key required" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = parseCreateQuoteBody(raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const body = parsed.value;

  const priced = await priceQuote(pool, body);

  // With no matching Active rate the engine falls back to a buy rate of 0,
  // which still produces a plausible-looking price (surcharges + fallback
  // margin, floored at GLOBAL_MIN_CHARGE_USD). Never log such a quote.
  if (!priced.rateFound) {
    return NextResponse.json(
      { rateFound: false, error: "no active rate for this route, commodity, airline and ready date" },
      { status: 422 }
    );
  }

  const serviceChargesTotal = sumServiceCharges(body.serviceCharges);
  const totalCustomerQuoteUsd = Math.round((priced.freightTotalUsd + serviceChargesTotal + Number.EPSILON) * 100) / 100;

  const client = await pool.connect();
  try {
    await client.query("begin");

    // Today's date in Nairobi, computed by Postgres and returned as text: pg
    // parses `date` columns into a JS Date at the server's local midnight, which
    // is exactly the kind of silent time-zone shift this is avoiding.
    const { rows: dateRows } = await client.query<{ today: string }>(
      "select to_char(now() at time zone $1, 'YYYY-MM-DD') as today",
      [QUOTE_TIMEZONE]
    );
    const quoteDateIso = dateRows[0].today;

    const { rows: commodityRows } = await client.query<{ id: number }>(
      "select id from commodities where name = $1",
      [body.commodity]
    );
    if (commodityRows.length === 0) {
      await client.query("rollback");
      return NextResponse.json({ error: `unknown commodity: ${body.commodity}` }, { status: 400 });
    }
    const commodityId = commodityRows[0].id;

    let commoditySubtypeId: number | null = null;
    if (body.commoditySubtype) {
      const { rows: subtypeRows } = await client.query<{ id: number }>(
        "select id from commodity_subtypes where commodity_id = $1 and name = $2",
        [commodityId, body.commoditySubtype]
      );
      if (subtypeRows.length === 0) {
        await client.query("rollback");
        return NextResponse.json(
          { error: `unknown subtype "${body.commoditySubtype}" for commodity "${body.commodity}"` },
          { status: 400 }
        );
      }
      commoditySubtypeId = subtypeRows[0].id;
    }

    const { rows: airlineRows } = await client.query<{ id: number }>("select id from airlines where name = $1", [
      body.airline,
    ]);
    if (airlineRows.length === 0) {
      await client.query("rollback");
      return NextResponse.json({ error: `unknown airline: ${body.airline}` }, { status: 400 });
    }
    const airlineId = airlineRows[0].id;

    // Always reserve "code" before "number" so two concurrent transactions take
    // the counter row locks in the same order and can't deadlock.
    const quoteCode = buildQuoteCode(quoteDateIso, await nextSequence(client, "code", quoteCodePeriod(quoteDateIso)));
    const quoteNumber = buildQuoteNumber(
      quoteDateIso,
      await nextSequence(client, "number", quoteNumberPeriod(quoteDateIso))
    );

    const { rows: inserted } = await client.query<{ id: number }>(
      `insert into quotes
         (quote_code, quote_number, quote_date, customer, salesperson, origin_code,
          destination_code, commodity_id, commodity_subtype_id, airline_id, ready_date,
          gross_weight_kg, dimensions, volumetric_weight_kg, chargeable_weight_kg,
          weight_basis, approved_freight_rate_usd_kg, freight_total_usd, service_charges,
          total_customer_quote_usd, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       returning id`,
      [
        quoteCode,
        quoteNumber,
        quoteDateIso,
        body.customer,
        body.salesperson,
        body.origin,
        body.destination,
        commodityId,
        commoditySubtypeId,
        airlineId,
        body.readyDate,
        body.grossWeightKg,
        JSON.stringify(body.dimensions),
        priced.volumetricWeightKg,
        priced.chargeableWeightKg,
        priced.weightBasis,
        priced.approvedFreightRateUsdKg,
        priced.freightTotalUsd,
        JSON.stringify(body.serviceCharges),
        totalCustomerQuoteUsd,
        body.notes,
      ]
    );

    await client.query("commit");

    return NextResponse.json(
      {
        id: inserted[0].id,
        quoteCode,
        quoteNumber,
        quoteDate: quoteDateIso,
        rateFound: priced.rateFound,
        chargeableWeightKg: priced.chargeableWeightKg,
        weightBasis: priced.weightBasis,
        approvedFreightRateUsdKg: priced.approvedFreightRateUsdKg,
        freightTotalUsd: priced.freightTotalUsd,
        serviceChargesTotalUsd: serviceChargesTotal,
        totalCustomerQuoteUsd,
      },
      { status: 201 }
    );
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
}
