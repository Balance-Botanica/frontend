#!/usr/bin/env node

// Check orders data in the database
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
    console.log('🔍 Checking orders data...');

    // Get all orders
    const orders = db.prepare('SELECT * FROM orders').all();
    console.log('📦 Orders in database:', orders.length);

    orders.forEach((order, index) => {
        console.log(`\n📋 Order #${index + 1}:`);
        console.log('   ID:', order.id);
        console.log('   User ID:', order.user_id);
        console.log('   Total:', order.total);
        console.log('   Status:', order.status);
        console.log('   Items:', JSON.parse(order.items || '[]'));
        console.log('   Delivery Address:', order.delivery_address ? JSON.parse(order.delivery_address) : null);
        console.log('   Created At:', new Date(order.created_at * 1000));
    });

    // Check delivery_addresses table
    console.log('\n🏠 Checking delivery_addresses table...');
    const deliveryAddresses = db.prepare('SELECT * FROM delivery_addresses').all();
    console.log('📍 Delivery addresses:', deliveryAddresses.length);

    deliveryAddresses.forEach((addr, index) => {
        console.log(`\n📋 Address #${index + 1}:`);
        console.log('   ID:', addr.id);
        console.log('   User ID:', addr.user_id);
        console.log('   Name:', addr.name);
        console.log('   Nova Post:', addr.use_nova_post ? 'Yes' : 'No');
        console.log('   Warehouse:', addr.np_warehouse);
        console.log('   City:', addr.np_city_name);
    });

} catch (error) {
    console.error('❌ Database query failed:', error);
    process.exit(1);
} finally {
    db.close();
}
