import { redirect } from '@sveltejs/kit';
import { userService } from '$lib/server/application/services/user.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Cart should be accessible without authentication
	// Authentication is required only during checkout
	console.log('[Cart Page Server] Loading cart page for user:', locals.user?.email || 'anonymous');

	// Load delivery addresses only if user is authenticated
	let deliveryAddresses: any[] = [];

	if (locals.user) {
		try {
			const userId = locals.user.id;
			console.log('[Cart Page Server] Loading addresses for authenticated userId:', userId);

			try {
				deliveryAddresses = await userService.getDeliveryAddressesByUserId(userId);
				console.log('[Cart Page Server] Found addresses for user:', deliveryAddresses.length);
			} catch (error) {
				console.log('[Cart Page Server] Error loading addresses for user:', error);
				deliveryAddresses = [];
			}
		} catch (error) {
			console.error('[Cart Page Server] Error in delivery addresses loading:', error);
			deliveryAddresses = [];
		}
	} else {
		console.log(
			'[Cart Page Server] User not authenticated - cart accessible, but no saved addresses'
		);
	}

	return {
		deliveryAddresses,
		isAuthenticated: !!locals.user
	};
};
