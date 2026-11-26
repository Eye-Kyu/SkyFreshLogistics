import { Pool } from "pg";

// Single shared connection pool. Next.js dev mode reloads this module on
// every edit, so stash the pool on `globalThis` to avoid leaking a new pool
// (and a new set of TCP connections) on each hot reload.
declare global {
  var __bravairPgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
  }
  return new Pool({ connectionString });
}

function getPool(): Pool {
  if (!global.__bravairPgPool) {
    global.__bravairPgPool = createPool();
  }
  return global.__bravairPgPool;
}

// Exported as a Proxy so constructing the real Pool (and checking for
// DATABASE_URL) is deferred until a request actually runs a query, not when
// this module is imported. Next.js imports every API route module during
// `next build`'s "Collect page data" step to analyze it statically — with an
// eagerly-created pool, that step crashed the build in any environment
// (CI, a fresh clone) where DATABASE_URL isn't set yet, well before any
// route actually needed a live connection.
export const pool: Pool = new Proxy({} as Pool, {
  get(_target, prop) {
    const real = getPool();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
