import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/application/services/user.service';

export async function PUT({ request, locals, params }) {
	try {
		// Get user from session
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get address ID from URL params
		const addressId = params.id;

		if (!addressId) {
			return json({ error: 'Address ID is required' }, { status: 400 });
		}

		console.log('[Address API] Updating address:', addressId, 'for user:', user.id);

		// Parse request body
		const body = await request.json();
		const { name, npCityName, npCityFullName, npWarehouse, useNovaPost, isDefault } = body;

		// Validate required fields
		if (!name?.trim() || !npCityName || !npCityFullName || !npWarehouse) {
			return json({ error: 'All required fields must be provided' }, { status: 400 });
		}

		// Prepare address data for update
		const addressData = {
			userId: user.id,
			addressId: addressId,
			name: name.trim(),
			isDefault: isDefault || false,
			country: 'Ukraine',
			npCityName,
			npCityFullName,
			npWarehouse,
			useNovaPost: true
		};

		// Update delivery address
		const result = await userService.updateDeliveryAddress(user.id, addressId, addressData);

		if (!result) {
			return json({ error: 'Failed to update address' }, { status: 500 });
		}

		return json({
			success: true,
			address: {
				id: result.id,
				name: result.name,
				isDefault: result.isDefault,
				npCityFullName: result.npCityFullName,
				npWarehouse: result.npWarehouse,
				useNovaPost: result.useNovaPost
			}
		});
	} catch (error) {
		console.error('Error updating delivery address:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
