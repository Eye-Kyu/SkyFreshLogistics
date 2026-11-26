import type { Pool } from "pg";

// Port of the PRICING_ENGINE sheet in BLL_QUOTES_SYSTEM.xlsx. See db/README.md for
// the full formula derivation and the one documented correction (PRICING_ENGINE!B18
// is a hardcoded 0.65 in the workbook rather than wired to a lookup — this
// implementation looks up minimum margin from the matched rate row instead, since
// that's what the surrounding IF(B18="", SETTINGS!$B$6, B18) fallback formula
// clearly intends, and it's the only version that reproduces the workbook's own
// worked example).

export interface DimensionLine {
  pieces: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface PriceQuoteInput {
  origin: string;
  destination: string;
  commodity: string;
  airline: string;
  readyDate: string; // YYYY-MM-DD
  grossWeightKg: number;
  dimensions: DimensionLine[];
  managementOverrideRateUsdKg?: number | null;
}

export interface PriceBreakdown {
  buyRateUsdKg: number;
  negotiatedBuyRateUsdKg: number | null;
  effectiveBuyRateUsdKg: number;
  fuelSurchargeUsdKg: number;
  securitySurchargeUsdKg: number;
  otherSurchargeUsdKg: number;
  flatAirlineChargesUsd: number;
  perKgAirlineCostUsdKg: number;
  minimumMarginUsdKg: number;
  minimumChargeUsd: number | null;
  minSellingRateUsdKg: number;
  managementOverrideRateUsdKg: number | null;
  marginUsdKg: number;
  marginPercent: number;
  surchargeFound: boolean;
}

export interface PriceQuoteResult {
  rateFound: boolean;
  volumetricWeightKg: number;
  grossWeightKg: number;
  chargeableWeightKg: number;
  weightBasis: "GROSS" | "VOLUMETRIC";
  approvedFreightRateUsdKg: number;
  freightTotalUsd: number;
  breakdown: PriceBreakdown;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function round4(n: number): number {
  return Math.round((n + Number.EPSILON) * 10000) / 10000;
}

/** Pieces × L(cm) × W(cm) × H(cm) / VOL_DIVISOR, summed per dimension line —
 * matches the QUOTE sheet's per-row formula (F16:F25) plus its SUM (F26). */
export function computeVolumetricWeightKg(dimensions: DimensionLine[], volDivisor: number): number {
  const total = dimensions.reduce((sum, line) => {
    if (!line.pieces || !line.lengthCm || !line.widthCm || !line.heightCm) return sum;
    return sum + (line.pieces * line.lengthCm * line.widthCm * line.heightCm) / volDivisor;
  }, 0);
  return round2(total);
}

/** CEILING(MAX(gross, volumetric), roundingIncrement) — increment 0 means no rounding. */
export function computeChargeableWeight(
  grossWeightKg: number,
  volumetricWeightKg: number,
  roundingIncrement: number
): { chargeableWeightKg: number; weightBasis: "GROSS" | "VOLUMETRIC" } {
  const max = Math.max(grossWeightKg, volumetricWeightKg);
  const chargeableWeightKg = roundingIncrement > 0 ? Math.ceil(max / roundingIncrement) * roundingIncrement : max;
  const weightBasis: "GROSS" | "VOLUMETRIC" = volumetricWeightKg > grossWeightKg ? "VOLUMETRIC" : "GROSS";
  return { chargeableWeightKg: round2(chargeableWeightKg), weightBasis };
}

interface RateRow {
  buy_rate_usd_kg: string;
  negotiated_buy_rate_usd_kg: string | null;
  minimum_charge_usd: string | null;
  minimum_margin_usd_kg: string | null;
}

interface SurchargeRow {
  fuel_surcharge_usd_kg: string;
  security_surcharge_usd_kg: string;
  other_surcharge_usd_kg: string;
  flat_airline_charges_usd: string;
}

async function loadSettings(pool: Pool): Promise<Record<string, string>> {
  const { rows } = await pool.query<{ key: string; value: string }>("select key, value from settings");
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

async function findRate(
  pool: Pool,
  origin: string,
  destination: string,
  commodity: string,
  airline: string,
  readyDate: string
): Promise<RateRow | null> {
  const { rows } = await pool.query<RateRow>(
    `select r.buy_rate_usd_kg, r.negotiated_buy_rate_usd_kg, r.minimum_charge_usd, r.minimum_margin_usd_kg
     from rates r
     join commodities c on c.id = r.commodity_id
     join airlines a on a.id = r.airline_id
     where r.origin_code = $1
       and r.destination_code = $2
       and c.name = $3
       and a.name = $4
       and r.status = 'Active'
       and r.effective_from <= $5::date
       and r.effective_to >= $5::date
     order by r.id asc
     limit 1`,
    [origin, destination, commodity, airline, readyDate]
  );
  return rows[0] ?? null;
}

async function findSurcharge(
  pool: Pool,
  origin: string,
  destination: string,
  commodity: string,
  readyDate: string
): Promise<SurchargeRow | null> {
  const { rows } = await pool.query<SurchargeRow>(
    `select s.fuel_surcharge_usd_kg, s.security_surcharge_usd_kg, s.other_surcharge_usd_kg, s.flat_airline_charges_usd
     from surcharges s
     join commodities c on c.id = s.commodity_id
     where s.origin_code = $1
       and s.destination_code = $2
       and c.name = $3
       and s.status = 'Active'
       and s.effective_from <= $4::date
       and s.effective_to >= $4::date
     order by s.id asc
     limit 1`,
    [origin, destination, commodity, readyDate]
  );
  return rows[0] ?? null;
}

export async function priceQuote(pool: Pool, input: PriceQuoteInput): Promise<PriceQuoteResult> {
  const settings = await loadSettings(pool);
  const volDivisor = Number(settings.VOL_DIVISOR ?? 6000);
  const roundingIncrement = Number(settings.CWT_ROUNDING_INCREMENT ?? 1);
  const fallbackMinMargin = Number(settings.BRAVAIR_MIN_MARGIN_USD_KG ?? 0);
  const globalMinChargeUsd = Number(settings.GLOBAL_MIN_CHARGE_USD ?? 0);

  const volumetricWeightKg = computeVolumetricWeightKg(input.dimensions, volDivisor);
  const { chargeableWeightKg, weightBasis } = computeChargeableWeight(
    input.grossWeightKg,
    volumetricWeightKg,
    roundingIncrement
  );

  const rate = await findRate(pool, input.origin, input.destination, input.commodity, input.airline, input.readyDate);
  const surcharge = await findSurcharge(pool, input.origin, input.destination, input.commodity, input.readyDate);
  const rateFound = rate !== null;

  const buyRateUsdKg = rate ? Number(rate.buy_rate_usd_kg) : 0;
  const negotiatedBuyRateUsdKg = rate?.negotiated_buy_rate_usd_kg != null ? Number(rate.negotiated_buy_rate_usd_kg) : null;
  const effectiveBuyRateUsdKg = negotiatedBuyRateUsdKg ?? buyRateUsdKg;

  const fuelSurchargeUsdKg = surcharge ? Number(surcharge.fuel_surcharge_usd_kg) : 0;
  const securitySurchargeUsdKg = surcharge ? Number(surcharge.security_surcharge_usd_kg) : 0;
  const otherSurchargeUsdKg = surcharge ? Number(surcharge.other_surcharge_usd_kg) : 0;
  const flatAirlineChargesUsd = surcharge ? Number(surcharge.flat_airline_charges_usd) : 0;

  const perKgAirlineCostUsdKg = effectiveBuyRateUsdKg + fuelSurchargeUsdKg + securitySurchargeUsdKg + otherSurchargeUsdKg;

  // Corrected per db/README.md: minimum margin comes from the matched rate row,
  // falling back to the global setting — not the workbook's stray hardcoded 0.65.
  const routeMinMarginUsdKg = rate?.minimum_margin_usd_kg != null ? Number(rate.minimum_margin_usd_kg) : null;
  const minimumMarginUsdKg = routeMinMarginUsdKg ?? fallbackMinMargin;

  const minimumChargeUsd = rate?.minimum_charge_usd != null ? Number(rate.minimum_charge_usd) : null;

  const minSellingRateUsdKg =
    chargeableWeightKg === 0
      ? 0
      : perKgAirlineCostUsdKg + minimumMarginUsdKg + flatAirlineChargesUsd / chargeableWeightKg;

  const managementOverrideRateUsdKg = input.managementOverrideRateUsdKg ?? null;
  const approvedFreightRateUsdKg = managementOverrideRateUsdKg ?? minSellingRateUsdKg;

  const marginUsdKg = approvedFreightRateUsdKg - perKgAirlineCostUsdKg;
  const marginPercent = approvedFreightRateUsdKg === 0 ? 0 : marginUsdKg / approvedFreightRateUsdKg;

  const freightBeforeMinimums = approvedFreightRateUsdKg * chargeableWeightKg;
  const freightTotalUsd =
    chargeableWeightKg === 0 ? 0 : Math.max(freightBeforeMinimums, minimumChargeUsd ?? 0, globalMinChargeUsd);

  return {
    rateFound,
    volumetricWeightKg,
    grossWeightKg: input.grossWeightKg,
    chargeableWeightKg,
    weightBasis,
    approvedFreightRateUsdKg: round4(approvedFreightRateUsdKg),
    freightTotalUsd: round2(freightTotalUsd),
    breakdown: {
      buyRateUsdKg: round4(buyRateUsdKg),
      negotiatedBuyRateUsdKg: negotiatedBuyRateUsdKg != null ? round4(negotiatedBuyRateUsdKg) : null,
      effectiveBuyRateUsdKg: round4(effectiveBuyRateUsdKg),
      fuelSurchargeUsdKg: round4(fuelSurchargeUsdKg),
      securitySurchargeUsdKg: round4(securitySurchargeUsdKg),
      otherSurchargeUsdKg: round4(otherSurchargeUsdKg),
      flatAirlineChargesUsd: round2(flatAirlineChargesUsd),
      perKgAirlineCostUsdKg: round4(perKgAirlineCostUsdKg),
      minimumMarginUsdKg: round4(minimumMarginUsdKg),
      minimumChargeUsd: minimumChargeUsd != null ? round2(minimumChargeUsd) : null,
      minSellingRateUsdKg: round4(minSellingRateUsdKg),
      managementOverrideRateUsdKg,
      marginUsdKg: round4(marginUsdKg),
      marginPercent: round4(marginPercent),
      surchargeFound: surcharge !== null,
    },
  };
}
