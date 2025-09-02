import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same database path as the app
const dbPath = path.join(__dirname, '..', 'drizzle.db');
const db = new Database(dbPath);

console.log('Creating promo codes tables...');

// Create promo_codes table
const createPromoCodesTable = `
CREATE TABLE IF NOT EXISTS promo_codes (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL,
    discount_value REAL NOT NULL,
    minimum_amount REAL DEFAULT 0,
    maximum_discount REAL,
    is_active INTEGER DEFAULT 1 NOT NULL,
    expires_at INTEGER,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_at INTEGER,
    updated_at INTEGER
);
`;

// Create promo_code_usages table
const createPromoCodeUsagesTable = `
CREATE TABLE IF NOT EXISTS promo_code_usages (
    id TEXT PRIMARY KEY NOT NULL,
    promo_code_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    order_id TEXT,
    used_at INTEGER,
    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

// Create unique index
const createIndex = `
CREATE UNIQUE INDEX IF NOT EXISTS promo_codes_code_unique ON promo_codes (code);
`;

try {
    db.exec(createPromoCodesTable);
    console.log('✅ promo_codes table created');

    db.exec(createPromoCodeUsagesTable);
    console.log('✅ promo_code_usages table created');

    db.exec(createIndex);
    console.log('✅ promo_codes_code_unique index created');

    console.log('🎉 Promo codes tables setup complete!');
} catch (error) {
    console.error('❌ Error creating promo codes tables:', error);
} finally {
    db.close();
}
