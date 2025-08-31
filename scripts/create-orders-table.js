#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../local.db');
console.log('Database path:', dbPath);

// Open database connection
const db = new Database(dbPath);

// Create orders table if it doesn't exist
const createOrdersTableSQL = `
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    delivery_address TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

try {
    console.log('Creating orders table...');
    db.exec(createOrdersTableSQL);
    console.log('✅ Orders table created successfully');

    console.log('🎉 All tables created successfully!');
} catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
} finally {
    db.close();
}