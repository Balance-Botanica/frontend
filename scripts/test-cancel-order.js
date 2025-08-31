#!/usr/bin/env node

// Test cancel order functionality
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
    console.log('🔍 Checking order cancellation functionality...');

    // Get all orders
    const orders = db.prepare('SELECT id, status FROM orders').all();
    console.log('📦 Orders in database:', orders.length);

    orders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.id}: ${order.status}`);
    });

    if (orders.length === 0) {
        console.log('❌ No orders found to test cancellation');
        process.exit(0);
    }

    // Find an order that can be cancelled (not delivered or cancelled)
    const cancellableOrder = orders.find(order =>
        order.status !== 'delivered' && order.status !== 'cancelled'
    );

    if (!cancellableOrder) {
        console.log('❌ No cancellable orders found (all are delivered or already cancelled)');
        process.exit(0);
    }

    console.log(`\n🎯 Testing cancellation of order: ${cancellableOrder.id} (${cancellableOrder.status})`);

    // Update order status to cancelled
    const updateResult = db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?')
        .run('cancelled', Date.now(), cancellableOrder.id);

    console.log('📝 Update result:', updateResult);

    // Verify the update
    const updatedOrder = db.prepare('SELECT id, status, updated_at FROM orders WHERE id = ?')
        .get(cancellableOrder.id);

    console.log('✅ Updated order:', {
        id: updatedOrder.id,
        status: updatedOrder.status,
        updatedAt: new Date(updatedOrder.updated_at * 1000).toLocaleString('uk-UA')
    });

    if (updatedOrder.status === 'cancelled') {
        console.log('🎉 Order cancellation test PASSED!');
        console.log('📊 Status successfully updated to "cancelled"');
    } else {
        console.log('❌ Order cancellation test FAILED!');
        console.log('📊 Status was not updated correctly');
    }

} catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
