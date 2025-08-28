import { userService } from '$lib/server/application/services/user.service';
import type { Actions, PageServerLoad } from './$types';

// Load user delivery address
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (!session?.user?.id) {
		return {
			deliveryAddress: null
		};
	}

	try {
		const deliveryAddress = await userService.getDeliveryAddressByUserId(session.user.id);
		return {
			deliveryAddress
		};
	} catch (error) {
		console.error('Error loading delivery address:', error);
		return {
			deliveryAddress: null
		};
	}
};

// Actions for saving delivery address
export const actions: Actions = {
	saveDeliveryAddress: async ({ request, locals }) => {
		const session = await locals.getSession();

		if (!session?.user?.id) {
			return {
				success: false,
				error: 'User not authenticated'
			};
		}

		try {
			const formData = await request.formData();
			const deliveryAddressData = {
				street: formData.get('street') as string,
				city: formData.get('city') as string,
				postalCode: formData.get('postalCode') as string,
				country: formData.get('country') as string
			};

			const result = await userService.saveDeliveryAddress(session.user.id, deliveryAddressData);

			if (result) {
				return {
					success: true,
					deliveryAddress: result
				};
			} else {
				return {
					success: false,
					error: 'Failed to save delivery address'
				};
			}
		} catch (error) {
			console.error('Error saving delivery address:', error);
			return {
				success: false,
				error: 'Failed to save delivery address'
			};
		}
	}
};
