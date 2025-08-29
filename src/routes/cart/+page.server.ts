import { redirect } from '@sveltejs/kit';
import { userService } from '$lib/server/application/services/user.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is authenticated, load their delivery addresses
	if (locals.user) {
		try {
			const deliveryAddresses = await userService.getDeliveryAddressesByUserId(locals.user.id);

			return {
				deliveryAddresses
			};
		} catch (error) {
			console.error('[Cart Page Server] Error loading delivery addresses:', error);
			return {
				deliveryAddresses: []
			};
		}
	}

	return {
		deliveryAddresses: []
	};
};
