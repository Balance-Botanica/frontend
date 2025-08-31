import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function checkOrderDetails() {
	try {
		console.log('🔍 Checking order details...');

		// Получить все заказы
		const orders = await db.select().from(schema.orders);
		console.log(`📊 Found ${orders.length} orders:`);

		// Показать детали каждого заказа
		for (const order of orders) {
			console.log(`\n📦 Order ID: ${order.id}`);
			console.log(`   Customer Name: ${order.customerName || 'NOT SET'}`);
			console.log(`   Customer Phone: ${order.customerPhone || 'NOT SET'}`);
			console.log(`   Delivery Address: ${order.deliveryAddress || 'NOT SET'}`);
			console.log(`   Status: ${order.status}`);

			// Попробуем распарсить deliveryAddress если он есть
			if (order.deliveryAddress) {
				try {
					const deliveryData = JSON.parse(order.deliveryAddress);
					console.log(`   Delivery parsed:`, deliveryData);
				} catch (e) {
					console.log(`   Delivery raw: ${order.deliveryAddress}`);
				}
			}

			// Получить email пользователя
			try {
				const user = await db.select().from(schema.users).where(eq(schema.users.id, order.userId)).limit(1);
				if (user.length > 0) {
					console.log(`   User Email: ${user[0].email || 'NOT SET'}`);
				}
			} catch (e) {
				console.log(`   User Email: ERROR GETTING USER`);
			}
		}

	} catch (error) {
		console.error('❌ Error checking order details:', error);
	} finally {
		sqlite.close();
	}
}

checkOrderDetails();
