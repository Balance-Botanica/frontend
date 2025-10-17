import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('🔄 [OAUTH CALLBACK] Received OAuth callback');
	console.log('🔄 [OAUTH CALLBACK] URL:', url.toString());
	console.log('🔄 [OAUTH CALLBACK] Params:', Object.fromEntries(url.searchParams));

	// PocketBase OAuth2 callback handler
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	if (error) {
		console.error('❌ [OAUTH CALLBACK] OAuth2 error:', error);
		console.error('❌ [OAUTH CALLBACK] Full error details:', url.searchParams.get('error_description'));
		throw redirect(302, '/login?error=oauth_failed');
	}

	if (!code) {
		console.error('❌ [OAUTH CALLBACK] No authorization code received');
		throw redirect(302, '/login?error=no_code');
	}

	console.log('✅ [OAUTH CALLBACK] Authorization code received, redirecting to app');

	try {
		// Redirect back to the app - PocketBase will handle the OAuth flow
		// The actual OAuth processing happens on the client side
		throw redirect(302, '/');
	} catch (err) {
		console.error('❌ [OAUTH CALLBACK] Redirect error:', err);
		throw redirect(302, '/login?error=callback_error');
	}
};
