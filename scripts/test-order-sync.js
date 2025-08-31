#!/usr/bin/env node

// Test order synchronization functionality
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
    console.log('🔄 Testing order synchronization functionality...');

    // Get all orders from database
    const orders = db.prepare('SELECT id, status, updated_at FROM orders ORDER BY updated_at DESC').all();
    console.log('📦 Orders in database:', orders.length);

    orders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.id}: ${order.status} (${new Date(order.updated_at * 1000).toLocaleString('uk-UA')})`);
    });

    // Test status update
    if (orders.length > 0) {
        const testOrder = orders[0];
        const newStatus = testOrder.status === 'pending' ? 'confirmed' : 'pending';

        console.log(`\n🔄 Testing status update for order ${testOrder.id}`);
        console.log(`   Current status: ${testOrder.status}`);
        console.log(`   New status: ${newStatus}`);

        // Update status
        const updateResult = db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?')
            .run(newStatus, Date.now(), testOrder.id);

        console.log('   Update result:', updateResult);

        // Verify update
        const updatedOrder = db.prepare('SELECT id, status, updated_at FROM orders WHERE id = ?')
            .get(testOrder.id);

        console.log('   ✅ Updated order:', {
            id: updatedOrder.id,
            status: updatedOrder.status,
            updatedAt: new Date(updatedOrder.updated_at * 1000).toLocaleString('uk-UA')
        });

        if (updatedOrder.status === newStatus) {
            console.log('   🎉 Status update test PASSED!');
        } else {
            console.log('   ❌ Status update test FAILED!');
        }
    }

    console.log('\n📋 Synchronization test completed!');
    console.log('💡 Manual sync: Click "Синхронізувати" button on /orders page');
    console.log('💡 Auto sync: Happens when opening /orders page');

} catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
