import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function clearOrders() {
	try {
		console.log('🧹 Starting order cleanup...');

		// Подсчитать заказы перед удалением
		const ordersBefore = await db.select().from(schema.orders);
		const itemsBefore = await db.select().from(schema.order_items);

		console.log(`📊 Found ${ordersBefore.length} orders and ${itemsBefore.length} order items`);

		// Удалить все позиции заказов
		console.log('🗑️ Deleting order items...');
		await db.delete(schema.order_items);

		// Удалить все заказы
		console.log('🗑️ Deleting orders...');
		await db.delete(schema.orders);

		// Проверить результат
		const ordersAfter = await db.select().from(schema.orders);
		const itemsAfter = await db.select().from(schema.order_items);

		console.log('✅ Cleanup completed!');
		console.log(`📊 After cleanup: ${ordersAfter.length} orders and ${itemsAfter.length} order items`);

		if (ordersAfter.length === 0 && itemsAfter.length === 0) {
			console.log('🎉 Database is clean!');
		} else {
			console.log('⚠️ Some data might still remain');
		}

	} catch (error) {
		console.error('❌ Error during cleanup:', error);
	} finally {
		sqlite.close();
	}
}

clearOrders();
