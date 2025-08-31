#!/usr/bin/env node

// Check drizzle.db database structure
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
    console.log('🔍 Checking drizzle.db structure...');

    // Get all table names
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📋 Tables in drizzle.db:');
    tables.forEach(table => {
        console.log(`  - ${table.name}`);
    });

    // Check users table structure
    const usersTable = tables.find(t => t.name === 'users');
    if (usersTable) {
        console.log('\n👤 Users table structure:');
        const userColumns = db.prepare('PRAGMA table_info(users)').all();
        userColumns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        console.log(`👥 Total users: ${userCount.count}`);
    }

    // Check orders table structure
    const ordersTable = tables.find(t => t.name === 'orders');
    if (ordersTable) {
        console.log('\n📦 Orders table structure:');
        const orderColumns = db.prepare('PRAGMA table_info(orders)').all();
        orderColumns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
        console.log(`📦 Total orders: ${orderCount.count}`);
    } else {
        console.log('\n❌ Orders table does NOT exist!');
    }

    // Check delivery_addresses table
    const deliveryTable = tables.find(t => t.name === 'delivery_addresses');
    if (deliveryTable) {
        console.log('\n🏠 delivery_addresses table structure:');
        const deliveryColumns = db.prepare('PRAGMA table_info(delivery_addresses)').all();
        deliveryColumns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        const addressCount = db.prepare('SELECT COUNT(*) as count FROM delivery_addresses').get();
        console.log(`🏠 Total addresses: ${addressCount.count}`);
    } else {
        console.log('\n❌ delivery_addresses table does NOT exist!');
    }

} catch (error) {
    console.error('❌ Database query failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
