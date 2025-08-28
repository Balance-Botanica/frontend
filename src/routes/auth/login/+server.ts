import { json, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { userService } from '$lib/server/application/services/user.service';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	console.log('[Login Server] Received login request');
	try {
		const { userId, email } = await request.json();
		console.log('[Login Server] Login data - User ID:', userId, 'Email:', email);

		if (!userId) {
			console.log('[Login Server] User ID is required but missing');
			return json({ success: false, error: 'User ID is required' }, { status: 400 });
		}

		if (!email) {
			console.log('[Login Server] Email is required but missing');
			return json({ success: false, error: 'Email is required' }, { status: 400 });
		}

		// Ensure the user exists in our database
		console.log('[Login Server] Getting or creating user');
		const user = await userService.getOrCreateUser(userId, email);

		if (!user) {
			console.log('[Login Server] Failed to create user');
			return json({ success: false, error: 'Failed to create user' }, { status: 500 });
		}

		console.log('[Login Server] User verified/created:', user.id);

		// Create a new session token for the user
		console.log('[Login Server] Generating session token');
		const sessionToken = auth.generateSessionToken();
		console.log('[Login Server] Creating session with token for database user ID:', user.id);
		const session = await auth.createSession(sessionToken, user.id); // Use database user ID, not Supabase ID

		// Set the session cookie
		console.log('[Login Server] Setting session token cookie');
		auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

		console.log('[Login Server] Login successful for user:', userId);
		return json({ success: true });
	} catch (error) {
		console.error('[Login Server] Error creating session:', error);
		return json({ success: false, error: 'Failed to create session' }, { status: 500 });
	}
};
