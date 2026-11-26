import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// GET /api/lists — dropdown data for the quote form: origins, destinations,
// airlines, and commodities with their subtypes nested. Mirrors the LISTS sheet.
export async function GET() {
  const [origins, destinations, airlines, commodities, subtypes] = await Promise.all([
    pool.query<{ code: string; name: string }>("select code, name from origins order by code"),
    pool.query<{ code: string; name: string }>("select code, name from destinations order by code"),
    pool.query<{ id: number; name: string }>("select id, name from airlines order by name"),
    pool.query<{ id: number; name: string }>("select id, name from commodities order by name"),
    pool.query<{ commodity_id: number; name: string }>(
      "select commodity_id, name from commodity_subtypes order by commodity_id, name"
    ),
  ]);

  const subtypesByCommodity = new Map<number, string[]>();
  for (const row of subtypes.rows) {
    const list = subtypesByCommodity.get(row.commodity_id) ?? [];
    list.push(row.name);
    subtypesByCommodity.set(row.commodity_id, list);
  }

  return NextResponse.json({
    origins: origins.rows,
    destinations: destinations.rows,
    airlines: airlines.rows.map((a) => a.name),
    commodities: commodities.rows.map((c) => ({
      id: c.id,
      name: c.name,
      subtypes: subtypesByCommodity.get(c.id) ?? [],
    })),
  });
}
