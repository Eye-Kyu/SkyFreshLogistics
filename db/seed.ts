// Loads db/seed-data/seed.json (produced by db/seed-data/extract_from_xlsx.py) into
// Postgres. Run with `npm run seed` after applying db/migrations/0001_init.sql.
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

config({ path: join(__dirname, "..", ".env.local") });

interface SeedRate {
  origin: string;
  destination: string;
  commodity: string;
  airline: string;
  buy_rate_usd_kg: number;
  negotiated_buy_rate_usd_kg: number | null;
  minimum_charge_usd: number | null;
  minimum_margin_usd_kg: number | null;
  effective_from: string | null;
  effective_to: string | null;
  status: string | null;
  notes: string | null;
}

interface SeedSurcharge {
  origin: string;
  destination: string;
  commodity: string;
  fuel_surcharge_usd_kg: number;
  security_surcharge_usd_kg: number;
  other_surcharge_usd_kg: number;
  flat_airline_charges_usd: number;
  effective_from: string | null;
  effective_to: string | null;
  status: string | null;
  notes: string | null;
}

interface SeedSetting {
  key: string;
  value: string;
  description: string | null;
}

interface SeedData {
  origins: string[];
  destinations: string[];
  commodities: string[];
  airlines: string[];
  subtypes_by_commodity: Record<string, string[]>;
  settings: SeedSetting[];
  rates: SeedRate[];
  surcharges: SeedSurcharge[];
}

async function main() {
  const seedPath = join(__dirname, "seed-data", "seed.json");
  const seed: SeedData = JSON.parse(readFileSync(seedPath, "utf-8"));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    await client.query("begin");

    // Wipe existing reference data so re-running the seed is idempotent.
    // Order matters: children before parents.
    await client.query(
      "truncate table rates, surcharges, commodity_subtypes, commodities, airlines, destinations, origins restart identity cascade"
    );
    await client.query("delete from settings");

    for (const code of seed.origins) {
      await client.query("insert into origins (code, name) values ($1, $1)", [code]);
    }
    for (const code of seed.destinations) {
      await client.query("insert into destinations (code, name) values ($1, $1)", [code]);
    }

    const commodityIds = new Map<string, number>();
    for (const name of seed.commodities) {
      const { rows } = await client.query<{ id: number }>(
        "insert into commodities (name) values ($1) returning id",
        [name]
      );
      commodityIds.set(name, rows[0].id);
    }

    const airlineIds = new Map<string, number>();
    for (const name of seed.airlines) {
      const { rows } = await client.query<{ id: number }>(
        "insert into airlines (name) values ($1) returning id",
        [name]
      );
      airlineIds.set(name, rows[0].id);
    }

    let subtypeCount = 0;
    for (const [commodityName, subtypes] of Object.entries(seed.subtypes_by_commodity)) {
      const commodityId = commodityIds.get(commodityName);
      if (!commodityId) throw new Error(`subtype group references unknown commodity: ${commodityName}`);
      for (const subtypeName of subtypes) {
        await client.query("insert into commodity_subtypes (commodity_id, name) values ($1, $2)", [
          commodityId,
          subtypeName,
        ]);
        subtypeCount++;
      }
    }

    for (const setting of seed.settings) {
      await client.query("insert into settings (key, value, description) values ($1, $2, $3)", [
        setting.key,
        setting.value,
        setting.description,
      ]);
    }

    for (const rate of seed.rates) {
      const commodityId = commodityIds.get(rate.commodity);
      const airlineId = airlineIds.get(rate.airline);
      if (!commodityId) throw new Error(`rate references unknown commodity: ${rate.commodity}`);
      if (!airlineId) throw new Error(`rate references unknown airline: ${rate.airline}`);
      await client.query(
        `insert into rates
           (origin_code, destination_code, commodity_id, airline_id, buy_rate_usd_kg,
            negotiated_buy_rate_usd_kg, minimum_charge_usd, minimum_margin_usd_kg,
            effective_from, effective_to, status, notes)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          rate.origin,
          rate.destination,
          commodityId,
          airlineId,
          rate.buy_rate_usd_kg,
          rate.negotiated_buy_rate_usd_kg,
          rate.minimum_charge_usd,
          rate.minimum_margin_usd_kg,
          rate.effective_from,
          rate.effective_to,
          rate.status,
          rate.notes,
        ]
      );
    }

    for (const surcharge of seed.surcharges) {
      const commodityId = commodityIds.get(surcharge.commodity);
      if (!commodityId) throw new Error(`surcharge references unknown commodity: ${surcharge.commodity}`);
      await client.query(
        `insert into surcharges
           (origin_code, destination_code, commodity_id, fuel_surcharge_usd_kg,
            security_surcharge_usd_kg, other_surcharge_usd_kg, flat_airline_charges_usd,
            effective_from, effective_to, status, notes)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          surcharge.origin,
          surcharge.destination,
          commodityId,
          surcharge.fuel_surcharge_usd_kg,
          surcharge.security_surcharge_usd_kg,
          surcharge.other_surcharge_usd_kg,
          surcharge.flat_airline_charges_usd,
          surcharge.effective_from,
          surcharge.effective_to,
          surcharge.status,
          surcharge.notes,
        ]
      );
    }

    await client.query("commit");

    console.log("Seed complete:");
    console.log(`  origins:      ${seed.origins.length}`);
    console.log(`  destinations: ${seed.destinations.length}`);
    console.log(`  airlines:     ${seed.airlines.length}`);
    console.log(`  commodities:  ${seed.commodities.length}`);
    console.log(`  subtypes:     ${subtypeCount}`);
    console.log(`  settings:     ${seed.settings.length}`);
    console.log(`  rates:        ${seed.rates.length}`);
    console.log(`  surcharges:   ${seed.surcharges.length}`);
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
