import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client.js';
import * as auth from '$lib/server/auth';
import { userService } from '$lib/server/application/services/user.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		try {
			// Check if supabase client is available
			if (!supabase) {
				console.error('❌ Supabase client not initialized');
				throw redirect(
					303,
					`/login?error=${encodeURIComponent('Authentication service not available')}`
				);
			}

			// Exchange the code for a session
			const { data, error } = await supabase.auth.exchangeCodeForSession(code);

			if (error) {
				console.error('❌ OAuth callback error:', error);
				throw redirect(303, `/login?error=${encodeURIComponent(error.message)}`);
			}

			if (data.session) {
				// Set the session cookies for SSR
				cookies.set('sb-access-token', data.session.access_token, {
					path: '/',
					maxAge: data.session.expires_in,
					httpOnly: true,
					secure: true,
					sameSite: 'lax'
				});

				cookies.set('sb-refresh-token', data.session.refresh_token, {
					path: '/',
					maxAge: 60 * 60 * 24 * 30, // 30 days
					httpOnly: true,
					secure: true,
					sameSite: 'lax'
				});

				// Create session token for server-side authentication
				// Get or create user in our database and use the database user ID
				const supabaseUserId = data.user.id;
				const userEmail = data.user.email || '';

				console.log('[OAuth Callback] Getting or creating user in database');
				const user = await userService.getOrCreateUser(supabaseUserId, userEmail);

				if (!user) {
					console.error('❌ Failed to create user in database');
					throw redirect(303, `/login?error=${encodeURIComponent('Failed to create user')}`);
				}

				// Create session with the database user ID
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, user.id);
				auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

				console.log('✅ OAuth login successful for:', data.user?.email);
			}
		} catch (error) {
			console.error('❌ OAuth callback error:', error);
			throw redirect(303, `/login?error=${encodeURIComponent('Authentication failed')}`);
		}
	}

	// Redirect to the intended page or dashboard
	throw redirect(303, next);
};
