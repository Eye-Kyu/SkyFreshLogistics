import { timingSafeEqual } from "crypto";

const HEADER_NAME = "x-internal-api-key";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // timingSafeEqual throws on length mismatch rather than returning false, and
  // a length check itself leaks length via timing — the standard workaround
  // is to compare a fixed-size hash of both instead of raw values. For a
  // single shared secret checked at low request volume, the practical risk
  // is negligible either way; length-check first for simplicity and clarity.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** True if the request carries a valid `x-internal-api-key` header matching
 * INTERNAL_API_KEY. Used to gate management-only data (buy rates, margins,
 * surcharges — "Sales only ever sees the results... never the buy rate,
 * surcharges, or margin themselves," per the workbook's INSTRUCTIONS sheet). */
export function isInternalRequest(request: Request): boolean {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) return false;
  const provided = request.headers.get(HEADER_NAME);
  if (!provided) return false;
  return safeEqual(provided, expected);
}
