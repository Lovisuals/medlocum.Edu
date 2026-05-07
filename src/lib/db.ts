import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pgPool: Pool };

export const db = globalForPg.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

if (process.env.NODE_ENV !== 'production') globalForPg.pgPool = db;

db.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});
