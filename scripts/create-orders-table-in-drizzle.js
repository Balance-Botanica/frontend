#!/usr/bin/env node

// Create orders table in drizzle.db
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../drizzle.db');
console.log('Database path:', dbPath);

// Open database connection
const db = new Database(dbPath);

try {
    console.log('🔧 Creating orders table in drizzle.db...');

    // Create orders table
    const createOrdersTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            items TEXT NOT NULL,
            total INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            delivery_address TEXT,
            notes TEXT,
            created_at INTEGER,
            updated_at INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `;

    db.exec(createOrdersTableSQL);
    console.log('✅ orders table created successfully in drizzle.db!');

    // Verify the table was created
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'").get();
    if (tables) {
        console.log('✅ Table verification successful');

        // Show table structure
        const columns = db.prepare('PRAGMA table_info(orders)').all();
        console.log('📋 Orders table structure:');
        columns.forEach(col => {
            console.log(`   - ${col.name} (${col.type})`);
        });

        // Check if there's a user in the database
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        console.log(`👤 Total users in drizzle.db: ${userCount.count}`);

        if (userCount.count > 0) {
            const firstUser = db.prepare('SELECT id, email FROM users LIMIT 1').get();
            console.log('👤 First user:', firstUser);
        }

    } else {
        console.log('❌ Table creation failed');
    }

} catch (error) {
    console.error('❌ Failed to create orders table:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
