import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OrderService } from '$lib/server/application/services/order.service.ts';

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		// Check if user is authenticated
		const user = locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const orderId = params.id;
		if (!orderId) {
			throw error(400, 'Order ID is required');
		}

		console.log('[API] Cancelling order:', orderId, 'for user:', user.id);

		// Initialize order service
		const orderService = new OrderService();

		// Check if order exists and belongs to user
		const order = await orderService.getOrderById(orderId);
		if (!order) {
			throw error(404, 'Order not found');
		}

		if (order.userId !== user.id) {
			throw error(403, 'Access denied');
		}

		// Check if order can be cancelled
		if (order.status === 'delivered') {
			throw error(400, 'Cannot cancel delivered order');
		}

		if (order.status === 'cancelled') {
			throw error(400, 'Order is already cancelled');
		}

		// Cancel the order
		const success = await orderService.updateOrderStatus(orderId, 'cancelled');

		if (!success) {
			throw error(500, 'Failed to cancel order');
		}

		console.log('[API] Order cancelled successfully:', orderId);

		return json({
			success: true,
			message: 'Order cancelled successfully'
		});
	} catch (err) {
		console.error('[API] Error cancelling order:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};
