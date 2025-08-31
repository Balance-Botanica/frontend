#!/usr/bin/env node

// Test script to check if OrderService can be initialized
import { OrderService } from '../src/lib/server/application/services/order.service.js';

console.log('🔧 Testing OrderService initialization...');

try {
	const orderService = new OrderService();
	console.log('✅ OrderService initialized successfully');

	// Test a simple method call
	const testUserId = 'test-user-id';
	const orders = await orderService.getOrdersByUserId(testUserId);
	console.log('✅ getOrdersByUserId executed successfully, returned:', orders);

} catch (error) {
	console.error('❌ OrderService initialization or execution failed:');
	console.error('Error message:', error.message);
	console.error('Error stack:', error.stack);
	process.exit(1);
}

console.log('🎉 All tests passed!');
