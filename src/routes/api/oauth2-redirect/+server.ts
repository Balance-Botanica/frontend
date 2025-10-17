import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('🔄 [OAUTH2-REDIRECT] PocketBase OAuth2 redirect received');
	console.log('🔄 [OAUTH2-REDIRECT] URL:', url.toString());
	console.log('🔄 [OAUTH2-REDIRECT] Params:', Object.fromEntries(url.searchParams));

	// PocketBase OAuth2 callback handler
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	if (error) {
		console.error('❌ [OAUTH2-REDIRECT] OAuth2 error:', error);
		console.error(
			'❌ [OAUTH2-REDIRECT] Full error details:',
			url.searchParams.get('error_description')
		);
		throw redirect(302, '/login?error=oauth_failed');
	}

	if (!code) {
		console.error('❌ [OAUTH2-REDIRECT] No authorization code received');
		throw redirect(302, '/login?error=no_code');
	}

	console.log('✅ [OAUTH2-REDIRECT] Authorization code received, redirecting to auth callback');

	try {
		// Redirect to our custom auth callback with all parameters
		const callbackUrl = new URL('/auth/callback', url.origin);
		callbackUrl.search = url.search;
		console.log('🔄 [OAUTH2-REDIRECT] Redirecting to:', callbackUrl.toString());
		throw redirect(302, callbackUrl.toString());
	} catch (err) {
		console.error('❌ [OAUTH2-REDIRECT] Redirect error:', err);
		throw redirect(302, '/login?error=callback_error');
	}
};
