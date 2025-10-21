import { browser } from '$app/environment';

// Client-side hooks for development debugging
if (browser && import.meta.env.DEV) {
	// Log cookie information at startup for debugging
	console.log('[CLIENT HOOKS] 🍪 Cookies at startup:', {
		allCookies: document.cookie,
		hasPbAuth: document.cookie.includes('pb_auth'),
		cookieCount: document.cookie.split(';').filter(c => c.trim()).length
	});

	console.log('[CLIENT HOOKS] 🛠️ Client hooks initialized for development');
}
