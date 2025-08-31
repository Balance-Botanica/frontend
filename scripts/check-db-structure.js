#!/usr/bin/env node

// Check database structure
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
    console.log('🔍 Checking database structure...');

    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📋 Tables in database:');
    tables.forEach(table => {
        console.log(`  - ${table.name}`);
    });

    // Check if users table exists
    const usersTable = tables.find(t => t.name === 'users');
    if (usersTable) {
        console.log('\n👤 Users table structure:');
        const columns = db.prepare('PRAGMA table_info(users)').all();
        columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        // Get user count
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        console.log(`👥 Total users: ${userCount.count}`);

        if (userCount.count > 0) {
            // Get first user
            const firstUser = db.prepare('SELECT * FROM users LIMIT 1').get();
            console.log('📋 First user:', firstUser);
        }
    } else {
        console.log('❌ Users table does not exist!');
    }

    // Check orders table
    const ordersTable = tables.find(t => t.name === 'orders');
    if (ordersTable) {
        console.log('\n📦 Orders table structure:');
        const columns = db.prepare('PRAGMA table_info(orders)').all();
        columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        // Get order count
        const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
        console.log(`📦 Total orders: ${orderCount.count}`);
    } else {
        console.log('❌ Orders table does not exist!');
    }

} catch (error) {
    console.error('❌ Database query failed:', error);
    process.exit(1);
} finally {
    db.close();
}
