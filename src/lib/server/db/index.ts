import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Use process.env for environment variables, with fallback to Drizzle database
const DATABASE_URL = process.env.DATABASE_URL || './drizzle.db';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = new Database(DATABASE_URL);

export const db = drizzle(client, { schema });
