<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import { pocketbaseAuthStore, isAuthenticated } from '$lib/auth/pocketbase-store';

	// Detect language from optional route parameter
	const lang = $derived($page.params?.lang || 'uk-ua');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Initialize auth store
	onMount(() => {
		pocketbaseAuthStore.initialize();
	});

	// Handle successful authentication
	function handleAuthSuccess(event: CustomEvent) {
		console.log('✅ Authentication successful:', event.detail);

		// Check if there's a redirect parameter in URL
		const url = new URL(window.location.href);
		const redirectTo = url.searchParams.get('redirect');

		// Redirect to specified page or homepage
		goto(redirectTo || '/');
	}

	// Handle authentication error
	function handleAuthError(event: CustomEvent) {
		console.error('❌ Authentication error:', event.detail);
		// Error is already displayed in the form component
	}

	// If user is already authenticated, redirect
	$effect(() => {
		if ($isAuthenticated) {
			console.log('🔄 [LOGIN PAGE] User already authenticated, checking redirect...');

			// Check if there's a redirect parameter in URL
			const url = new URL(window.location.href);
			const redirectTo = url.searchParams.get('redirect');

			console.log('🔄 [LOGIN PAGE] Redirect parameter:', redirectTo);

			// Only redirect if we're not already on the target page
			const currentPath = window.location.pathname;
			const targetPath = redirectTo || '/';

			if (currentPath !== targetPath) {
				console.log('🔄 [LOGIN PAGE] Redirecting from', currentPath, 'to', targetPath);
				goto(targetPath);
			} else {
				console.log('🔄 [LOGIN PAGE] Already on target page, no redirect needed');
			}
		}
	});
</script>

{#if $pageTranslations}
	<SEO
		title={$pageTranslations.t('login.meta.title')}
		description={$pageTranslations.t('login.meta.description')}
	/>

	<!-- Main Content -->
	<main class="login-page">
		<div class="login-container">
			<LoginForm on:success={handleAuthSuccess} on:error={handleAuthError} />
		</div>
	</main>
{/if}

<style>
	.login-page {
		min-height: 100vh;
		background: #f8f7f6;
		padding: 40px 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.login-container {
		width: 100%;
		max-width: 540px;
	}
</style>
