#!/usr/bin/env node

// Тестируем синхронизацию заказов из Google Sheets в БД
import { OrderService } from '../src/lib/server/application/services/order.service.ts';

async function testSync() {
	try {
		console.log('🧪 Testing order synchronization...');

		const orderService = new OrderService();

		// Получить заказы до синхронизации
		const ordersBefore = await orderService.getAllOrders();
		console.log(`📊 Orders before sync: ${ordersBefore.length}`);

		// Запустить синхронизацию для тестового пользователя
		const testUserId = '7907d65a-35d1-4c44-b941-76fe92c9d551'; // Тот же userId что и в тестах
		console.log('🔄 Starting sync for user:', testUserId);

		await orderService.syncUserOrdersFromSheets(testUserId);

		// Получить заказы после синхронизации
		const ordersAfter = await orderService.getAllOrders();
		console.log(`📊 Orders after sync: ${ordersAfter.length}`);

		// Показать новые заказы
		const newOrders = ordersAfter.filter(order =>
			!ordersBefore.some(existing => existing.id === order.id)
		);

		if (newOrders.length > 0) {
			console.log('✅ New orders created from Google Sheets:');
			newOrders.forEach(order => {
				console.log(`   📦 Order ${order.id}: ${order.customerName || 'No name'} - ${order.status}`);
			});
		} else {
			console.log('ℹ️  No new orders were created from Google Sheets');
		}

		console.log('🎉 Sync test completed!');

	} catch (error) {
		console.error('❌ Error during sync test:', error);
	}
}

testSync();
