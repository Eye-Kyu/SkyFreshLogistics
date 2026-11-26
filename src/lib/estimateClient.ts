// Browser-side helpers shared by the home page's estimate desk and the contact
// page's QuoteEstimate. Both call the same public endpoints: GET /api/lists for
// the dropdowns and POST /api/quotes/price for the approved rate and freight
// total (never buy rates or margins).

export interface Lists {
  origins: { code: string; name: string }[];
  destinations: { code: string; name: string }[];
  airlines: string[];
  commodities: { id: number; name: string; subtypes: string[] }[];
}

export interface PriceResult {
  chargeableWeightKg: number;
  weightBasis: "GROSS" | "VOLUMETRIC";
  approvedFreightRateUsdKg: number;
  freightTotalUsd: number;
}

export interface Dimension {
  pieces: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export type Estimate =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "priced"; airline: string; result: PriceResult }
  | { kind: "noRate" }
  | { kind: "error"; message: string };

export const ANY_AIRLINE = "";

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const usdRate = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
export const kg = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

export function todayInNairobi(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());
}

export function optionLabel(o: { code: string; name: string }): string {
  return o.name && o.name !== o.code ? `${o.name} (${o.code})` : o.code;
}

export async function fetchLists(): Promise<Lists> {
  const res = await fetch("/api/lists");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchPrice(body: object): Promise<{ status: number; json: Partial<PriceResult> & { error?: string } }> {
  const res = await fetch("/api/quotes/price", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}

/**
 * Prices a lane on one airline, or on every airline when `airline` is
 * ANY_AIRLINE, and keeps the lowest freight total.
 */
export async function priceLane(input: {
  origin: string;
  destination: string;
  commodity: string;
  airline: string;
  readyDate: string;
  grossWeightKg: number;
  dimensions: Dimension[];
  airlines: string[];
}): Promise<Estimate> {
  const { airline, airlines, ...base } = input;
  const candidates = airline === ANY_AIRLINE ? airlines : [airline];
  try {
    const responses = await Promise.all(
      candidates.map(async (name) => ({ name, ...(await fetchPrice({ ...base, airline: name })) }))
    );
    const priced = responses.filter((r) => r.status === 200);
    if (priced.length > 0) {
      const best = priced.reduce((a, b) =>
        (b.json.freightTotalUsd ?? Infinity) < (a.json.freightTotalUsd ?? Infinity) ? b : a
      );
      return { kind: "priced", airline: best.name, result: best.json as PriceResult };
    }
    if (responses.length > 0 && responses.every((r) => r.status === 422)) return { kind: "noRate" };
    const badRequest = responses.find((r) => r.status === 400);
    return {
      kind: "error",
      message: badRequest?.json.error
        ? `Please check your shipment details (${badRequest.json.error}).`
        : "We couldn't calculate an estimate right now. Submit the form and our team will quote you directly.",
    };
  } catch {
    return { kind: "error", message: "We couldn't reach the pricing service. Please try again." };
  }
}
