import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

// Simple in-memory rate limiter (для продакшена используйте Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(
	clientIP: string,
	maxRequests: number = 10,
	windowMs: number = 60000
): boolean {
	// Для localhost в режиме разработки делаем rate limiting менее строгим
	const isDevelopment = process.env.NODE_ENV !== 'production';
	const isLocalhost =
		clientIP === '::1' ||
		clientIP === '127.0.0.1' ||
		clientIP.startsWith('192.168.') ||
		clientIP.startsWith('10.');

	if (isDevelopment && isLocalhost) {
		maxRequests = 100; // Увеличиваем лимит для localhost
		windowMs = 300000; // 5 минут вместо 1 минуты
	}
	const now = Date.now();
	const clientData = rateLimitMap.get(clientIP);

	if (!clientData || now > clientData.resetTime) {
		rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
		return true;
	}

	if (clientData.count >= maxRequests) {
		return false;
	}

	clientData.count++;
	return true;
}

const handleAuth: Handle = async ({ event, resolve }) => {
	console.log('🔗 [Hooks] Processing request:', event.request.url);

	// Rate limiting для защиты от brute force (отключаем для разработки)
	const isDevelopment = process.env.NODE_ENV !== 'production';

	// Получаем IP адрес с обработкой ошибок
	let clientIP: string;
	try {
		clientIP = event.getClientAddress();
	} catch (error) {
		console.log('🔓 [Rate Limit] Could not determine client address, skipping rate limiting');
		return resolve(event);
	}

	const isLocalhost =
		clientIP === '::1' ||
		clientIP === '127.0.0.1' ||
		clientIP.startsWith('192.168.') ||
		clientIP.startsWith('10.');

	// Пропускаем rate limiting для localhost в режиме разработки
	if (!isDevelopment || !isLocalhost) {
		if (!checkRateLimit(clientIP)) {
			console.warn('🚫 [Rate Limit] Request blocked from IP:', clientIP);
			return new Response('Too Many Requests', { status: 429 });
		}
	} else {
		console.log('🔓 [Rate Limit] Skipped for localhost in development mode');
	}

	const sessionToken = event.cookies.get(auth.sessionCookieName);
	console.log('🍪 [Hooks] Session token from cookie:', sessionToken ? 'Present' : 'Missing');

	if (sessionToken) {
		console.log(
			'🔍 [Hooks] Session token value (first 10 chars):',
			sessionToken.substring(0, 10) + '...'
		);
	}

	if (!sessionToken) {
		console.log('[Hooks] No session token found, setting user to null');
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	console.log('[Hooks] Validating session token');
	console.log(
		'[Hooks] Session token value (first 10 chars):',
		sessionToken.substring(0, 10) + '...'
	);
	const { session, user } = await auth.validateSessionToken(sessionToken);
	console.log(
		'[Hooks] Session validation result - Session:',
		session ? 'Valid' : 'Invalid',
		'User:',
		user ? 'Authenticated' : 'Not authenticated'
	);
	if (user) {
		console.log('[Hooks] User found:', user.email);
	}

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

// Security headers middleware
const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Добавляем заголовки безопасности
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	// Content Security Policy для дополнительной защиты
	const csp = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://*.supabase.co",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: https: blob:",
		"connect-src 'self' https://*.supabase.co wss://*.supabase.co",
		"font-src 'self' https://fonts.gstatic.com",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'"
	].join('; ');

	response.headers.set('Content-Security-Policy', csp);

	// CORS headers для API
	if (event.url.pathname.startsWith('/api/')) {
		response.headers.set('Access-Control-Allow-Origin', event.url.origin);
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		response.headers.set('Access-Control-Max-Age', '86400');
	}

	return response;
};

// Locale detection middleware
const handleLocale: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;

	// Определяем локаль из URL
	let locale = 'uk-ua'; // По умолчанию украинский

	if (pathname.startsWith('/en/') || pathname === '/en') {
		locale = 'en';
	}

	// Добавляем локаль в locals
	event.locals.locale = locale;

	console.log('🌍 [Locale] Detected locale:', locale, 'for path:', pathname);
	return resolve(event);
};

// Suspicious activity detection
const handleSuspiciousActivity: Handle = async ({ event, resolve }) => {
	const userAgent = event.request.headers.get('user-agent') || '';

	// Получаем IP адрес с обработкой ошибок
	let clientIP: string;
	try {
		clientIP = event.getClientAddress();
	} catch (error) {
		console.log(
			'🔓 [Security] Could not determine client address, skipping suspicious activity check'
		);
		return resolve(event);
	}

	// Пропускаем проверку для localhost в режиме разработки
	const isDevelopment = process.env.NODE_ENV !== 'production';
	const isLocalhost =
		clientIP === '::1' ||
		clientIP === '127.0.0.1' ||
		clientIP.startsWith('192.168.') ||
		clientIP.startsWith('10.');

	if (!isDevelopment || !isLocalhost) {
		// Проверка на подозрительные User-Agent
		const suspiciousPatterns = [
			/bot|crawl|spider|scraper/i,
			/sqlmap|nikto|dirbuster|nmap/i,
			/postman|insomnia/i // Оставляем только самые подозрительные, убираем curl для разработки
		];

		const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(userAgent));

		if (isSuspicious && !event.url.pathname.startsWith('/api/')) {
			console.warn('🚨 [Security] Suspicious request detected:', {
				ip: clientIP,
				userAgent: userAgent.substring(0, 100),
				path: event.url.pathname,
				method: event.request.method
			});
		}
	} else {
		console.log(
			'🔓 [Security] Suspicious activity check skipped for localhost in development mode'
		);
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	handleSecurityHeaders,
	handleLocale,
	handleSuspiciousActivity,
	handleAuth
);
