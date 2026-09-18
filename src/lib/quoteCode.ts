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
// Both sequences are "count of existing rows in the same period, plus one" in the
// workbook (a SUMPRODUCT over QUOTE_LOG). The caller supplies that existing count
// (queried inside the same DB transaction that reserves the row — see
// src/app/api/quotes/route.ts) so this module stays a pure formatter with no I/O.

function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

/** "QBL" + month (1-12, unpadded) + 2-digit year + "-" + 2-digit sequence. */
export function buildQuoteCode(quoteDate: Date, existingCountInSameMonth: number): string {
  const month = quoteDate.getUTCMonth() + 1;
  const year2 = quoteDate.getUTCFullYear() % 100;
  const sequence = existingCountInSameMonth + 1;
  return `QBL${month}${pad(year2, 2)}-${pad(sequence, 2)}`;
}

/** "BRV-" + YYMMDD + "-" + 3-digit sequence. */
export function buildQuoteNumber(quoteDate: Date, existingCountOnSameDate: number): string {
  const year2 = quoteDate.getUTCFullYear() % 100;
  const month = quoteDate.getUTCMonth() + 1;
  const day = quoteDate.getUTCDate();
  const sequence = existingCountOnSameDate + 1;
  return `BRV-${pad(year2, 2)}${pad(month, 2)}${pad(day, 2)}-${pad(sequence, 3)}`;
}
