// Token Security - Immediately clear any OAuth tokens from URL
// This script runs before any other JavaScript to prevent token exposure

(function () {
	'use strict';

	if (typeof window !== 'undefined') {
		const hash = window.location.hash;

		// Check if URL contains OAuth tokens
		if (hash.includes('access_token=')) {
			console.log('🔒 Security: OAuth tokens detected in URL - clearing immediately');

			// If not already on callback page, redirect there with the tokens
			if (!window.location.pathname.includes('/auth/callback')) {
				console.log('🔄 Redirecting to secure callback page...');
				window.location.href = '/auth/callback' + hash;
			} else {
				// If already on callback page, extract and clear tokens
				console.log('🧹 Clearing tokens from callback page URL...');
				window.history.replaceState({}, document.title, window.location.pathname);
			}
		}
	}
})();
