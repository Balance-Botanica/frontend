import { redirect } from '@sveltejs/kit';
import { userService } from '$lib/server/application/services/user.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		console.log('[Cart Page Server] ❌ User not authenticated, redirecting to login');
		throw redirect(302, '/login?redirect=/cart');
	}

	console.log('[Cart Page Server] ✅ User authenticated:', locals.user.email);

	// User is authenticated, load their delivery addresses
	try {
		const userId = locals.user.id;
		console.log('[Cart Page Server] Loading addresses for userId:', userId);

		try {
			const deliveryAddresses = await userService.getDeliveryAddressesByUserId(userId);
			console.log('[Cart Page Server] Found addresses for user:', deliveryAddresses.length);
			return {
				deliveryAddresses
			};
		} catch (error) {
			console.log('[Cart Page Server] Error loading addresses for user:', error);
			return {
				deliveryAddresses: []
			};
		}
	} catch (error) {
		console.error('[Cart Page Server] Error loading delivery addresses:', error);
		return {
			deliveryAddresses: []
		};
	}
};
