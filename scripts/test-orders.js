import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.ts';

const sqlite = new Database('./local.db');
const db = drizzle(sqlite, { schema });

async function testOrders() {
	try {
		console.log('🔍 Testing order retrieval...');

		// Get all orders
		const orders = await db.select().from(schema.orders).orderBy(schema.orders.createdAt);
		console.log(`📦 Found ${orders.length} orders in database:`);

		orders.forEach((order, index) => {
			console.log(`Order ${index + 1}:`, {
				id: order.id,
				userId: order.userId,
				status: order.status,
				total: order.total,
				createdAt: new Date(order.createdAt).toISOString()
			});
		});

		if (orders.length === 0) {
			console.log('❌ No orders found in database');
		} else {
			console.log('✅ Orders found successfully');
		}

	} catch (error) {
		console.error('❌ Error testing orders:', error);
	} finally {
		sqlite.close();
	}
}

testOrders();
