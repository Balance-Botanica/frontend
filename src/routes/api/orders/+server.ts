import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OrderService } from '$lib/server/application/services/order.service';
import type { CreateOrderData } from '$lib/server/domain/interfaces/order.interface';

// Helper function to get order service
function getOrderService(): OrderService {
	try {
		return new OrderService();
	} catch (error) {
		console.error('[API] Failed to create OrderService:', error);
		throw error;
	}
}

// GET /api/orders - Get user's orders
export const GET: RequestHandler = async ({ locals }) => {
	try {
		console.log('[API] GET /api/orders request received');
		console.log('[API] Locals object:', locals);

		// TEMPORARY: Disable auth check for testing
		// const user = locals.user;
		// console.log('[API] User from locals:', user);
		// if (!user) {
		// 	console.log('[API] No authenticated user found, returning 401');
		// 	throw error(401, 'Unauthorized');
		// }

		// TEMPORARY: Use hardcoded user ID for testing
		const user = { id: '7907d65a-35d1-4c44-b941-76fe92c9d551' };
		console.log('[API] Using hardcoded user for testing:', user.id);

		const orderService = getOrderService();
		const orders = await orderService.getOrdersByUserId(user.id);
		console.log('[API] Found orders:', orders.length);

		return json({
			success: true,
			data: orders
		});
	} catch (err) {
		console.error('[API] Error getting orders:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};

// POST /api/orders - Create new order
export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		console.log('[API] Order creation request received');

		// TEMPORARY: Disable auth check for testing
		// const user = locals.user;
		// console.log('[API] User from locals:', user);
		// if (!user) {
		// 	console.log('[API] No authenticated user found');
		// 	throw error(401, 'Unauthorized');
		// }

		// TEMPORARY: Use hardcoded user ID for testing
		const user = { id: '7907d65a-35d1-4c44-b941-76fe92c9d551' };
		console.log('[API] Using hardcoded user for testing:', user.id);

		const requestData = await request.json();
		console.log('[API] Request data received:', JSON.stringify(requestData, null, 2));

		// Validate required fields
		if (!requestData.items || !Array.isArray(requestData.items) || requestData.items.length === 0) {
			throw error(400, 'Order must contain at least one item');
		}

		if (!requestData.total || typeof requestData.total !== 'number' || requestData.total <= 0) {
			throw error(400, 'Invalid order total');
		}

		// Create order data
		const orderData: CreateOrderData = {
			userId: user.id,
			items: requestData.items,
			total: requestData.total,
			deliveryAddress: requestData.deliveryAddress,
			notes: requestData.notes,
			// Customer information
			customerName: requestData.customerName,
			customerPhone: requestData.customerPhone
		};

		const orderService = getOrderService();
		console.log('[API] OrderService instance created');
		console.log(
			'[API] Calling orderService.createOrder with data:',
			JSON.stringify(orderData, null, 2)
		);
		const order = await orderService.createOrder(orderData);
		console.log('[API] OrderService.createOrder returned:', order ? 'SUCCESS' : 'NULL');
		console.log('[API] Order service returned:', order);

		if (!order) {
			console.log('[API] Order service returned null - creation failed');
			throw error(500, 'Failed to create order');
		}

		console.log('[API] Order created successfully:', order.id);

		return json(
			{
				success: true,
				data: order
			},
			{ status: 201 }
		);
	} catch (err) {
		console.error('[API] Error creating order:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};
