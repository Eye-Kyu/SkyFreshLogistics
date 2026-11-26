// Quote code / quote number generation, ported from the QUOTE sheet's own formulas
// in BLL_QUOTES_SYSTEM.xlsx:
//
//   Quote Code:   ="QBL"&MONTH(date)&RIGHT(YEAR(date),2)&"-"&TEXT(sequence,"00")
//                 e.g. QBL926-01 (September 2026, 1st quote that month) — month is
//                 the PLAIN NUMBER 1-12, never zero-padded. See db/README.md.
//
//   Quote Number: ="BRV-"&TEXT(date,"YYMMDD")&"-"&TEXT(sequence,"000")
//                 e.g. BRV-260908-001
//
// The workbook derives both sequences as "count of existing rows in the period,
// plus one". The API instead takes them from the `quote_sequences` counter table
// (db/migrations/0002_quote_sequences.sql), which only ever goes up, so deleting
// a quote can't make a later one reuse its code. The caller reserves the
// sequence inside the same transaction that inserts the quote — see
// src/app/api/quotes/route.ts — so this module stays a pure formatter.

/** Bravair is Nairobi-based: quote dates (and so codes and numbers) follow
 * East Africa Time, not the server's UTC clock. */
export const QUOTE_TIMEZONE = "Africa/Nairobi";

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

function parseIsoDate(quoteDateIso: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(quoteDateIso);
  if (!match) throw new Error(`expected a YYYY-MM-DD date, got: ${quoteDateIso}`);
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

/** Counter period for the quote code: one sequence per calendar month. */
export function quoteCodePeriod(quoteDateIso: string): string {
  return quoteDateIso.slice(0, 7);
}

/** Counter period for the quote number: one sequence per calendar day. */
export function quoteNumberPeriod(quoteDateIso: string): string {
  return quoteDateIso.slice(0, 10);
}

/** "QBL" + month (1-12, unpadded) + 2-digit year + "-" + 2-digit sequence. */
export function buildQuoteCode(quoteDateIso: string, sequence: number): string {
  const { year, month } = parseIsoDate(quoteDateIso);
  return `QBL${month}${pad(year % 100, 2)}-${pad(sequence, 2)}`;
}

/** "BRV-" + YYMMDD + "-" + 3-digit sequence. */
export function buildQuoteNumber(quoteDateIso: string, sequence: number): string {
  const { year, month, day } = parseIsoDate(quoteDateIso);
  return `BRV-${pad(year % 100, 2)}${pad(month, 2)}${pad(day, 2)}-${pad(sequence, 3)}`;
}
