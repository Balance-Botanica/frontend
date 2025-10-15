import { redirect } from '@sveltejs/kit';
import PocketBase from 'pocketbase/cjs';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	console.log('🔄 [OAUTH-CALLBACK] Processing OAuth callback:', {
		code: !!code,
		state,
		error,
		errorDescription
	});

	if (error) {
		console.error('❌ [OAUTH-CALLBACK] OAuth error:', error, errorDescription);
		throw redirect(302, '/auth/login?error=oauth_failed');
	}

	if (!code) {
		console.error('❌ [OAUTH-CALLBACK] No authorization code received');
		throw redirect(302, '/auth/login?error=no_code');
	}

	try {
		// Get PocketBase URL
		const pbUrl = process.env.VITE_PUBLIC_POCKETBASE_URL;
		if (!pbUrl) {
			console.error('❌ [OAUTH-CALLBACK] PocketBase URL not configured');
			throw redirect(302, '/auth/login?error=config_error');
		}

		const pb = new PocketBase(pbUrl);
		const redirectUrl = `${url.origin}/auth/callback`;

		console.log('🔄 [OAUTH-CALLBACK] Exchanging OAuth code for session...');

		// Exchange the authorization code for an auth session
		// PocketBase will handle user creation if they don't exist
		const authData = await pb.collection('users').authWithOAuth2Code(
			'google', // provider name - we assume Google for now, could be made dynamic
			code,
			'', // codeVerifier - empty for now, can be enhanced with PKCE
			redirectUrl
		);

		console.log('✅ [OAUTH-CALLBACK] OAuth authentication successful:', {
			userId: authData.record.id,
			userEmail: authData.record.email
		});

		// Store user info in locals for the client
		locals.user = {
			id: authData.record.id,
			email: authData.record.email,
			name: authData.record.name || extractNameFromEmail(authData.record.email),
			firstName: authData.record.first_name,
			lastName: authData.record.last_name
		};

		console.log('✅ [OAUTH-CALLBACK] OAuth callback processed successfully');
		throw redirect(302, '/');
	} catch (error) {
		console.error('❌ [OAUTH-CALLBACK] Unexpected error:', error);
		throw redirect(302, '/auth/login?error=unexpected_error');
	}
};

function extractNameFromEmail(email?: string): string {
	if (!email) return 'User';
	return email.split('@')[0].replace(/[._-]/g, ' ');
}
