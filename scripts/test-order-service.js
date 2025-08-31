import { OrderService } from '../src/lib/server/application/services/order.service.ts';
import { DrizzleOrderRepository } from '../src/lib/server/data/repositories/drizzle-order.repository.ts';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.ts';

const sqlite = new Database('./local.db');
const db = drizzle(sqlite, { schema });

async function testOrderService() {
	try {
		console.log('🔍 Testing OrderService...');

		// Initialize repository and service
		const orderRepository = new DrizzleOrderRepository(db);
		const orderService = new OrderService(orderRepository);

		// Test getAllOrders
		console.log('📦 Testing getAllOrders()...');
		const orders = await orderService.getAllOrders();
		console.log(`Found ${orders.length} orders:`);

		orders.forEach((order, index) => {
			console.log(`Order ${index + 1}:`, {
				id: order.id,
				userId: order.userId,
				status: order.status,
				total: order.total
			});
		});

		if (orders.length === 0) {
			console.log('❌ No orders returned from service');
		} else {
			console.log('✅ Orders retrieved successfully from service');
		}

	} catch (error) {
		console.error('❌ Error testing OrderService:', error);
		console.error('Error details:', error.message);
		console.error('Stack trace:', error.stack);
	} finally {
		sqlite.close();
	}
}

testOrderService();
