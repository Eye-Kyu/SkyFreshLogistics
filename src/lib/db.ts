import { Pool } from "pg";

// Single shared connection pool. Next.js dev mode reloads this module on
// every edit, so stash the pool on `globalThis` to avoid leaking a new pool
// (and a new set of TCP connections) on each hot reload.
declare global {
  // eslint-disable-next-line no-var
  var __bravairPgPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
  }
  return new Pool({ connectionString });
}

export const pool = global.__bravairPgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  global.__bravairPgPool = pool;
}
