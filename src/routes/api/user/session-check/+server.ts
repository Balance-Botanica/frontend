import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	console.log('🔍 [Session Check] Checking server-side session');

	// Check if user exists in locals (set by hooks.server.ts)
	const hasValidSession = !!(locals.user?.id && locals.session?.id);

	console.log('🔍 [Session Check] Session validation result:', {
		hasValidSession,
		userId: locals.user?.id,
		sessionId: locals.session?.id
	});

	return json({
		hasValidSession,
		userId: locals.user?.id,
		sessionId: locals.session?.id
	});
};
