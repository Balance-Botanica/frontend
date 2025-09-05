import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		console.log('[Checkout Page] ❌ User not authenticated, redirecting to login');
		throw redirect(302, '/login?redirect=/checkout');
	}

	console.log('[Checkout Page] ✅ User authenticated:', locals.user.email);

	// TODO: Load user's delivery addresses and other checkout data
	// For now, we're just checking authentication

	return {
		user: locals.user
	};
};
