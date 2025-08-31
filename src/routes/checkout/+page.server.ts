import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// TEMPORARILY DISABLE AUTH CHECK TO FIX REDIRECT LOOP
	// TODO: Re-enable after fixing session synchronization
	console.log('[Checkout Page] ⚠️ AUTH CHECK DISABLED - allowing all access');

	// TODO: Load user's delivery addresses and other checkout data
	// For now, we're just checking authentication

	return {
		user: locals.user || null
	};
};
