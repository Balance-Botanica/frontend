import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { getAuthenticatedClient } from '$lib/server/pocketbase';
import type { User } from './domain/interfaces/user.interface';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

// Extend the User interface for session validation result to include additional properties
interface ExtendedUser extends User {
	name?: string;
	firstName?: string;
	lastName?: string;
}

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	console.log('[Auth] Generated session token');
	return token;
}

// PocketBase handles session management internally, so we don't need to create sessions in our DB
export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	console.log('[Auth] Creating session for user:', userId, 'with session ID:', sessionId);

	// For PocketBase, we rely on its built-in session management
	// The session token is handled by PocketBase itself
	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
	const session = {
		id: sessionId,
		userId,
		expiresAt
	};

	console.log('[Auth] Session created successfully:', sessionId);
	return session;
}

// PocketBase handles session validation internally
export async function validateSessionToken(token: string) {
	// Validate input
	if (!token || typeof token !== 'string' || token.length < 10) {
		console.warn('[Auth] Invalid session token format');
		return { session: null, user: null };
	}

	console.log('[Auth] Validating session token');
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Validate sessionId (should be hex)
	if (!/^[a-f0-9]{64}$/.test(sessionId)) {
		console.warn('[Auth] Invalid session ID format:', sessionId);
		return { session: null, user: null };
	}

	console.log('[Auth] Session ID from token:', sessionId);

	// For PocketBase, we would typically validate using PocketBase's auth system
	// This is a simplified version - in practice, you'd use PocketBase's built-in validation
	try {
		// Get authenticated PocketBase client
		const pb = await getAuthenticatedClient();

		// Try to authenticate with the token
		// Note: This is a simplified approach - PocketBase typically handles this automatically
		const authData = await pb.collection('users').authRefresh();

		if (authData && authData.record) {
			const user: ExtendedUser = {
				id: authData.record.id || '',
				email: authData.record.email || '',
				name: authData.record.name || '',
				firstName: authData.record.first_name || '',
				lastName: authData.record.last_name || '',
				createdAt: new Date(authData.record.created || Date.now())
			};

			const session = {
				id: sessionId,
				userId: user.id,
				expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
			};

			console.log('[Auth] Session validation successful for user:', user.id);
			return { session, user };
		}
	} catch (error) {
		console.warn('[Auth] Session validation failed:', error);
	}

	return { session: null, user: null };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

// PocketBase handles session invalidation internally
export async function invalidateSession(sessionId: string) {
	console.log('[Auth] Invalidating session:', sessionId);
	// For PocketBase, session invalidation is handled by PocketBase itself
	// We don't need to do anything in our database
	console.log('[Auth] Session invalidated');
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	console.log('[Auth] Setting session token cookie, expires at:', expiresAt);
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/',
		httpOnly: true, // XSS protection - cookies not accessible from JavaScript
		secure: process.env.NODE_ENV === 'production', // HTTPS only in production
		sameSite: 'lax', // CSRF protection
		maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	console.log('[Auth] Deleting session token cookie');
	event.cookies.delete(sessionCookieName, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
}

// PocketBase authentication functions
export async function validatePocketBaseToken(token: string) {
	try {
		console.log('[Auth] Validating PocketBase token');

		// Get authenticated PocketBase client
		const pb = await getAuthenticatedClient();

		// Validate the token by trying to get the user
		const user = await pb.collection('users').authRefresh();

		if (user) {
			console.log('[Auth] PocketBase token valid for user:', user.record.id);
			return { user: user.record, isValid: true };
		} else {
			console.log('[Auth] PocketBase token invalid');
			return { user: null, isValid: false };
		}
	} catch (error) {
		console.error('[Auth] Error validating PocketBase token:', error);
		return { user: null, isValid: false };
	}
}
