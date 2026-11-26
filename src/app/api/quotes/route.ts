import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { isInternalRequest } from "@/lib/internalAuth";
import { priceQuote, type DimensionLine } from "@/lib/pricing";
import { buildQuoteCode, buildQuoteNumber } from "@/lib/quoteCode";

interface ServiceCharges {
  documentation?: number;
  coordination?: number;
  handling?: number;
  coldChain?: number;
  customsFacilitation?: number;
  deliveryCollection?: number;
  otherServices?: number;
}

interface CreateQuoteBody {
  customer?: string;
  salesperson?: string;
  origin: string;
  destination: string;
  commodity: string;
  commoditySubtype?: string;
  airline: string;
  readyDate: string;
  grossWeightKg: number;
  dimensions: DimensionLine[];
  managementOverrideRateUsdKg?: number | null;
  serviceCharges?: ServiceCharges;
  notes?: string;
}

const REQUIRED_FIELDS: (keyof CreateQuoteBody)[] = [
  "origin",
  "destination",
  "commodity",
  "airline",
  "readyDate",
  "grossWeightKg",
];

function sumServiceCharges(charges: ServiceCharges | undefined): number {
  if (!charges) return 0;
  return Object.values(charges).reduce((sum: number, v) => sum + (Number(v) || 0), 0);
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

  let body: CreateQuoteBody;
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

  const priced = await priceQuote(pool, {
    origin: body.origin,
    destination: body.destination,
    commodity: body.commodity,
    airline: body.airline,
    readyDate: body.readyDate,
    grossWeightKg: Number(body.grossWeightKg),
    dimensions: body.dimensions,
    managementOverrideRateUsdKg: body.managementOverrideRateUsdKg ?? null,
  });

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
  const totalCustomerQuoteUsd = priced.freightTotalUsd + serviceChargesTotal;

  const client = await pool.connect();
  try {
    await client.query("begin");

    // A single advisory lock serializes quote creation so the month/day sequence
    // counts below can't race between two concurrent requests and hand out the
    // same quote code or number twice. The workbook's own COUNT()-based sequence
    // is only safe because exactly one person edits it at a time; a shared API
    // needs this lock to keep that guarantee under concurrency.
    await client.query("select pg_advisory_xact_lock(hashtext('bravair_quote_sequence'))");

    const quoteDate = new Date();
    const quoteDateIso = quoteDate.toISOString().slice(0, 10);

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

    const { rows: monthCountRows } = await client.query<{ count: string }>(
      `select count(*)::text as count from quotes
       where date_trunc('month', quote_date) = date_trunc('month', $1::date)`,
      [quoteDateIso]
    );
    const { rows: dayCountRows } = await client.query<{ count: string }>(
      "select count(*)::text as count from quotes where quote_date = $1::date",
      [quoteDateIso]
    );

    const quoteCode = buildQuoteCode(quoteDate, Number(monthCountRows[0].count));
    const quoteNumber = buildQuoteNumber(quoteDate, Number(dayCountRows[0].count));

    const { rows: inserted } = await client.query(
      `insert into quotes
         (quote_code, quote_number, quote_date, customer, salesperson, origin_code,
          destination_code, commodity_id, commodity_subtype_id, airline_id, ready_date,
          gross_weight_kg, dimensions, volumetric_weight_kg, chargeable_weight_kg,
          weight_basis, approved_freight_rate_usd_kg, freight_total_usd, service_charges,
          total_customer_quote_usd, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       returning id, quote_code, quote_number, quote_date`,
      [
        quoteCode,
        quoteNumber,
        quoteDateIso,
        body.customer ?? null,
        body.salesperson ?? null,
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
        JSON.stringify(body.serviceCharges ?? {}),
        totalCustomerQuoteUsd,
        body.notes ?? null,
      ]
    );

    await client.query("commit");

    return NextResponse.json(
      {
        id: inserted[0].id,
        quoteCode: inserted[0].quote_code,
        quoteNumber: inserted[0].quote_number,
        quoteDate: inserted[0].quote_date,
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
