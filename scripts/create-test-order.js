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

try {
    // Generate a simple order ID (6 digits)
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const userId = '7907d65a-35d1-4c44-b941-76fe92c9d551'; // Use existing user ID

    // Insert test order
    const insertOrderSQL = `
        INSERT INTO orders (id, user_id, items, total, status, delivery_address, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const items = JSON.stringify([
        {
            productName: 'Тестовий продукт',
            quantity: 2,
            price: 5000, // 50.00 UAH in kopiyky
            total: 10000 // 100.00 UAH in kopiyky
        }
    ]);

    const deliveryAddress = JSON.stringify({
        name: 'Тестове ім\'я',
        npWarehouse: 'Відділення №1',
        npCityName: 'Київ'
    });

    const now = Date.now(); // Unix timestamp

    db.prepare(insertOrderSQL).run(
        orderId,
        userId,
        items,
        10000, // 100.00 UAH in kopiyky
        'pending',
        deliveryAddress,
        now,
        now
    );

    console.log(`✅ Test order created with ID: ${orderId}`);

    // Verify the data
    const verifyOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    console.log('Order created:', verifyOrder);

    console.log('🎉 Test data created successfully!');

} catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
} finally {
    db.close();
}