import { pool } from "./db";

// What the rate engine can quote, read from the same tables as GET /api/lists.
// Returns null when the database is unreachable (for example during `next
// build` without DATABASE_URL), so pages render without the board.

const AIRPORTS: Record<string, { city: string; region: string }> = {
  ADD: { city: "Addis Ababa", region: "Africa" },
  AMS: { city: "Amsterdam", region: "Europe" },
  AUH: { city: "Abu Dhabi", region: "Middle East" },
  BOM: { city: "Mumbai", region: "Asia" },
  BRU: { city: "Brussels", region: "Europe" },
  CAI: { city: "Cairo", region: "Africa" },
  CDG: { city: "Paris Charles de Gaulle", region: "Europe" },
  DEL: { city: "Delhi", region: "Asia" },
  DOH: { city: "Doha", region: "Middle East" },
  DXB: { city: "Dubai", region: "Middle East" },
  FRA: { city: "Frankfurt", region: "Europe" },
  JED: { city: "Jeddah", region: "Middle East" },
  JFK: { city: "New York JFK", region: "Americas" },
  JNB: { city: "Johannesburg", region: "Africa" },
  LGW: { city: "London Gatwick", region: "Europe" },
  LHR: { city: "London Heathrow", region: "Europe" },
  MAD: { city: "Madrid", region: "Europe" },
  MCT: { city: "Muscat", region: "Middle East" },
  MXP: { city: "Milan Malpensa", region: "Europe" },
  NBO: { city: "Nairobi", region: "Africa" },
  RUH: { city: "Riyadh", region: "Middle East" },
  YYZ: { city: "Toronto", region: "Americas" },
};

function airport(code: string) {
  return AIRPORTS[code] ?? { city: code, region: "" };
}

export interface LaneSummary {
  destinations: { code: string; city: string; region: string }[];
  airlines: number;
  products: number;
}

export async function getLaneSummary(): Promise<LaneSummary | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const [destinations, airlines, subtypes] = await Promise.all([
      pool.query<{ code: string }>("select code from destinations order by code"),
      pool.query<{ n: string }>("select count(*)::text as n from airlines"),
      pool.query<{ n: string }>("select count(*)::text as n from commodity_subtypes"),
    ]);
    return {
      destinations: destinations.rows.map((d) => ({ code: d.code, ...airport(d.code) })),
      airlines: Number(airlines.rows[0]?.n ?? 0),
      products: Number(subtypes.rows[0]?.n ?? 0),
    };
  } catch {
    return null;
  }
}
