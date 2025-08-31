#!/usr/bin/env node

// Create delivery_addresses table
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../local.db');
console.log('Database path:', dbPath);

// Open database connection
const db = new Database(dbPath);

try {
    console.log('🔧 Creating delivery_addresses table...');

    // Create delivery_addresses table
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS delivery_addresses (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT,
            is_default INTEGER DEFAULT 0,
            street TEXT NOT NULL,
            city TEXT NOT NULL,
            postal_code TEXT NOT NULL,
            country TEXT NOT NULL DEFAULT 'Ukraine',
            np_city_name TEXT,
            np_city_full_name TEXT,
            np_warehouse TEXT,
            use_nova_post INTEGER DEFAULT 0,
            created_at INTEGER,
            updated_at INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `;

    db.exec(createTableSQL);
    console.log('✅ delivery_addresses table created successfully!');

    // Verify the table was created
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='delivery_addresses'").get();
    if (tables) {
        console.log('✅ Table verification successful');

        // Show table structure
        const columns = db.prepare('PRAGMA table_info(delivery_addresses)').all();
        console.log('📋 Table structure:');
        columns.forEach(col => {
            console.log(`   - ${col.name} (${col.type})`);
        });
    } else {
        console.log('❌ Table creation failed');
    }

} catch (error) {
    console.error('❌ Failed to create delivery_addresses table:', error);
    process.exit(1);
} finally {
    db.close();
}
