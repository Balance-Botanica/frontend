<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { pocketbaseAuthStore, isAuthenticated } from '$lib/auth/pocketbase-store';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import { getLocalizedUrl } from '$lib/stores/language';

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

		// Check for redirect parameter
		const redirectUrl = $page.url.searchParams.get('redirect');
		if (redirectUrl) {
			// Redirect to the intended page
			goto(redirectUrl);
		} else {
			// Redirect to profile page
			goto(getLocalizedUrl('/profile'));
		}
	}

	// Handle authentication error
	function handleAuthError(event: CustomEvent) {
		console.error('❌ Authentication error:', event.detail);
		// Error is already displayed in the form component
	}

	// If user is already authenticated, redirect
	$effect(() => {
		if ($isAuthenticated) {
			// Check for redirect parameter
			const redirectUrl = $page.url.searchParams.get('redirect');
			if (redirectUrl) {
				// Redirect to the intended page
				goto(redirectUrl);
			} else {
				// Redirect to profile page
				goto(getLocalizedUrl('/profile'));
			}
		}
	});
</script>