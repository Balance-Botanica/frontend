import { json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import * as auth from '$lib/server/auth';
import { userService } from '$lib/server/application/services/user.service';
import type { RequestHandler } from './$types';

// Firebase is identity, PocketBase is pure data sync. The client signs in
// with Firebase (Google popup, email, phone) and posts the Firebase ID token
// here. We verify it cryptographically, then issue our own app session cookie
// — the same session every login method produces.
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'balance-botanica';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken } = await request.json().catch(() => ({}));
		if (!idToken || typeof idToken !== 'string') {
			return json({ success: false, error: 'Missing ID token' }, { status: 400 });
		}

		// Firebase ID tokens are Google-signed JWTs with aud = Firebase project ID.
		const client = new OAuth2Client();
		let payload;
		try {
			const ticket = await client.verifyIdToken({ idToken, audience: FIREBASE_PROJECT_ID });
			payload = ticket.getPayload();
		} catch (e) {
			console.error('[Firebase] ID token verification failed');
			return json({ success: false, error: 'Invalid Firebase token' }, { status: 401 });
		}
		if (!payload || !payload.sub) {
			return json({ success: false, error: 'Incomplete Firebase profile' }, { status: 401 });
		}
		// Email logins still require a verified email. Phone logins carry
		// `phone_number` instead and have no email at all.
		const email: string | undefined =
			typeof payload.email === 'string' ? payload.email : undefined;
		const phoneNumber: string | undefined =
			typeof (payload as any).phone_number === 'string'
				? (payload as any).phone_number
				: undefined;
		if (!email && !phoneNumber) {
			return json({ success: false, error: 'Incomplete Firebase profile' }, { status: 401 });
		}
		if (email && payload.email_verified === false) {
			return json({ success: false, error: 'Email is not verified' }, { status: 401 });
		}

		const user = email
			? await userService.getOrCreateUser(payload.sub, email)
			: await userService.getOrCreateUserByPhone(phoneNumber!, undefined);
		if (!user) {
			return json({ success: false, error: 'Failed to create user' }, { status: 500 });
		}
		// Backfill the phone number when a previously email-only user signs in
		// with a linked phone (or vice versa).
		if (phoneNumber && !user.phoneNumber) {
			await userService.updateUserProfile(user.id, { phoneNumber });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		console.log(
			'[Firebase] Login successful for user:',
			email || phoneNumber || user.id
		);
		return json({ success: true });
	} catch (error) {
		console.error('[Firebase] Error creating session:', error);
		return json({ success: false, error: 'Failed to create session' }, { status: 500 });
	}
};
