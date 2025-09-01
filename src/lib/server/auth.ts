import type { RequestEvent } from '@sveltejs/kit';
import { eq, lt } from 'drizzle-orm';
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

	// Удаляем все старые сессии для этого пользователя
	await db.delete(table.sessions).where(eq(table.sessions.userId, userId));
	console.log('[Auth] Cleaned up old sessions for user:', userId);

	// Создаем новую сессию
	const expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
	const session = {
		id: sessionId,
		userId,
		expiresAt
	};

	await db.insert(table.sessions).values(session);
	console.log('[Auth] New session created successfully:', sessionId);
	return session;
}

export async function validateSessionToken(token: string) {
	// Валидация входных данных
	if (!token || typeof token !== 'string' || token.length < 10) {
		console.warn('[Auth] Invalid session token format');
		return { session: null, user: null };
	}

	console.log('[Auth] Validating session token');
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	// Валидация sessionId (должен быть hex)
	if (!/^[a-f0-9]{64}$/.test(sessionId)) {
		console.warn('[Auth] Invalid session ID format:', sessionId);
		return { session: null, user: null };
	}

	console.log('[Auth] Session ID from token:', sessionId);

	// Автоматическая очистка истекших сессий (выполняем редко, чтобы не нагружать БД)
	if (Math.random() < 0.1) {
		// 10% шанс выполнения
		console.log('[Auth] Running automatic cleanup of expired sessions...');
		try {
			const now = Date.now();
			const result = await db
				.delete(table.sessions)
				.where(lt(table.sessions.expiresAt, new Date(now)));
			if (result.changes > 0) {
				console.log(`[Auth] Cleaned up ${result.changes} expired sessions`);
			}

			// Также очищаем очень старые сессии (старше 90 дней)
			const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);
			const oldResult = await db
				.delete(table.sessions)
				.where(lt(table.sessions.createdAt, ninetyDaysAgo));

			if (oldResult.changes > 0) {
				console.log(`[Auth] Cleaned up ${oldResult.changes} very old sessions (>90 days)`);
			}
		} catch (error) {
			console.warn('[Auth] Failed to cleanup expired sessions:', error);
		}
	}

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

		// Логируем подозрительную активность (несуществующий session ID)
		console.warn('[Security] Attempt to access non-existent session:', {
			sessionId: sessionId.substring(0, 8) + '...', // Не логируем полный ID
			timestamp: new Date().toISOString(),
			action: 'session_not_found'
		});

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
		path: '/',
		httpOnly: true, // Защита от XSS - куки недоступны из JavaScript
		secure: true, // Только HTTPS в продакшене
		sameSite: 'lax', // Защита от CSRF атак
		maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней в миллисекундах
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	console.log('[Auth] Deleting session token cookie');
	event.cookies.delete(sessionCookieName, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax'
	});
}
