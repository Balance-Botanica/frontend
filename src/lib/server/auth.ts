import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	console.log('[Auth] Generated session token');
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	console.log('[Auth] Creating session for user:', userId, 'with session ID:', sessionId);
	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
	const session = {
		id: sessionId,
		userId,
		expiresAt
	};
	await db.insert(table.sessions).values(session);
	console.log('[Auth] Session created successfully');
	return session;
}

export async function validateSessionToken(token: string) {
	console.log('[Auth] Validating session token');
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	console.log('[Auth] Session ID from token:', sessionId);

	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.users.id, email: table.users.email },
			session: table.sessions
		})
		.from(table.sessions)
		.innerJoin(table.users, eq(table.sessions.userId, table.users.id))
		.where(eq(table.sessions.id, sessionId));

	if (!result) {
		console.log('[Auth] No session found for session ID:', sessionId);
		return { session: null, user: null };
	}

	const { session, user } = result;
	console.log('[Auth] Found session for user:', user.id);

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		console.log('[Auth] Session expired, deleting session:', sessionId);
		await db.delete(table.sessions).where(eq(table.sessions.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		console.log('[Auth] Renewing session expiration for session:', sessionId);
		const newExpiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.sessions)
			.set({ expiresAt: newExpiresAt })
			.where(eq(table.sessions.id, session.id));
	}

	console.log('[Auth] Session validation successful for user:', user.id);
	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	console.log('[Auth] Invalidating session:', sessionId);
	await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
	console.log('[Auth] Session invalidated');
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	console.log('[Auth] Setting session token cookie, expires at:', expiresAt);
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	console.log('[Auth] Deleting session token cookie');
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
