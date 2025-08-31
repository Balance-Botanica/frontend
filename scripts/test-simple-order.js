#!/usr/bin/env node

// Simple test to check order creation without complex imports
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
    console.log('🔍 Testing database connection and order creation...');

    // Test database connection
    const testQuery = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    console.log('✅ Database connection successful, orders count:', testQuery.count);

    // Generate a simple order ID (6 digits)
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = '7907d65a-35d1-4c44-b941-76fe92c9d551'; // Use existing user ID

    console.log('📝 Creating test order with ID:', orderId);

    // Insert test order
    const insertOrderSQL = `
        INSERT INTO orders (id, user_id, items, total, status, delivery_address, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const items = JSON.stringify([
        {
            productName: 'Test Product from API',
            quantity: 1,
            price: 5000, // 50.00 UAH in kopiyky
            total: 5000
        }
    ]);

    const deliveryAddress = JSON.stringify({
        name: 'Test User from API',
        npWarehouse: 'Warehouse #1',
        npCityName: 'Kyiv'
    });

    const now = Date.now(); // Unix timestamp

    db.prepare(insertOrderSQL).run(
        orderId,
        userId,
        items,
        5000, // 100.00 UAH in kopiyky
        'pending',
        deliveryAddress,
        now,
        now
    );

    console.log(`✅ Test order created with ID: ${orderId}`);

    // Verify the data
    const verifyOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    console.log('📋 Order created:', {
        id: verifyOrder.id,
        userId: verifyOrder.user_id,
        total: verifyOrder.total,
        status: verifyOrder.status,
        items: JSON.parse(verifyOrder.items),
        deliveryAddress: JSON.parse(verifyOrder.delivery_address)
    });

    console.log('🎉 Database order creation test passed!');

} catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
} finally {
    db.close();
}
