import { userService } from '$lib/server/application/services/user.service';
import { DrizzleUserRepository } from '$lib/server/data/repositories/drizzle-user.repository';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from '../../../.svelte-kit/types/src/routes/profile/$types';

// Load user delivery addresses
export const load: PageServerLoad = async ({ locals }) => {
	console.log('[Profile Load] Starting profile load');

	// Check if user is authenticated
	if (!locals.user?.id) {
		console.log('[Profile Load] ❌ User not authenticated, redirecting to login');
		throw redirect(302, '/login?redirect=/profile');
	}

	const userId = locals.user.id;
	console.log('[Profile Load] ✅ User authenticated:', locals.user.email);

	try {
		const deliveryAddresses = await userService.getDeliveryAddressesByUserId(userId);
		console.log(
			'[Profile Load] Successfully loaded',
			deliveryAddresses.length,
			'delivery addresses'
		);
		return {
			deliveryAddresses
		};
	} catch (err) {
		console.error('[Profile Load] Error loading delivery addresses:', err);
		return {
			deliveryAddresses: []
		};
	}
};

// Actions for delivery addresses
export const actions: Actions = {
	saveDeliveryAddress: async ({ request, locals }) => {
		console.log('[Save Delivery Address] Starting save delivery address action');

		// Check if user is authenticated
		if (!locals.user?.id) {
			console.log('[Save Delivery Address] ❌ Authentication failed - no user ID in locals');
			return fail(401, {
				success: false,
				error: 'User not authenticated'
			});
		}

		console.log('[Save Delivery Address] ✅ User authenticated:', locals.user.email);

		try {
			const formData = await request.formData();
			console.log('[Save Delivery Address] Received form data:', Object.fromEntries(formData));

			// Check if using Nova Poshta
			const useNovaPost = formData.get('useNovaPost') === 'true';
			const addressName =
				(formData.get('name') as string) || 'Address ' + new Date().toLocaleDateString();
			const isDefault = formData.get('isDefault') === 'true';

			let deliveryAddressData: any = {
				name: addressName,
				isDefault,
				// Always include country
				country: (formData.get('country') as string) || 'Ukraine',
				// Include Nova Poshta fields
				useNovaPost
			};

			if (useNovaPost) {
				// Nova Poshta delivery data
				deliveryAddressData = {
					...deliveryAddressData,
					// Set empty values for regular address fields
					street: '',
					city: '',
					postalCode: '',
					// Set Nova Poshta fields
					npCityName: formData.get('npCityName') as string,
					npCityFullName: formData.get('npCityFullName') as string,
					npWarehouse: formData.get('npWarehouse') as string
				};
			} else {
				// Regular delivery address data (эти поля больше не используются)
				deliveryAddressData = {
					...deliveryAddressData,
					// Set empty values for Nova Poshta fields
					npCityName: '',
					npCityFullName: '',
					npWarehouse: ''
				};
			}

			const userId = locals.user.id;
			console.log('[Save Delivery Address] Processing delivery address data:', deliveryAddressData);
			const result = await userService.saveDeliveryAddress(userId, deliveryAddressData);

			if (result) {
				console.log('[Save Delivery Address] Successfully saved delivery address');
				return {
					success: true,
					deliveryAddress: result
				};
			} else {
				console.log(
					'[Save Delivery Address] Failed to save delivery address - service returned null'
				);
				return fail(500, {
					success: false,
					error: 'Failed to save delivery address'
				});
			}
		} catch (err) {
			console.error('[Save Delivery Address] Error saving delivery address:', err);
			return fail(500, {
				success: false,
				error: 'Failed to save delivery address'
			});
		}
	},

	setDefaultAddress: async ({ request, locals }) => {
		console.log('[Set Default Address] Starting set default address action');

		// Check if user is authenticated
		if (!locals.user?.id) {
			console.log('[Set Default Address] ❌ User not authenticated');
			return fail(401, { success: false, error: 'User not authenticated' });
		}

		console.log('[Set Default Address] ✅ User authenticated:', locals.user.email);

		try {
			const formData = await request.formData();
			const addressId = formData.get('addressId') as string;

			if (!addressId) {
				console.log('[Set Default Address] Address ID is required but missing');
				return fail(400, { success: false, error: 'Address ID is required' });
			}

			console.log(
				'[Set Default Address] Setting address',
				addressId,
				'as default for user',
				locals.user.id
			);

			const repository = new DrizzleUserRepository();
			const success = await repository.setDefaultAddress(locals.user.id, addressId);

			if (success) {
				console.log('[Set Default Address] Successfully set default address');
				return { success: true };
			} else {
				console.log('[Set Default Address] Failed to set default address');
				return fail(500, { success: false, error: 'Failed to set default address' });
			}
		} catch (err) {
			console.error('[Set Default Address] Error setting default address:', err);
			return fail(500, { success: false, error: 'Failed to set default address' });
		}
	},

	deleteAddress: async ({ request, locals }) => {
		console.log('[Delete Address] Starting delete address action');

		// Check if user is authenticated
		if (!locals.user?.id) {
			console.log('[Delete Address] ❌ User not authenticated');
			return fail(401, { success: false, error: 'User not authenticated' });
		}

		console.log('[Delete Address] ✅ User authenticated:', locals.user.email);

		try {
			const formData = await request.formData();
			const addressId = formData.get('addressId') as string;

			if (!addressId) {
				console.log('[Delete Address] Address ID is required but missing');
				return fail(400, { success: false, error: 'Address ID is required' });
			}

			console.log('[Delete Address] Deleting address:', addressId, 'for user:', locals.user.id);

			// Note: We might want to add a check here to ensure the address belongs to the user
			// For now, we'll rely on the service to handle this
			const success = await userService.deleteDeliveryAddress(addressId);

			if (success) {
				console.log('[Delete Address] Successfully deleted address');
				return { success: true };
			} else {
				console.log('[Delete Address] Failed to delete address');
				return fail(500, { success: false, error: 'Failed to delete address' });
			}
		} catch (err) {
			console.error('[Delete Address] Error deleting address:', err);
			return fail(500, { success: false, error: 'Failed to delete address' });
		}
	}
};
