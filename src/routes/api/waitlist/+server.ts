import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuthenticatedClient } from '$lib/server/pocketbase';

/**
 * POST /api/waitlist
 * Saves a waitlist lead (currently the "CBD coming soon" list).
 * Stores into the PocketBase `waitlist` collection when available;
 * otherwise degrades gracefully (returns success with stored:false)
 * so the UI never breaks in local/dev mode.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json().catch(() => ({}));
		const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
		const source = typeof body?.source === 'string' ? body.source : 'website';

		if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return json({ success: false, error: 'invalid_email' }, { status: 400 });
		}

		let stored = false;
		try {
			const pb = await getAuthenticatedClient();
			await pb.collection('waitlist').create({ email, source });
			stored = true;
		} catch (err) {
			// PocketBase not configured/available (e.g. local dev without PB running).
			console.warn('[waitlist] PocketBase unavailable - lead not persisted. Email:', email, err);
		}

		return json({ success: true, stored });
	} catch (err) {
		console.error('[waitlist] Unexpected error:', err);
		return json({ success: false, error: 'internal' }, { status: 500 });
	}
};
