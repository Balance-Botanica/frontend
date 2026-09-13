import { json } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { RequestHandler } from './$types';

// Clears the app session cookie (works for Firebase, One Tap and legacy
// PocketBase logins — all of them end in the same server session).
export const POST: RequestHandler = async (event) => {
	try {
		auth.deleteSessionTokenCookie(event as any);
		return json({ success: true });
	} catch (error) {
		console.error('[Logout] failed:', error);
		return json({ success: false }, { status: 500 });
	}
};
