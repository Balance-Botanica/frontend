import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { userService } from '$lib/server/application/services/user.service';

export async function PUT({ request, locals }) {
	try {
		// TEMPORARY: Disable auth check for testing
		// const user = locals.user;
		// if (!user) {
		// 	return json({ error: 'Unauthorized' }, { status: 401 });
		// }

		// TEMPORARY: Use hardcoded user ID for testing
		const user = { id: '7907d65a-35d1-4c44-b941-76fe92c9d551' };

		// Parse request body
		const body = await request.json();
		const { firstName, lastName, phoneNumber } = body;

		// Validate required fields
		if (!firstName?.trim() || !lastName?.trim() || !phoneNumber?.trim()) {
			return json({ error: 'All fields are required' }, { status: 400 });
		}

		// Update user profile
		const updatedUser = await userService.updateUserProfile(user.id, {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			phoneNumber: phoneNumber.trim()
		});

		if (!updatedUser) {
			return json({ error: 'Failed to update profile' }, { status: 500 });
		}

		return json({
			success: true,
			user: {
				id: updatedUser.id,
				email: updatedUser.email,
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				phoneNumber: updatedUser.phoneNumber
			}
		});
	} catch (error) {
		console.error('Error updating user profile:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
