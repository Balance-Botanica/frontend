#!/usr/bin/env node

// Test Telegram bot orders functionality
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
    console.log('🤖 Testing Telegram bot orders functionality...');

    // Get all orders from database
    const orders = db.prepare('SELECT id, user_id, status, created_at FROM orders ORDER BY created_at DESC').all();
    console.log('📦 Orders in database:', orders.length);

    if (orders.length === 0) {
        console.log('❌ No orders found in database!');
        console.log('💡 Create some orders first through the web interface');
        process.exit(0);
    }

    orders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.id}`);
        console.log(`      User ID: ${order.user_id}`);
        console.log(`      Status: ${order.status}`);
        console.log(`      Created: ${new Date(order.created_at * 1000).toLocaleString('uk-UA')}`);
        console.log('');
    });

    console.log('✅ Telegram bot should now show orders when you type /orders');
    console.log('');
    console.log('🧪 Testing steps:');
    console.log('   1. Start Telegram bot: npm run bot');
    console.log('   2. Send /start to your bot');
    console.log('   3. Send /orders to see all orders');
    console.log('   4. Try other commands: /pending, /confirmed, etc.');

} catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
} finally {
    db.close();
}
