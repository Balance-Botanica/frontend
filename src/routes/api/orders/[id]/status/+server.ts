import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OrderService } from '$lib/server/application/services/order.service';
import type { OrderStatus } from '$lib/server/domain/interfaces/order.interface';

// Initialize services
const orderService = new OrderService();

// PATCH /api/orders/[id]/status - Update order status
export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	try {
		// Check if user is authenticated (and is admin in production)
		const user = locals.user;
		if (!user) {
			throw error(401, 'Unauthorized');
		}

		const orderId = params.id;
		if (!orderId) {
			throw error(400, 'Order ID is required');
		}

		console.log('[API] Updating status for order:', orderId);

		const requestData = await request.json();
		const newStatus = requestData.status;

		if (!newStatus) {
			throw error(400, 'Status is required');
		}

		// Validate status
		const validStatuses: OrderStatus[] = [
			'pending',
			'confirmed',
			'shipped',
			'delivered',
			'cancelled'
		];
		if (!validStatuses.includes(newStatus)) {
			throw error(400, 'Invalid order status');
		}

		// In production, check if user is admin or order belongs to user
		// For now, allow any authenticated user to update any order (for testing)
		const success = await orderService.updateOrderStatus(orderId, newStatus);

		if (!success) {
			throw error(404, 'Order not found or update failed');
		}

		console.log('[API] Order status updated successfully:', orderId, '->', newStatus);

		return json({
			success: true,
			message: 'Order status updated successfully'
		});
	} catch (err) {
		console.error('[API] Error updating order status:', err);

		if (err instanceof Error && 'status' in err) {
			throw err;
		}

		throw error(500, 'Internal server error');
	}
};
