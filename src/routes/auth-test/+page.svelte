<script lang="ts">
	import { onMount } from 'svelte';
	import { supabaseAuthStore, user, session, isAuthenticated } from '$lib/auth/supabase-store';

	let authState = '';

	onMount(() => {
		// Initialize the auth store
		supabaseAuthStore.initialize();

		// Subscribe to auth changes for debugging
		const unsubscribe = supabaseAuthStore.subscribe((state) => {
			authState = JSON.stringify(state, null, 2);
			console.log('🔄 Auth state changed:', state);
		});

		return unsubscribe;
	});

	async function testGoogleAuth() {
		try {
			await supabaseAuthStore.signInWithGoogle();
		} catch (error) {
			console.error('Google auth test failed:', error);
		}
	}

	async function testEmailAuth() {
		try {
			await supabaseAuthStore.signInWithEmail({
				email: 'test@example.com',
				password: 'testpassword123'
			});
		} catch (error) {
			console.error('Email auth test failed:', error);
		}
	}

	async function testSignOut() {
		try {
			await supabaseAuthStore.signOut();
		} catch (error) {
			console.error('Sign out test failed:', error);
		}
	}
</script>

<svelte:head>
	<title>Auth Test - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto max-w-4xl p-8">
	<h1 class="text-3xl font-bold mb-8 text-center">🧪 Authentication Test Page</h1>
	
	<!-- Authentication Status -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4">📊 Current Auth Status</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
			<div class="p-4 bg-gray-50 rounded">
				<h3 class="font-medium text-gray-700">Authenticated</h3>
				<p class="text-lg font-bold {$isAuthenticated ? 'text-green-600' : 'text-red-600'}">
					{$isAuthenticated ? '✅ Yes' : '❌ No'}
				</p>
			</div>
			
			<div class="p-4 bg-gray-50 rounded">
				<h3 class="font-medium text-gray-700">User Email</h3>
				<p class="text-lg font-bold text-blue-600">
					{$user?.email || 'Not available'}
				</p>
			</div>
			
			<div class="p-4 bg-gray-50 rounded">
				<h3 class="font-medium text-gray-700">User Name</h3>
				<p class="text-lg font-bold text-purple-600">
					{$user?.name || 'Not available'}
				</p>
			</div>
		</div>

		{#if $user}
			<div class="mt-4 p-4 bg-green-50 rounded">
				<h3 class="font-medium text-gray-700 mb-2">👤 User Object</h3>
				<pre class="text-sm overflow-auto">{JSON.stringify($user, null, 2)}</pre>
			</div>
		{/if}
	</div>

	<!-- Test Buttons -->
	<div class="bg-white rounded-lg shadow-lg p-6 mb-6">
		<h2 class="text-xl font-semibold mb-4">🧪 Test Actions</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<button
				on:click={testGoogleAuth}
				class="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
				disabled={$isAuthenticated}
			>
				🚀 Test Google OAuth
			</button>
			
			<button
				on:click={testEmailAuth}
				class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
				disabled={$isAuthenticated}
			>
				📧 Test Email Auth
			</button>
			
			<button
				on:click={testSignOut}
				class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
				disabled={!$isAuthenticated}
			>
				🚪 Sign Out
			</button>
		</div>
	</div>

	<!-- Auth State Debug -->
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="text-xl font-semibold mb-4">🔍 Debug Info</h2>
		<div class="space-y-4">
			<div>
				<h3 class="font-medium text-gray-700 mb-2">Environment Check</h3>
				<ul class="space-y-1 text-sm">
					<li>Supabase URL: <code class="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_SUPABASE_URL || '❌ Not set'}</code></li>
					<li>Supabase Anon Key: <code class="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</code></li>
				</ul>
			</div>
			
			<div>
				<h3 class="font-medium text-gray-700 mb-2">Auth Store State</h3>
				<pre class="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64">{authState}</pre>
			</div>
		</div>
	</div>

	<!-- Instructions -->
	<div class="mt-8 bg-blue-50 rounded-lg p-6">
		<h2 class="text-xl font-semibold text-blue-800 mb-4">📝 Setup Instructions</h2>
		<ol class="list-decimal list-inside space-y-2 text-blue-700">
			<li>Create a <code>.env.local</code> file with your Supabase credentials</li>
			<li>Configure Google OAuth in your Supabase project</li>
			<li>Set up the redirect URL: <code>http://localhost:5175/auth/callback</code></li>
			<li>Test the authentication flows above</li>
		</ol>
	</div>
</div>