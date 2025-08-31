import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OrderService } from '$lib/server/application/services/order.service';

export const POST: RequestHandler = async ({ locals }) => {
	try {
		// Check if user is authenticated
		const user = locals.user;
		if (!user) {
			console.log('[API] ❌ Order sync failed: User not authenticated');
			throw error(401, 'Unauthorized');
		}

		console.log('[API] 🔄 Order sync requested for user:', user.id);

		// Initialize order service and sync
		console.log('[API] 🚀 Initializing OrderService...');
		const orderService = new OrderService();

		console.log('[API] 📡 Starting sync with Google Sheets...');
		await orderService.syncUserOrdersFromSheets(user.id);

		// Get updated orders
		console.log('[API] 📊 Fetching updated orders from database...');
		const orders = await orderService.getOrdersByUserId(user.id);

		console.log(`[API] ✅ Order sync completed for user ${user.id}: ${orders.length} orders`);

		return json({
			success: true,
			message: 'Orders synchronized successfully',
			data: orders
		});
	} catch (err) {
		console.error('[API] Error syncing orders:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};
