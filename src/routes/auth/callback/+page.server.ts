import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		try {
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
