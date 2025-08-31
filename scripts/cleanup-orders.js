import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function cleanupOrders() {
	try {
		console.log('🧹 Starting order cleanup...');

		// Получить все заказы
		const allOrders = await db.select().from(schema.orders);
		console.log(`📊 Found ${allOrders.length} orders:`);

		allOrders.forEach((order, index) => {
			console.log(`${index + 1}. ID: ${order.id}, Status: ${order.status}, Customer: ${order.customerName || 'N/A'}`);
		});

		// Оставим только последний заказ для тестирования
		if (allOrders.length > 1) {
			const ordersToDelete = allOrders.slice(0, -1); // Все кроме последнего

			console.log('\n🗑️ Deleting old orders...');
			for (const order of ordersToDelete) {
				await db.delete(schema.orders).where(eq(schema.orders.id, order.id));
				console.log(`🗑️ Deleted order: ${order.id}`);
			}
		}

		// Проверить результат
		const remainingOrders = await db.select().from(schema.orders);

		console.log('\n✅ Cleanup completed!');
		console.log(`📊 Remaining orders: ${remainingOrders.length}`);

		if (remainingOrders.length === 1) {
			console.log('🎉 Perfect! Only one order remains for testing');
			console.log('📋 Remaining order:', remainingOrders[0]);
		}

	} catch (error) {
		console.error('❌ Error during cleanup:', error);
	} finally {
		sqlite.close();
	}
}

cleanupOrders();
