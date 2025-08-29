import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to login if user is not authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// TODO: Load user's delivery addresses and other checkout data
	// For now, we're just checking authentication

	return {
		user: locals.user
	};
};
