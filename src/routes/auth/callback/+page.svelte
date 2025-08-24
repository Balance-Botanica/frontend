<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';

	let loading = true;
	let error = '';
	let success = false;

	onMount(async () => {
		console.log('🔍 Callback page mounted');
		console.log('🔍 Current URL:', window.location.href);
		console.log('🔍 URL params:', $page.url.searchParams.toString());
		console.log('🔍 URL hash:', window.location.hash);
		
		try {
			// Check for error in URL params first
			const urlError = $page.url.searchParams.get('error');
			if (urlError) {
				console.error('❌ OAuth error:', urlError);
				error = urlError;
				loading = false;
				// Clean URL before redirect
				cleanUrlAndRedirect('/login', 3000);
				return;
			}

			// Check for PKCE flow (code parameter) - handled by server
			const code = $page.url.searchParams.get('code');
			if (code) {
				console.log('🔄 PKCE flow detected - server will handle code exchange');
				// Server-side +page.server.ts handles the code exchange
				// Just wait for auth state to update
				awaitAuthStateChange();
				return;
			}

			// Check for implicit flow (tokens in hash)
			const hash = window.location.hash.substring(1);
			if (hash.includes('access_token=')) {
				console.log('🔄 Implicit flow detected - tokens in URL hash');
				
				// Clean the URL hash immediately to prevent token exposure
				cleanUrlHash();
				
				// Let Supabase client handle the session automatically
				// The auth state listener will catch the session update
				awaitAuthStateChange();
				return;
			}

			// No OAuth params found - check if already authenticated
			console.log('ℹ️ No OAuth parameters found - checking existing session');
			awaitAuthStateChange();

		} catch (err) {
			console.error('❌ Callback processing error:', err);
			error = 'Authentication processing failed';
			loading = false;
			cleanUrlAndRedirect('/login', 3000);
		}
	});

	/**
	 * Clean URL hash to prevent token exposure
	 */
	function cleanUrlHash() {
		if (window.history.replaceState) {
			const cleanUrl = window.location.pathname + window.location.search;
			window.history.replaceState({}, document.title, cleanUrl);
			console.log('🧹 URL hash cleaned:', cleanUrl);
		}
	}

	/**
	 * Clean URL and redirect after a delay
	 */
	function cleanUrlAndRedirect(path: string, delay: number) {
		cleanUrlHash();
		setTimeout(() => goto(path), delay);
	}

	/**
	 * Wait for auth state changes with timeout
	 */
	function awaitAuthStateChange() {
		// Initialize auth store to trigger session detection
		supabaseAuthStore.initialize();
		
		// Listen for auth state changes
		const unsubscribe = supabaseAuthStore.subscribe(state => {
			console.log('🔍 Auth state update:', { 
				user: state.user?.email, 
				isLoading: state.isLoading,
				error: state.error 
			});
			
			if (!state.isLoading) {
				if (state.user) {
					console.log('✅ Authentication successful!');
					success = true;
					loading = false;
					unsubscribe();
					cleanUrlAndRedirect('/', 1500);
				} else if (state.error) {
					console.error('❌ Authentication failed:', state.error);
					error = state.error;
					loading = false;
					unsubscribe();
					cleanUrlAndRedirect('/login', 3000);
				} else {
					// No user and no error - redirect to login
					console.log('ℹ️ No user session found');
					loading = false;
					unsubscribe();
					cleanUrlAndRedirect('/login', 2000);
				}
			}
		});
		
		// Fallback: timeout after 10 seconds
		setTimeout(() => {
			if (loading) {
				console.error('❌ Timeout: No authentication state change detected');
				error = 'Authentication timeout - please try again';
				loading = false;
				unsubscribe();
				cleanUrlAndRedirect('/login', 3000);
			}
		}, 10000);
	}
</script>

<svelte:head>
	<title>Authenticating... | Balance Botanica</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full text-center">
		{#if loading && !error && !success}
			<!-- Loading State -->
			<div class="mb-8">
				<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
				<p class="text-gray-600">Please wait while we securely sign you in</p>
			</div>
		{:else if success}
			<!-- Success State -->
			<div class="mb-8">
				<div class="text-green-500 mb-4">
					<svg class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
				<p class="text-gray-600">Welcome back! Redirecting you to the homepage...</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="mb-8">
				<div class="text-red-500 mb-4">
					<svg class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
				<p class="text-gray-600 mb-4">{error}</p>
				<p class="text-sm text-gray-500">Redirecting to login page in 3 seconds...</p>
			</div>
		{/if}

		<!-- Balance Botanica Branding -->
		<div class="text-green-600 font-semibold text-lg">
			Balance Botanica
		</div>
	</div>
</div>