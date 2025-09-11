import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { OrderService } from '$lib/server/application/services/order.service';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		console.log('[Orders Page] ❌ User not authenticated, redirecting to login');
		throw redirect(302, '/login?redirect=/orders');
	}

	console.log('[Orders Page] ✅ User authenticated:', locals.user.email);

	// Initialize services
	const orderService = new OrderService();
	const userId = locals.user.id;

	try {
		// Get orders for the authenticated user
		console.log('[Orders Page] Getting orders for user:', userId);
		const orders = await orderService.getOrdersByUserId(userId);
		console.log(`[Orders Page] Found ${orders.length} orders for user`);

		return {
			orders
		};
	} catch (error) {
		console.error('[Orders Page] Failed to load orders:', error);

		return {
			orders: [],
			error: 'Failed to load orders'
		};
	}
};
