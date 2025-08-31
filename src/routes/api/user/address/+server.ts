import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/application/services/user.service';

export async function POST({ request, locals }) {
	try {
		// Get user from session
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse request body
		const body = await request.json();
		const { name, npCityName, npCityFullName, npWarehouse, useNovaPost, isDefault } = body;

		// Validate required fields
		if (!name?.trim() || !npCityName || !npCityFullName || !npWarehouse) {
			return json({ error: 'All required fields must be provided' }, { status: 400 });
		}

		// Prepare address data for Nova Poshta
		const addressData = {
			userId: user.id,
			name: name.trim(),
			isDefault: isDefault || false,
			street: '', // Nova Poshta doesn't use street address
			city: '', // Nova Poshta doesn't use regular city
			postalCode: '', // Nova Poshta doesn't use postal code
			country: 'Ukraine',
			npCityName,
			npCityFullName,
			npWarehouse,
			useNovaPost: true
		};

		// Save delivery address
		const result = await userService.saveDeliveryAddress(user.id, addressData);

		if (!result) {
			return json({ error: 'Failed to save address' }, { status: 500 });
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
		console.error('Error saving delivery address:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
