import { json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import * as auth from '$lib/server/auth';
import { userService } from '$lib/server/application/services/user.service';
import type { RequestHandler } from './$types';

// Verifies a Google One Tap ID token and creates the same app session
// as the classic OAuth flow (see src/routes/auth/login/+server.ts).
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { idToken } = await request.json().catch(() => ({}));
		if (!idToken || typeof idToken !== 'string') {
			return json({ success: false, error: 'Missing ID token' }, { status: 400 });
		}

		const clientId = process.env.GOOGLE_CLIENT_ID;
		if (!clientId) {
			console.error('[OneTap] GOOGLE_CLIENT_ID is not set');
			return json({ success: false, error: 'Server misconfigured' }, { status: 500 });
		}

		// Cryptographic verification: signature (Google certs), audience,
		// issuer and expiry. Never trust the client payload unchecked.
		const client = new OAuth2Client(clientId);
		let payload;
		try {
			const ticket = await client.verifyIdToken({ idToken, audience: clientId });
			payload = ticket.getPayload();
		} catch (e) {
			console.error('[OneTap] ID token verification failed');
			return json({ success: false, error: 'Invalid Google token' }, { status: 401 });
		}
		if (!payload || !payload.email || !payload.sub) {
			return json({ success: false, error: 'Incomplete Google profile' }, { status: 401 });
		}
		if (payload.email_verified === false) {
			return json({ success: false, error: 'Google email is not verified' }, { status: 401 });
		}

		const user = await userService.getOrCreateUser(payload.sub, payload.email);
		if (!user) {
			return json({ success: false, error: 'Failed to create user' }, { status: 500 });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, user.id);
		auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		console.log('[OneTap] Login successful for user:', payload.email);
		return json({ success: true });
	} catch (error) {
		console.error('[OneTap] Error creating session:', error);
		return json({ success: false, error: 'Failed to create session' }, { status: 500 });
	}
};
