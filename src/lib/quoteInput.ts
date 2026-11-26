import type { DimensionLine, PriceQuoteInput } from "./pricing";

// Request-body validation for the quote endpoints. Values arrive as untrusted
// JSON, so every number is checked to be a real, finite JSON number before it
// reaches the pricing engine or the database. Without this, "abc" became NaN
// (which Postgres `numeric` happily stores), negative weights priced as
// discounts, and a string override like "5" was string-concatenated inside
// round4() and logged as a rate of 0.

export type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

export const SERVICE_CHARGE_KEYS = [
  "documentation",
  "coordination",
  "handling",
  "coldChain",
  "customsFacilitation",
  "deliveryCollection",
  "otherServices",
] as const;

export type ServiceCharges = Partial<Record<(typeof SERVICE_CHARGE_KEYS)[number], number>>;

export interface CreateQuoteInput extends PriceQuoteInput {
  customer: string | null;
  salesperson: string | null;
  commoditySubtype: string | null;
  serviceCharges: ServiceCharges;
  notes: string | null;
}

class InputError extends Error {}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function requiredString(body: Record<string, unknown>, field: string): string {
  const v = body[field];
  if (typeof v !== "string" || v.trim() === "") throw new InputError(`${field} must be a non-empty string`);
  return v.trim();
}

function optionalString(body: Record<string, unknown>, field: string): string | null {
  const v = body[field];
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") throw new InputError(`${field} must be a string`);
  return v.trim() === "" ? null : v.trim();
}

function finiteNumber(v: unknown, field: string): number {
  if (typeof v !== "number" || !Number.isFinite(v)) throw new InputError(`${field} must be a number`);
  return v;
}

function positiveNumber(v: unknown, field: string): number {
  const n = finiteNumber(v, field);
  if (n <= 0) throw new InputError(`${field} must be greater than 0`);
  return n;
}

function nonNegativeNumber(v: unknown, field: string): number {
  const n = finiteNumber(v, field);
  if (n < 0) throw new InputError(`${field} must not be negative`);
  return n;
}

/** YYYY-MM-DD that is a real calendar date (rejects 2026-02-30). */
function isoDate(v: unknown, field: string): string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    throw new InputError(`${field} must be a date in YYYY-MM-DD format`);
  }
  const parsed = new Date(`${v}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== v) {
    throw new InputError(`${field} is not a valid calendar date`);
  }
  return v;
}

// A line of all zeros is a blank row (the QUOTE sheet has ten fixed rows and
// pricing.ts skips incomplete ones), so 0 is allowed; negatives are not.
function dimensions(v: unknown): DimensionLine[] {
  if (!Array.isArray(v)) throw new InputError("dimensions must be an array");
  return v.map((line, i) => {
    const at = `dimensions[${i}]`;
    if (!isRecord(line)) throw new InputError(`${at} must be an object`);
    const pieces = nonNegativeNumber(line.pieces, `${at}.pieces`);
    if (!Number.isInteger(pieces)) throw new InputError(`${at}.pieces must be a whole number`);
    return {
      pieces,
      lengthCm: nonNegativeNumber(line.lengthCm, `${at}.lengthCm`),
      widthCm: nonNegativeNumber(line.widthCm, `${at}.widthCm`),
      heightCm: nonNegativeNumber(line.heightCm, `${at}.heightCm`),
    };
  });
}

function overrideRate(v: unknown): number | null {
  if (v === undefined || v === null) return null;
  return positiveNumber(v, "managementOverrideRateUsdKg");
}

function serviceCharges(v: unknown): ServiceCharges {
  if (v === undefined || v === null) return {};
  if (!isRecord(v)) throw new InputError("serviceCharges must be an object");
  const allowed = new Set<string>(SERVICE_CHARGE_KEYS);
  const result: ServiceCharges = {};
  for (const [key, value] of Object.entries(v)) {
    if (!allowed.has(key)) throw new InputError(`unknown service charge: ${key}`);
    if (value === undefined || value === null) continue;
    result[key as keyof ServiceCharges] = nonNegativeNumber(value, `serviceCharges.${key}`);
  }
  return result;
}

function parsePriceFields(body: Record<string, unknown>): PriceQuoteInput {
  return {
    origin: requiredString(body, "origin"),
    destination: requiredString(body, "destination"),
    commodity: requiredString(body, "commodity"),
    airline: requiredString(body, "airline"),
    readyDate: isoDate(body.readyDate, "readyDate"),
    grossWeightKg: positiveNumber(body.grossWeightKg, "grossWeightKg"),
    dimensions: dimensions(body.dimensions),
    managementOverrideRateUsdKg: overrideRate(body.managementOverrideRateUsdKg),
  };
}

function run<T>(body: unknown, parse: (b: Record<string, unknown>) => T): Validated<T> {
  if (!isRecord(body)) return { ok: false, error: "request body must be a JSON object" };
  try {
    return { ok: true, value: parse(body) };
  } catch (err) {
    if (err instanceof InputError) return { ok: false, error: err.message };
    throw err;
  }
}

// --- Website quote requests (POST /api/quote-requests) ---------------------

/** The instant-estimate panel's inputs. `airline` null means "any airline". */
export interface EstimateLane {
  origin: string;
  destination: string;
  commodity: string;
  airline: string | null;
  readyDate: string;
  grossWeightKg: number;
  dimensions: DimensionLine[];
}

export interface QuoteRequestInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  productType: string | null;
  estimatedVolume: string | null;
  destination: string;
  message: string | null;
  /** Null when the estimate panel was left empty or filled in invalidly — a
   * half-finished estimate must never cost us the lead itself. */
  lane: EstimateLane | null;
  /** True when the honeypot field was filled in (almost certainly a bot). */
  isSpam: boolean;
}

function boundedString(body: Record<string, unknown>, field: string, max: number, required: true): string;
function boundedString(body: Record<string, unknown>, field: string, max: number, required: false): string | null;
function boundedString(body: Record<string, unknown>, field: string, max: number, required: boolean): string | null {
  const v = required ? requiredString(body, field) : optionalString(body, field);
  if (v !== null && v.length > max) throw new InputError(`${field} must be at most ${max} characters`);
  return v;
}

function parseLane(v: unknown): EstimateLane | null {
  if (!isRecord(v)) return null;
  try {
    return {
      origin: requiredString(v, "origin"),
      destination: requiredString(v, "destination"),
      commodity: requiredString(v, "commodity"),
      airline: optionalString(v, "airline"),
      readyDate: isoDate(v.readyDate, "readyDate"),
      grossWeightKg: positiveNumber(v.grossWeightKg, "grossWeightKg"),
      dimensions: v.dimensions === undefined ? [] : dimensions(v.dimensions),
    };
  } catch (err) {
    if (err instanceof InputError) return null;
    throw err;
  }
}

/** Body of POST /api/quote-requests. */
export function parseQuoteRequestBody(body: unknown): Validated<QuoteRequestInput> {
  return run(body, (b) => {
    const email = boundedString(b, "email", 254, true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError("email must be a valid email address");
    return {
      name: boundedString(b, "name", 200, true),
      company: boundedString(b, "company", 200, true),
      email,
      phone: boundedString(b, "phone", 50, true),
      productType: boundedString(b, "productType", 100, false),
      estimatedVolume: boundedString(b, "estimatedVolume", 200, false),
      destination: boundedString(b, "destination", 200, true),
      message: boundedString(b, "message", 5000, false),
      lane: parseLane(b.lane),
      isSpam: typeof b.website === "string" && b.website.trim() !== "",
    };
  });
}

/** Body of POST /api/quotes/price. */
export function parsePriceQuoteBody(body: unknown): Validated<PriceQuoteInput> {
  return run(body, parsePriceFields);
}

/** Body of POST /api/quotes. */
export function parseCreateQuoteBody(body: unknown): Validated<CreateQuoteInput> {
  return run(body, (b) => ({
    ...parsePriceFields(b),
    customer: optionalString(b, "customer"),
    salesperson: optionalString(b, "salesperson"),
    commoditySubtype: optionalString(b, "commoditySubtype"),
    serviceCharges: serviceCharges(b.serviceCharges),
    notes: optionalString(b, "notes"),
  }));
}
