import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

type Env = {
  DATABASE_URL: string;
}

export function getConnectionString(env?: Env) {
  return env?.DATABASE_URL || process.env.DATABASE_URL;
}

export function createDb(env?: Env) {
  const connectionString = getConnectionString(env);
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const pool = new Pool({ connectionString });
  return drizzle(pool, { schema });
}

export const db = createDb();