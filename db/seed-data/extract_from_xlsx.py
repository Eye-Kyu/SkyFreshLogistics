#!/usr/bin/env python3
"""Extract seed data for the Bravair quotes system from the source workbook
(BLL_QUOTES_SYSTEM.xlsx) into db/seed-data/seed.json.

Usage:
    python extract_from_xlsx.py "/path/to/BLL_QUOTES_SYSTEM.xlsx"

The workbook is the single source of truth for dropdown lists (LISTS), airline buying
rates (RATE_ENGINE), surcharges (SURCHARGES), and global settings (SETTINGS). This
script's job is purely mechanical extraction — see db/README.md for the schema this
feeds and for a full write-up of the data-quality issues handled below.

Known data-quality issues in the source workbook (all handled here, not by hand-editing
the workbook or by "fixing" it in seed.ts):

1. LISTS columns E and F each pack several commodities' subtypes into one flat list,
   with no explicit commodity column — only a trailing "Other <Commodity>" sentinel row
   marks the end of each run. We split on that sentinel.
2. RATE_ENGINE has one duplicate lookup key: two rows for the same
   (origin, destination, commodity, airline). Excel's own MATCH(1, ...) always resolves
   to whichever row comes first in sheet order, so we keep the first occurrence and drop
   the rest — not an average, not an error.
3. One RATE_ENGINE airline name has doubled internal whitespace ("Lufthansa  Cargo")
   that doesn't match the canonical LISTS spelling. norm() collapses whitespace (and
   trims) on every text key before it's used for lookups or grouping.
4. One effective-to date is stored as literal text "2026-12-32", which is not a real
   calendar date. It's parsed by rolling the day count over into the next month (the same
   arithmetic Excel itself would do), rather than raising or discarding the row — that
   row is already the loser from issue 2, so its exact expiry value never affects any
   seeded rate, but the parser still needs to not crash on it.
"""

import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

from openpyxl import load_workbook


def norm(value):
    """Normalize a text lookup key: trim, and collapse any run of internal
    whitespace to a single space. Fixes the "Lufthansa  Cargo" (double space)
    vs "Lufthansa Cargo" (LISTS canonical spelling) mismatch in RATE_ENGINE.
    Returns None for blank/None input so callers can treat "no value" uniformly.
    """
    if value is None:
        return None
    text = str(value).strip()
    if text == "":
        return None
    return re.sub(r"\s+", " ", text)


def parse_date_rollover(value):
    """Parse a "YYYY-MM-DD" text date, rolling over an invalid day count the
    way Excel's own date arithmetic would (e.g. 2026-12-32 -> 2027-01-01)
    instead of raising ValueError. Returns None for blank input.
    """
    text = norm(value)
    if text is None:
        return None
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", text)
    if not m:
        raise ValueError(f"unrecognized date format: {value!r}")
    year, month, day = int(m.group(1)), int(m.group(2)), int(m.group(3))
    # date(year, month, 1) + (day - 1) days reproduces Excel's rollover for an
    # out-of-range day (e.g. day 32 in a 31-day month rolls into next month).
    return (date(year, month, 1) + timedelta(days=day - 1)).isoformat()


def col_values(ws, col, first_row, last_row=None):
    """Yield normalized, non-None values from a single column, top to bottom,
    stopping at the first blank cell unless last_row is given explicitly."""
    row = first_row
    while True:
        if last_row is not None and row > last_row:
            return
        cell = ws.cell(row=row, column=col).value
        value = norm(cell)
        if value is None:
            if last_row is None:
                return
        else:
            yield row, value
        row += 1


def extract_lists(ws):
    origins = [v for _, v in col_values(ws, col=1, first_row=3)]
    destinations = [v for _, v in col_values(ws, col=2, first_row=3)]
    commodities = [v for _, v in col_values(ws, col=3, first_row=3)]
    airlines = [v for _, v in col_values(ws, col=4, first_row=3)]

    commodity_names = set(commodities)
    subtypes_by_commodity = {name: [] for name in commodities}

    def split_flat_column(col):
        buffer = []
        for _, value in col_values(ws, col=col, first_row=3):
            buffer.append(value)
            if value.startswith("Other "):
                commodity_name = value[len("Other "):]
                if commodity_name not in commodity_names:
                    raise ValueError(
                        f"subtype sentinel {value!r} names an unknown commodity "
                        f"{commodity_name!r} (known: {sorted(commodity_names)})"
                    )
                subtypes_by_commodity[commodity_name].extend(buffer)
                buffer = []
        if buffer:
            raise ValueError(
                f"column {col} ended with {len(buffer)} subtype(s) not terminated "
                f"by an 'Other <Commodity>' sentinel: {buffer}"
            )

    split_flat_column(col=5)  # E
    split_flat_column(col=6)  # F

    return {
        "origins": origins,
        "destinations": destinations,
        "commodities": commodities,
        "airlines": airlines,
        "subtypes_by_commodity": subtypes_by_commodity,
    }


def extract_settings(ws):
    settings = []
    row = 4
    while True:
        key = norm(ws.cell(row=row, column=1).value)
        if key is None:
            break
        value = ws.cell(row=row, column=2).value
        description = norm(ws.cell(row=row, column=3).value)
        settings.append({"key": key, "value": str(value).strip(), "description": description})
        row += 1
    return settings


def extract_rates(ws):
    """Read RATE_ENGINE rows 3.. until the first row with no Origin, dedupe
    duplicate (origin, destination, commodity, airline) keys keeping the
    first occurrence (matches Excel's MATCH(1, ...) semantics), and return
    the deduped list plus a report of what was dropped."""
    raw_rows = []
    row = 3
    while True:
        origin = norm(ws.cell(row=row, column=2).value)  # B
        if origin is None:
            break
        destination = norm(ws.cell(row=row, column=3).value)  # C
        commodity = norm(ws.cell(row=row, column=4).value)  # D
        airline = norm(ws.cell(row=row, column=5).value)  # E
        buy_rate = ws.cell(row=row, column=6).value  # F
        negotiated = ws.cell(row=row, column=7).value  # G
        minimum_charge = ws.cell(row=row, column=9).value  # I
        minimum_margin = ws.cell(row=row, column=10).value  # J
        effective_from = parse_date_rollover(ws.cell(row=row, column=11).value)  # K
        effective_to = parse_date_rollover(ws.cell(row=row, column=12).value)  # L
        status = norm(ws.cell(row=row, column=13).value)  # M
        notes = norm(ws.cell(row=row, column=14).value)  # N

        raw_rows.append(
            {
                "row": row,
                "origin": origin,
                "destination": destination,
                "commodity": commodity,
                "airline": airline,
                "buy_rate_usd_kg": buy_rate,
                "negotiated_buy_rate_usd_kg": negotiated,
                "minimum_charge_usd": minimum_charge,
                "minimum_margin_usd_kg": minimum_margin,
                "effective_from": effective_from,
                "effective_to": effective_to,
                "status": status,
                "notes": notes,
            }
        )
        row += 1

    seen_keys = {}
    deduped = []
    dropped = []
    for entry in raw_rows:
        key = (entry["origin"], entry["destination"], entry["commodity"], entry["airline"])
        if key in seen_keys:
            dropped.append({"row": entry["row"], "key": key, "kept_row": seen_keys[key]})
            continue
        seen_keys[key] = entry["row"]
        deduped.append(entry)

    return deduped, dropped


def extract_surcharges(ws):
    rows = []
    row = 3
    while True:
        origin = norm(ws.cell(row=row, column=2).value)  # B
        if origin is None:
            break
        destination = norm(ws.cell(row=row, column=3).value)  # C
        commodity = norm(ws.cell(row=row, column=4).value)  # D
        fuel = ws.cell(row=row, column=5).value  # E
        security = ws.cell(row=row, column=6).value  # F
        other = ws.cell(row=row, column=7).value  # G
        flat = ws.cell(row=row, column=8).value  # H
        effective_from = parse_date_rollover(ws.cell(row=row, column=9).value)  # I
        effective_to = parse_date_rollover(ws.cell(row=row, column=10).value)  # J
        status = norm(ws.cell(row=row, column=11).value)  # K
        notes = norm(ws.cell(row=row, column=12).value)  # L
        rows.append(
            {
                "origin": origin,
                "destination": destination,
                "commodity": commodity,
                "fuel_surcharge_usd_kg": fuel or 0,
                "security_surcharge_usd_kg": security or 0,
                "other_surcharge_usd_kg": other or 0,
                "flat_airline_charges_usd": flat or 0,
                "effective_from": effective_from,
                "effective_to": effective_to,
                "status": status,
                "notes": notes,
            }
        )
        row += 1
    return rows


def main():
    if len(sys.argv) != 2:
        print(f"usage: {sys.argv[0]} <path-to-BLL_QUOTES_SYSTEM.xlsx>", file=sys.stderr)
        sys.exit(1)

    workbook_path = Path(sys.argv[1])
    wb = load_workbook(workbook_path, data_only=True)

    lists_data = extract_lists(wb["LISTS"])
    settings = extract_settings(wb["SETTINGS"])
    rates, dropped_rates = extract_rates(wb["RATE_ENGINE"])
    surcharges = extract_surcharges(wb["SURCHARGES"])

    subtype_count = sum(len(v) for v in lists_data["subtypes_by_commodity"].values())

    seed = {
        "origins": lists_data["origins"],
        "destinations": lists_data["destinations"],
        "commodities": lists_data["commodities"],
        "airlines": lists_data["airlines"],
        "subtypes_by_commodity": lists_data["subtypes_by_commodity"],
        "settings": settings,
        "rates": rates,
        "surcharges": surcharges,
    }

    out_path = Path(__file__).parent / "seed.json"
    out_path.write_text(json.dumps(seed, indent=2), encoding="utf-8")

    print(f"Wrote {out_path}")
    print(f"  origins:      {len(seed['origins'])}")
    print(f"  destinations: {len(seed['destinations'])}")
    print(f"  airlines:     {len(seed['airlines'])}")
    print(f"  commodities:  {len(seed['commodities'])}")
    print(f"  subtypes:     {subtype_count}")
    print(f"  settings:     {len(seed['settings'])}")
    print(f"  rates:        {len(seed['rates'])} (dropped {len(dropped_rates)} duplicate-key row(s))")
    for d in dropped_rates:
        print(f"    - row {d['row']} dropped as duplicate of row {d['kept_row']}: key={d['key']}")
    print(f"  surcharges:   {len(seed['surcharges'])}")


if __name__ == "__main__":
    main()
