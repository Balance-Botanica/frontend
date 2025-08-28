import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

const handleAuth: Handle = async ({ event, resolve }) => {
	console.log('[Hooks] Processing request:', event.request.url);
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	console.log('[Hooks] Session token from cookie:', sessionToken ? 'Present' : 'Missing');

	if (!sessionToken) {
		console.log('[Hooks] No session token found, setting user to null');
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	console.log('[Hooks] Validating session token');
	const { session, user } = await auth.validateSessionToken(sessionToken);
	console.log(
		'[Hooks] Session validation result - Session:',
		session ? 'Valid' : 'Invalid',
		'User:',
		user ? 'Authenticated' : 'Not authenticated'
	);

	if (session) {
		console.log('[Hooks] Setting session token cookie with renewed expiration');
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		console.log('[Hooks] No valid session, deleting session token cookie');
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;
	console.log('[Hooks] Set locals - User:', user?.id, 'Session:', session?.id);
	return resolve(event);
};

export const handle: Handle = handleAuth;
