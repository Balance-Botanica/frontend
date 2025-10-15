<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pocketbaseAuthStore } from '$lib/auth/pocketbase-store';
	import { get } from 'svelte/store';

	let redirectTimer;

	onMount(async () => {
		console.log('🔄 [OAuth] PocketBase client callback page mounted');

		// Check URL for OAuth parameters
		let currentUrl = '';
		page.subscribe((p) => {
			currentUrl = p.url.toString();
		});

		// Check if OAuth tokens are in URL
		const hasOAuthTokens =
			currentUrl.includes('code=') ||
			currentUrl.includes('?code=') ||
			currentUrl.includes('#code=');

		console.log('🔍 [OAuth] OAuth tokens detected:', hasOAuthTokens);

		if (hasOAuthTokens) {
			console.log('🔄 [OAuth] Processing OAuth tokens...');

			try {
				// Give PocketBase time to automatically process tokens
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// Check if we're authenticated
				const currentState = get(pocketbaseAuthStore);
				const isAuthenticated = !!currentState.user;
				
				if (isAuthenticated) {
					console.log('✅ [OAuth] Authentication successful, redirecting to home...');
					goto('/', { replaceState: true });
				} else {
					console.log('⚠️ [OAuth] Authentication failed, redirecting to login...');
					goto('/login?error=Authentication failed', { replaceState: true });
				}
			} catch (error) {
				console.error('❌ [OAuth] Error processing OAuth:', error);
				goto('/login?error=Processing error', { replaceState: true });
			}
		} else {
			console.log('⚠️ [OAuth] No OAuth tokens found, redirecting to login...');
			goto('/login?error=No OAuth data', { replaceState: true });
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
			<h2 class="mt-4 text-center text-xl font-semibold text-gray-900">Redirecting...</h2>
			<p class="mt-1 text-center text-xs text-gray-500">Completing authentication</p>
		</div>
	</div>
</div>