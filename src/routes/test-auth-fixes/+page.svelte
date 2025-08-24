<script lang="ts">
	import { onMount } from 'svelte';
	import { supabaseAuthStore, user, isAuthenticated, isLoading, error } from '$lib/auth/supabase-store';

	let testResults: string[] = [];
	let testStatus = 'ready';

	onMount(() => {
		addTestResult('🔍 Auth Fix Test Page Loaded');
		addTestResult(`🔍 Initial auth state: ${$isAuthenticated ? 'authenticated' : 'not authenticated'}`);
		if ($user) {
			addTestResult(`👤 User: ${$user.email} (${$user.name || 'no name'})`);
		}
	});

	function addTestResult(message: string) {
		testResults = [...testResults, `[${new Date().toLocaleTimeString()}] ${message}`];
	}

	async function testGoogleOAuth() {
		testStatus = 'testing';
		addTestResult('🚀 Starting Google OAuth test...');
		
		try {
			await supabaseAuthStore.signInWithGoogle();
			addTestResult('✅ Google OAuth initiated successfully');
			addTestResult('📍 You should be redirected to Google for authentication');
		} catch (error) {
			addTestResult(`❌ Google OAuth failed: ${error}`);
			testStatus = 'ready';
		}
	}

	async function testSignOut() {
		testStatus = 'testing';
		addTestResult('🚪 Testing sign out...');
		
		try {
			await supabaseAuthStore.signOut();
			addTestResult('✅ Sign out successful');
			testStatus = 'ready';
		} catch (error) {
			addTestResult(`❌ Sign out failed: ${error}`);
			testStatus = 'ready';
		}
	}

	function clearResults() {
		testResults = [];
		testStatus = 'ready';
	}

	// Reactive statements to track auth changes
	$: if ($user) {
		addTestResult(`👤 Auth state updated: ${$user.email} (${$user.name || 'no name'})`);
		if ($user.avatarUrl) {
			addTestResult(`🖼️ Avatar URL: ${$user.avatarUrl}`);
		}
		testStatus = 'ready';
	}

	$: if ($error) {
		addTestResult(`❌ Auth error: ${$error}`);
		testStatus = 'ready';
	}
</script>

<svelte:head>
	<title>Auth Fixes Test | Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4">
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">🧪 OAuth Authentication Fixes Test</h1>
			
			<!-- Current Status -->
			<div class="mb-6 p-4 bg-blue-50 rounded-lg">
				<h2 class="text-xl font-semibold text-blue-800 mb-3">Current Status</h2>
				<div class="space-y-2">
					<p><strong>Authenticated:</strong> {$isAuthenticated ? '✅ Yes' : '❌ No'}</p>
					<p><strong>Loading:</strong> {$isLoading ? '⏳ Yes' : '✅ No'}</p>
					{#if $user}
						<p><strong>User Email:</strong> {$user.email}</p>
						<p><strong>User Name:</strong> {$user.name || 'Not set'}</p>
						{#if $user.avatarUrl}
							<p><strong>Avatar:</strong> <img src={$user.avatarUrl} alt="Avatar" class="inline w-8 h-8 rounded-full ml-2" /></p>
						{/if}
					{/if}
					{#if $error}
						<p><strong>Error:</strong> <span class="text-red-600">{$error}</span></p>
					{/if}
				</div>
			</div>

			<!-- Test Controls -->
			<div class="mb-6 space-y-4">
				<h2 class="text-xl font-semibold text-gray-800">Test Controls</h2>
				<div class="flex gap-4">
					<button 
						on:click={testGoogleOAuth}
						disabled={testStatus === 'testing' || $isAuthenticated}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{testStatus === 'testing' ? '⏳ Testing...' : '🔐 Test Google OAuth'}
					</button>
					
					{#if $isAuthenticated}
						<button 
							on:click={testSignOut}
							disabled={testStatus === 'testing'}
							class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{testStatus === 'testing' ? '⏳ Testing...' : '🚪 Test Sign Out'}
						</button>
					{/if}

					<button 
						on:click={clearResults}
						class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
					>
						🗑️ Clear Results
					</button>
				</div>
			</div>

			<!-- Test Results -->
			<div class="mb-6">
				<h2 class="text-xl font-semibold text-gray-800 mb-3">Test Results</h2>
				<div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
					{#if testResults.length === 0}
						<p class="text-gray-500">No test results yet...</p>
					{:else}
						{#each testResults as result}
							<div class="mb-1">{result}</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Expected Fixes -->
			<div class="mb-6 p-4 bg-green-50 rounded-lg">
				<h2 class="text-xl font-semibold text-green-800 mb-3">✅ Fixes Applied</h2>
				<ul class="list-disc list-inside space-y-1 text-green-700">
					<li>Automatic token cleanup from URLs after OAuth</li>
					<li>URL hash cleanup to prevent URLs ending with /#</li>
					<li>Enhanced auth state synchronization for OAuth login</li>
					<li>Improved callback flow handling both PKCE and implicit flows</li>
					<li>Universal token detection in layout</li>
					<li>Enhanced user data extraction from OAuth metadata</li>
				</ul>
			</div>

			<!-- Test Instructions -->
			<div class="p-4 bg-yellow-50 rounded-lg">
				<h2 class="text-xl font-semibold text-yellow-800 mb-3">📝 Test Instructions</h2>
				<ol class="list-decimal list-inside space-y-2 text-yellow-700">
					<li>Click "Test Google OAuth" to start authentication flow</li>
					<li>Complete Google OAuth in the popup/redirect</li>
					<li>Check that you return to this page with user data visible</li>
					<li>Verify URL is clean (no # or tokens)</li>
					<li>Check header shows your user info</li>
					<li>Test sign out functionality</li>
				</ol>
			</div>

			<!-- Navigation -->
			<div class="mt-8 text-center">
				<a href="/" class="text-blue-600 hover:text-blue-700 underline">← Back to Home</a>
			</div>
		</div>
	</div>
</div>