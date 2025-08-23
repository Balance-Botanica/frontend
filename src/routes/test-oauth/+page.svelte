<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabaseAuthStore, user, isAuthenticated } from '$lib/auth/supabase-store';

	// Example OAuth tokens for testing (NOT real tokens)
	const oauthTokens = `access_token=dummy_access_token_example&expires_at=1234567890&expires_in=3600&provider_refresh_token=dummy_refresh_token&provider_token=dummy_provider_token&refresh_token=dummy_refresh&token_type=bearer`;

	let authStatus = 'Checking...';

	onMount(() => {
		// Initialize auth store
		supabaseAuthStore.initialize();
		
		// Listen for auth state changes
		const unsubscribe = supabaseAuthStore.subscribe(state => {
			if (state.isLoading) {
				authStatus = 'Loading...';
			} else if (state.user) {
				authStatus = `Authenticated as ${state.user.email}`;
			} else if (state.error) {
				authStatus = `Error: ${state.error}`;
			} else {
				authStatus = 'Not authenticated';
			}
		});
		
		return unsubscribe;
	});

	function simulateOAuthCallback() {
		// Redirect to callback page with the OAuth tokens in the hash
		goto(`/auth/callback#${oauthTokens}`);
	}
	
	function signOut() {
		supabaseAuthStore.signOut();
	}
</script>

<svelte:head>
	<title>OAuth Test | Balance Botanica</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
	<div class="max-w-md w-full text-center">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">OAuth Callback Test</h1>
			<p class="text-gray-600 mb-6">
				This page tests the OAuth callback with the updated GoTrue library and singleton pattern.
			</p>
			
			<!-- Current Auth Status -->
			<div class="mb-6 p-4 bg-gray-100 rounded-lg">
				<h3 class="font-semibold text-gray-800 mb-2">🔍 Current Auth Status:</h3>
				<p class="text-sm">{authStatus}</p>
				{#if $isAuthenticated}
					<div class="mt-2 text-green-600">
						<p>✅ User: {$user?.name}</p>
						<p>✅ Email: {$user?.email}</p>
					</div>
				{/if}
			</div>
			
			<div class="space-y-3">
				<button 
					on:click={simulateOAuthCallback}
					class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
				>
					🧪 Test OAuth Callback (Dummy Tokens)
				</button>
				
				{#if $isAuthenticated}
					<button 
						on:click={signOut}
						class="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
					>
						🚪 Sign Out
					</button>
				{/if}
			</div>
			
			<div class="mt-6 text-sm text-gray-500">
				<p>This will redirect to <code>/auth/callback</code> with OAuth tokens.</p>
				<p>The new GoTrue ^2.46.1 + singleton pattern should handle URL cleanup automatically.</p>
			</div>
		</div>

		<!-- Fixes Applied -->
		<div class="mt-8 bg-green-50 rounded-lg p-6">
			<h2 class="text-xl font-semibold text-green-800 mb-4">✅ Fixes Applied</h2>
			<ul class="list-disc list-inside space-y-2 text-green-700">
				<li>Installed GoTrue ^2.46.1 to fix URL cleanup issue</li>
				<li>Implemented singleton pattern for Supabase client</li>
				<li>Enhanced auth state change listener</li>
				<li>Simplified callback page to rely on automatic OAuth handling</li>
				<li>Added auto-initialization of auth store</li>
			</ul>
		</div>

		<!-- Navigation -->
		<div class="mt-8 space-y-2">
			<a href="/login" class="block text-green-600 hover:text-green-700">← Back to Login</a>
			<a href="/" class="block text-gray-500 hover:text-gray-700">Home</a>
		</div>
	</div>
</div>