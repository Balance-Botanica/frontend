import { browser } from '$app/environment';

// Intercept fetch requests in development to add authentication headers
if (browser && import.meta.env.DEV) {
	const originalFetch = window.fetch;

	// Log localStorage contents at startup
	console.log('[CLIENT HOOKS] 🔍 localStorage contents at startup:', {
		pb_token: localStorage.getItem('pb_token') ? 'present' : 'not present',
		allKeys: Object.keys(localStorage),
		totalItems: localStorage.length
	});

	window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

		// Only intercept requests to our own server (localhost:5173)
		if (url.includes('localhost:5173') || url.includes('127.0.0.1:5173')) {
			const pbToken = localStorage.getItem('pb_token');

			// Log localStorage state for every request
			console.log('[CLIENT HOOKS] 🔍 localStorage check for request:', {
				url: url,
				pb_token: pbToken ? `present (${pbToken.length} chars)` : 'not present',
				totalItems: localStorage.length
			});

			if (pbToken) {
				console.log('[CLIENT HOOKS] 🛠️ Adding x-pb-auth header to request:', url);

				// Clone the init object to avoid modifying the original
				const modifiedInit: RequestInit = { ...init };

				// Add or modify headers
				modifiedInit.headers = {
					...((init?.headers as Record<string, string>) || {}),
					'x-pb-auth': pbToken
				};

				return originalFetch(input, modifiedInit);
			} else {
				console.log('[CLIENT HOOKS] ⚠️ No pb_token found in localStorage');
			}
		}

		// For all other requests, use original fetch
		return originalFetch(input, init);
	};

	console.log('[CLIENT HOOKS] 🛠️ Fetch interceptor installed for development');
}
