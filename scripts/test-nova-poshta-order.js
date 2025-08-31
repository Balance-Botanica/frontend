import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from '../src/lib/server/db/schema.js';
import { OrderService } from '../src/lib/server/application/services/order.service.ts';

const sqlite = new Database('./drizzle.db');
const db = drizzle(sqlite, { schema });

async function testNovaPoshtaOrder() {
	try {
		console.log('🧪 Testing Nova Poshta order creation...');

		// Получить существующий адрес Новой Почты
		const deliveryAddresses = await db.select().from(schema.deliveryAddresses).where(eq(schema.deliveryAddresses.useNovaPost, true)).limit(1);

		if (deliveryAddresses.length === 0) {
			console.log('❌ No Nova Poshta addresses found in database');
			return;
		}

		const novaPoshtaAddress = deliveryAddresses[0];
		console.log('📍 Using Nova Poshta address:', {
			npCityFullName: novaPoshtaAddress.npCityFullName,
			npWarehouse: novaPoshtaAddress.npWarehouse,
			useNovaPost: novaPoshtaAddress.useNovaPost
		});

		const orderService = new OrderService();

		const orderData = {
			userId: '7907d65a-35d1-4c44-b941-76fe92c9d551', // Используем существующий userId
			items: [
				{
					productId: 'test-product-1',
					productName: 'Balance Botanica Golden Paste CBD',
					quantity: 1,
					price: 2800,
					total: 2800,
					size: '30ml',
					flavor: 'Natural'
				}
			],
			total: 2800,
			deliveryAddress: novaPoshtaAddress, // Используем адрес Новой Почты
			notes: 'Test Nova Poshta order',
			customerName: 'Test Nova Poshta',
			customerPhone: '+380501234567'
		};

		console.log('📝 Creating order with Nova Poshta address...');
		const result = await orderService.createOrder(orderData);

		if (result) {
			console.log('✅ Order created successfully!');
			console.log('📋 Order details:', result);
		} else {
			console.log('❌ Failed to create order');
		}

	} catch (error) {
		console.error('❌ Error testing Nova Poshta order:', error);
	} finally {
		sqlite.close();
	}
}

testNovaPoshtaOrder();
