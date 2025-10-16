import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

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

	// For PocketBase, we need to check if user is authenticated
	// PocketBase stores auth tokens in cookies automatically
	console.log('[Hooks] 🔍 Checking PocketBase authentication for path:', event.url.pathname);

	try {
		// Create a new PocketBase client instance for this request
		const pb = new PocketBase(process.env.VITE_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

		// Get the cookie header from the request
		const cookieHeader = event.request.headers.get('cookie') || '';
		console.log('[Hooks] 🍪 Cookie header present:', !!cookieHeader);

		if (cookieHeader) {
			console.log('[Hooks] 🍪 Cookie header length:', cookieHeader.length);
			// Log if pb_auth cookie is present
			const hasPbAuth = cookieHeader.includes('pb_auth');
			console.log('[Hooks] 🍪 Has pb_auth cookie:', hasPbAuth);
		}

		// Load auth store from cookies (PocketBase handles this automatically)
		pb.authStore.loadFromCookie(cookieHeader);

		console.log('[Hooks] 🔑 Auth store loaded - isValid:', pb.authStore.isValid);
		console.log('[Hooks] 🔑 Auth store token present:', !!pb.authStore.token);

		// If we have a valid auth token, check if user is authenticated
		if (pb.authStore.isValid && pb.authStore.model) {
			const pbUser = pb.authStore.model;
			const user = {
				id: pbUser.id,
				email: pbUser.email,
				name: pbUser.name || pbUser.email?.split('@')[0] || 'User',
				firstName: pbUser.first_name,
				lastName: pbUser.last_name
			};

			console.log('[Hooks] ✅ PocketBase user authenticated:', user.email, 'ID:', user.id);
			event.locals.user = user;
			event.locals.session = {
				id: pb.authStore.token,
				userId: user.id,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
			};
		} else {
			console.log('[Hooks] ⚠️ No valid PocketBase session found');
			console.log('[Hooks] ⚠️ Auth store model:', !!pb.authStore.model);
			event.locals.user = null;
			event.locals.session = null;
		}
	} catch (error) {
		console.log('[Hooks] ❌ PocketBase auth check failed:', error);
		event.locals.user = null;
		event.locals.session = null;
	}

	console.log(
		'[Hooks] Set locals - User:',
		event.locals.user?.id,
		'Session:',
		event.locals.session?.id
	);
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
		"script-src 'self' 'unsafe-inline' https://accounts.google.com https://*.googleusercontent.com",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
		"img-src 'self' data: https: blob: https://*.googleusercontent.com https://*.gstatic.com",
		// Allow connections to PocketBase server for OAuth and API calls
		"connect-src 'self' http://127.0.0.1:8090 http://localhost:8090 ws://127.0.0.1:8090 ws://localhost:8090 https://*.pocketbase.cloud https://*.google.com https://*.facebook.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com wss://*.supabase.co",
		"font-src 'self' https://fonts.gstatic.com",
		"frame-src 'self' https://accounts.google.com",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self' https://accounts.google.com",
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

// Smart redirects middleware
const handleSmartRedirects: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const search = event.url.search;

	// Проверяем старые URL паттерны и редиректим на новые
	const redirectRules: Record<string, string> = {
		// Старые URL с языковыми префиксами -> новые URL
		// knowledgebase роуты удалены
	};

	// Проверяем точные совпадения
	if (redirectRules[pathname]) {
		const redirectUrl = redirectRules[pathname] + search;
		console.log('🔄 [Redirect] Redirecting:', pathname, '->', redirectUrl);
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectUrl
			}
		});
	}

	// Проверяем паттерны с подстраницами
	const patternRedirects = [
		{ from: /^\/uk-ua\/cats-health\/(.+)$/, to: '/cats-health/$1' },
		{ from: /^\/uk-ua\/dog-health\/(.+)$/, to: '/dog-health/$1' },
		{ from: /^\/uk-ua\/veterinary-cbd\/(.+)$/, to: '/veterinary-cbd/$1' },
		{ from: /^\/en\/cats-health\/(.+)$/, to: '/en/cats-health/$1' },
		{ from: /^\/en\/dog-health\/(.+)$/, to: '/en/dog-health/$1' },
		{ from: /^\/en\/veterinary-cbd\/(.+)$/, to: '/en/veterinary-cbd/$1' }
	];

	for (const { from, to } of patternRedirects) {
		const match = pathname.match(from);
		if (match) {
			const redirectUrl = pathname.replace(from, to) + search;
			console.log('🔄 [Redirect] Pattern redirect:', pathname, '->', redirectUrl);
			return new Response(null, {
				status: 302,
				headers: {
					Location: redirectUrl
				}
			});
		}
	}

	return resolve(event);
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
	handleSmartRedirects,
	handleLocale,
	handleSuspiciousActivity,
	handleAuth
);
