import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';
import { OrderService } from '../src/lib/server/application/services/order.service.js';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function testOrderCreation() {
	try {
		console.log('🧪 Testing order creation with customer data...');

		// Создать тестовые данные заказа
		const testOrderData = {
			userId: '7907d65a-35d1-4c44-b941-76fe92c9d551', // существующий user ID
			items: [{
				productId: 'test-product-1',
				productName: 'Test Product',
				quantity: 1,
				price: 2800,
				total: 2800,
				size: '30ml',
				flavor: 'Natural'
			}],
			total: 2800,
			deliveryAddress: {
				street: 'Test Street 123',
				city: 'Kyiv',
				postalCode: '01001',
				country: 'Ukraine'
			},
			notes: 'Test order',
			// Новые поля для тестирования
			customerName: 'John Doe',
			customerPhone: '+380501234567'
		};

		console.log('📝 Test order data:', testOrderData);
		console.log('ℹ️  NOTE: You may see Telegram bot "409 Conflict" errors - this is normal if bot is already running');

		// Создать заказ через OrderService
		const orderService = new OrderService();
		const order = await orderService.createOrder(testOrderData);

		if (order) {
			console.log('✅ Order created successfully!');
			console.log('📋 Order details:', {
				id: order.id,
				userId: order.userId,
				customerName: order.customerName,
				customerPhone: order.customerPhone,
				status: order.status,
				total: order.total
			});

			// Проверить, что данные сохранены в базе данных
			const savedOrder = await db.select().from(schema.orders).where(eq(schema.orders.id, order.id)).limit(1);
			if (savedOrder.length > 0) {
				console.log('💾 Data saved in database:', {
					customer_name: savedOrder[0].customerName,
					customer_phone: savedOrder[0].customerPhone
				});
			}
		} else {
			console.log('❌ Order creation failed');
		}

	} catch (error) {
		console.error('❌ Error during test:', error);
		console.error('Error details:', error.message);
	} finally {
		sqlite.close();
	}
}

testOrderCreation();
