import { redirect } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import * as auth from '$lib/server/auth';
import { userService } from '$lib/server/application/services/user.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies, getClientAddress }) => {
	// Получаем IP адрес с обработкой ошибок
	let clientIP: string;
	try {
		clientIP = getClientAddress();
	} catch (error) {
		console.log('🔓 [OAuth] Could not determine client address, skipping rate limiting');
		clientIP = 'unknown';
	}

	// Rate limiting для OAuth callback (только для известных IP)
	if (clientIP !== 'unknown') {
		const rateLimitKey = `oauth_callback_${clientIP}`;

		// Простая rate limiting для OAuth (5 попыток в минуту)
		const attempts = (global as any).oauthAttempts || {};
		const now = Date.now();

		if (!attempts[rateLimitKey] || now - attempts[rateLimitKey].timestamp > 60000) {
			attempts[rateLimitKey] = { count: 1, timestamp: now };
		} else if (attempts[rateLimitKey].count >= 5) {
			console.warn('🚫 [OAuth] Rate limit exceeded for IP:', clientIP);
			throw redirect(302, '/login?error=Too many requests');
		} else {
			attempts[rateLimitKey].count++;
		}

		(global as any).oauthAttempts = attempts;
	}

	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	// Create server-side Supabase client for OAuth using SvelteKit env
	console.log('🔧 [OAuth] Using SvelteKit env variables');
	console.log('🔧 [OAuth] SUPABASE_URL available:', !!SUPABASE_URL);
	console.log('🔧 [OAuth] SUPABASE_ANON_KEY available:', !!SUPABASE_ANON_KEY);

	const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});

	// Валидация OAuth code
	if (!code) {
		console.warn('🚫 [OAuth] No authorization code provided');
		throw redirect(302, '/login?error=No authorization code');
	}

	if (code.length < 10 || !/^[a-zA-Z0-9_\/-]+$/.test(code)) {
		console.warn('🚫 [OAuth] Invalid authorization code format:', code);
		throw redirect(302, '/login?error=Invalid authorization code');
	}

	// Валидация next URL (защита от open redirect)
	const isDevelopment = process.env.NODE_ENV !== 'production';
	const allowedHosts = isDevelopment
		? ['localhost:5173', '127.0.0.1:5173', '192.168.', '10.', '172.']
		: ['yourdomain.com']; // Заменить на реальный домен в продакшене

	try {
		const nextUrl = new URL(next, url.origin);

		// Разрешаем редирект на тот же хост или на localhost в режиме разработки
		const isSameHost = nextUrl.host === url.host;
		const isLocalhostRedirect =
			isDevelopment &&
			(nextUrl.host === 'localhost:5173' ||
				nextUrl.host === '127.0.0.1:5173' ||
				nextUrl.host.startsWith('192.168.') ||
				nextUrl.host.startsWith('10.') ||
				nextUrl.host.startsWith('172.'));

		if (!isSameHost && !isLocalhostRedirect) {
			console.warn('🚫 [OAuth] Suspicious redirect URL:', next, 'from host:', nextUrl.host);
			throw redirect(302, '/');
		}
	} catch (error) {
		console.warn('🚫 [OAuth] Invalid redirect URL:', next);
		throw redirect(302, '/');
	}

	if (code) {
		try {
			// Exchange the code for a session with timeout
			const exchangePromise = supabase.auth.exchangeCodeForSession(code);
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('OAuth exchange timeout')), 10000)
			);

			const { data, error } = (await Promise.race([exchangePromise, timeoutPromise])) as any;

			if (error) {
				console.error('❌ OAuth callback error:', error);
				throw redirect(303, `/login?error=${encodeURIComponent(error.message)}`);
			}

			if (data.session) {
				// Set the session cookies for SSR with enhanced security
				const isDevelopment = process.env.NODE_ENV !== 'production';

				cookies.set('sb-access-token', data.session.access_token, {
					path: '/',
					maxAge: data.session.expires_in,
					httpOnly: true, // Защита от XSS
					secure: !isDevelopment, // HTTPS только в продакшене
					sameSite: 'strict' // Строгая защита от CSRF
				});

				cookies.set('sb-refresh-token', data.session.refresh_token, {
					path: '/',
					maxAge: 60 * 60 * 24 * 30, // 30 days
					httpOnly: true, // Защита от XSS
					secure: !isDevelopment, // HTTPS только в продакшене
					sameSite: 'strict' // Строгая защита от CSRF
				});

				// Create session token for server-side authentication
				// Get or create user in our database and use the database user ID
				const supabaseUserId = data.user.id;
				const userEmail = data.user.email || '';

				// Audit logging для безопасности
				console.log('🔐 [Security Audit] OAuth login attempt:', {
					supabaseUserId,
					userEmail: userEmail ? userEmail.replace(/(.{2}).*(@.*)/, '$1***$2') : 'no-email',
					ip: clientIP,
					timestamp: new Date().toISOString(),
					userAgent: 'OAuth callback'
				});

				console.log('[OAuth Callback] Getting or creating user in database');
				const user = await userService.getOrCreateUser(supabaseUserId, userEmail);

				if (!user) {
					console.error('❌ Failed to create user in database');
					throw redirect(303, `/login?error=${encodeURIComponent('Failed to create user')}`);
				}

				// Create session with the database user ID
				const sessionToken = auth.generateSessionToken();
				const session = await auth.createSession(sessionToken, user.id);
				auth.setSessionTokenCookie({ cookies } as any, sessionToken, session.expiresAt);

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
