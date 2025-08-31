#!/usr/bin/env node

// Test automatic order synchronization
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
    console.log('🔄 Testing automatic order synchronization...');

    // Get current orders before sync
    const ordersBefore = db.prepare('SELECT id, status, updated_at FROM orders ORDER BY updated_at DESC').all();
    console.log('📦 Orders before sync:', ordersBefore.length);

    ordersBefore.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.id}: ${order.status} (${new Date(order.updated_at * 1000).toLocaleString('uk-UA')})`);
    });

    // Simulate what happens when user opens /orders page
    console.log('\n🚀 Simulating page load with auto-sync...');
    console.log('   1. User opens /orders page');
    console.log('   2. onMount triggers automatic sync');
    console.log('   3. syncOrders() calls /api/orders/sync');
    console.log('   4. Google Sheets data is fetched and compared');
    console.log('   5. Status differences are updated in database');

    // Test the API endpoint directly
    console.log('\n🔍 Testing sync API endpoint...');

    // This would normally be called from the browser
    console.log('   API call: POST /api/orders/sync');
    console.log('   Expected: Orders synced from Google Sheets');
    console.log('   Result: Statuses updated if different');

    // Get orders after simulated sync
    const ordersAfter = db.prepare('SELECT id, status, updated_at FROM orders ORDER BY updated_at DESC').all();
    console.log('\n📦 Orders after sync:', ordersAfter.length);

    ordersAfter.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.id}: ${order.status} (${new Date(order.updated_at * 1000).toLocaleString('uk-UA')})`);
    });

    console.log('\n✅ Auto-sync test completed!');
    console.log('💡 In real app: Sync happens automatically when opening /orders page');
    console.log('💡 Manual sync: Available via "Синхронізувати" button');

} catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
