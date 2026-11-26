# Bravair quotes database

Postgres backend replacing `BLL_QUOTES_SYSTEM.xlsx`, the manual air-cargo quoting
workbook. This directory holds the schema, the one-time extraction from the workbook,
and the seed loader.

## Setup

```bash
# 1. Create the role and database (adjust password)
createuser bravair
createdb bravair_quotes -O bravair
psql -c "ALTER ROLE bravair WITH PASSWORD 'your-password'"

# 2. Copy env and fill in DATABASE_URL + INTERNAL_API_KEY
cp .env.example .env.local

# 3. Apply the schema
psql "$DATABASE_URL" -f db/migrations/0001_init.sql

# 4. (Re-)extract from the workbook, if seed.json needs regenerating
python db/seed-data/extract_from_xlsx.py "/path/to/BLL_QUOTES_SYSTEM.xlsx"

# 5. Load it
npm run seed
```

Expected seed output:

```
origins:      3
destinations: 21
airlines:     15
commodities:  8
subtypes:     246
settings:     6
rates:        23
surcharges:   1
```

## Schema

| Table | Source sheet | Notes |
|---|---|---|
| `origins`, `destinations` | `LISTS` columns A, B | Airport codes, used as text FKs elsewhere |
| `airlines`, `commodities` | `LISTS` columns D, C | |
| `commodity_subtypes` | `LISTS` columns E, F | See issue 1 below — these two columns had to be split, not just copied |
| `settings` | `SETTINGS` | Key/value + description, 6 rows |
| `rates` | `RATE_ENGINE` | Buy rates by (origin, destination, commodity, airline); `effective_from`/`effective_to`/`status` are nullable — see issue 6 |
| `surcharges` | `SURCHARGES` | Fuel/security/other + flat charges by (origin, destination, commodity) |
| `quotes` | `QUOTE` / `QUOTE_LOG` | One row per finalized quotation; created only via `POST /api/quotes` |

## Pricing formula

Ported from the `PRICING_ENGINE` sheet:

```
volumetricWeightKg = Σ(pieces × L(cm) × W(cm) × H(cm)) / VOL_DIVISOR      (per line, summed)
chargeableWeightKg = ceil(max(grossWeightKg, volumetricWeightKg), CWT_ROUNDING_INCREMENT)
weightBasis         = volumetric > gross ? "VOLUMETRIC" : "GROSS"

rate     = first ACTIVE rates row matching (origin, destination, commodity, airline)
           with effective_from <= readyDate <= effective_to
effectiveBuyRate = rate.negotiated_buy_rate_usd_kg ?? rate.buy_rate_usd_kg
minMargin        = rate.minimum_margin_usd_kg ?? SETTINGS.BRAVAIR_MIN_MARGIN_USD_KG

surcharge = first ACTIVE surcharges row matching (origin, destination, commodity)
            with the same date-range check
perKgAirlineCost = effectiveBuyRate + fuel + security + other
flatCharges      = surcharge.flat_airline_charges_usd ?? 0

minSellingRateUsdKg = perKgAirlineCost + minMargin + flatCharges / chargeableWeightKg
approvedRateUsdKg   = managementOverrideRateUsdKg ?? minSellingRateUsdKg
freightTotalUsd     = max(approvedRateUsdKg × chargeableWeightKg,
                           rate.minimum_charge_usd ?? 0,
                           SETTINGS.GLOBAL_MIN_CHARGE_USD)
rateFound           = a matching rate row was found
```

Implemented in `src/lib/pricing.ts`.

## Quote code / quote number

From the `QUOTE` sheet's own formulas:

- **Quote code**: `"QBL" + month(1-12, unpadded) + 2-digit year + "-" + 2-digit sequence`,
  e.g. `QBL926-01` (September 2026, 1st quote that month), `QBL1026-01` (October). The
  month is a plain number, never zero-padded or abbreviated — confirmed against both the
  `INSTRUCTIONS` sheet's worked example and the live formula on `QUOTE!A62`.
- **Quote number**: `"BRV-" + YYMMDD + "-" + 3-digit sequence`, e.g. `BRV-260908-001`.

Both sequences are "count of existing quotes in the same period, plus one" — month for
the code, exact date for the number. `src/app/api/quotes/route.ts` computes both counts
and takes an advisory lock inside the same transaction so concurrent requests can't be
handed the same sequence number (the workbook's `COUNT()`-based approach is safe with one
person editing at a time; a shared API needs the lock to keep that guarantee).

Implemented in `src/lib/quoteCode.ts`.

## Known data-quality issues in the source workbook

1. **Subtypes are two flat, unlabeled lists.** `LISTS` column E packs six commodities'
   subtypes back-to-back (Flowers, Herbs, Meat, Coffee, Fruits, Vegetables), and column F
   packs two more (Pharma, Seafood) — with no commodity column, only a trailing
   `"Other <Commodity>"` sentinel row marking where each run ends.
   `extract_from_xlsx.py` splits on that sentinel and assigns the preceding run to the
   commodity it names. Counts: Flowers 33, Herbs 26, Meat 26, Coffee 13, Fruits 37,
   Vegetables 50 (column E, 185 total) + Pharma 25, Seafood 36 (column F, 61 total) =
   **246**.

2. **One duplicate rate key.** `RATE_ENGINE` rows 3 and 6 are both
   `NBO|AMS|Flowers|Kenya Airways Cargo` with conflicting buy rate, minimum charge, and
   minimum margin. Excel's own lookup (`MATCH(1, RATE_ENGINE!$O$3:$O$52, 0)`) always
   resolves to the first matching row, so extraction keeps row 3 and drops row 6. 24
   populated rows → **23 unique rates**.

3. **Whitespace mismatch on an airline name.** Row 5's airline is stored as
   `"Lufthansa  Cargo"` (double space) against the canonical `"Lufthansa Cargo"` in
   `LISTS`. `norm()` trims and collapses internal whitespace on every text key before
   it's used for grouping or lookups, so this still resolves to the right airline.

4. **One invalid date.** Row 6's effective-to is literal text `"2026-12-32"` — day 32
   doesn't exist. `parse_date_rollover()` reproduces Excel's own rollover arithmetic
   (`date(year, month, 1) + (day - 1) days` → `2027-01-01`) rather than raising. This
   doesn't affect any seeded rate, since row 6 is already the loser from issue 2.

5. **20 of the 23 rate rows are unactivated placeholders.** Rows 7–26 (all
   `Kenya Airways Cargo`, one per remaining destination/commodity combination) have a
   buy rate but no `Status` and no effective dates at all. They're seeded as-is (`status`
   and both dates `NULL`), and correctly never satisfy `pricing.ts`'s "Active + in date
   range" match — `rateFound: false` for any of those lanes until Management fills in
   their status and dates, exactly as the workbook's own validation message
   ("RATE NOT FOUND OR EXPIRED — CONTACT BRAVAIR MANAGEMENT") implies. Only 3 rate rows
   (NBO→AMS→Flowers, three airlines) are fully activated in the current workbook.

6. **`PRICING_ENGINE!B18` ("Minimum Margin USD/KG (route)") is a hardcoded `0.65` in the
   workbook, not wired to a lookup**, even though the sibling cells (B14–B17) all use
   `INDEX(RATE_ENGINE!...,B12)` and the next cell (B19) is
   `IF(B18="", SETTINGS!$B$6, B18)` — a fallback that only makes sense if B18 can be
   blank per route. This is a stray manual-test value. Recomputing the workbook's own
   worked example (NBO→AMS, Flowers, Kenya Airways Cargo, 260kg, one 2×50×80×120cm line)
   both ways:
   - Matched row's own minimum margin (0.52): `(2.65 + 0.52) × 260 + 100 = 924.20` ✓
   - Workbook's literal hardcoded 0.65: `(2.65 + 0.65) × 260 + 100 = 958.00` ✗

   `pricing.ts` implements the first: minimum margin from the matched rate row, falling
   back to `SETTINGS.BRAVAIR_MIN_MARGIN_USD_KG` when that column is blank.

## Access control

Per the workbook's own `INSTRUCTIONS` sheet: "Sales only ever sees the results pulled
through to the QUOTE sheet... never the buy rate, surcharges, or margin themselves."

- `GET /api/lists` — public, dropdown data only.
- `POST /api/quotes/price` — public by default, returning only `rateFound`,
  `chargeableWeightKg`, `weightBasis`, `approvedFreightRateUsdKg`, `freightTotalUsd`.
  With a valid `x-internal-api-key` header **and** `?internal=1`, returns the full
  breakdown (buy rate, negotiated/effective rate, surcharge components, margin,
  minimum charge). `managementOverrideRateUsdKg` is only honoured on such an internal
  request; on a public request it is ignored.
- `POST /api/quotes` — always requires a valid `x-internal-api-key` header; this is the
  write path that permanently logs a quote code/number (the API equivalent of pasting a
  row into `QUOTE_LOG` as values).
- Both quote endpoints return **422** with `rateFound: false` and no price when no
  Active, in-date rate matches (the workbook's "RATE NOT FOUND OR EXPIRED" case), so an
  unpriced lane is never quoted or logged.

`npm run seed` is safe to re-run against a database with logged quotes: it reloads
`rates`, `surcharges` and `settings`, and upserts the lookup tables (origins,
destinations, commodities, subtypes, airlines) without deleting them, since `quotes`
references their rows. Lookup entries removed from the workbook are therefore not
deleted automatically.
