<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { i18nReady, initializeI18n } from '$lib/i18n/store';
	import Header from '$lib/components/Header.svelte';
	import SubHeader from '$lib/components/SubHeader.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { supabaseAuthStore } from '$lib/auth/supabase-store';


	const { children } = $props();

	const excludeFooterRoutes = ['/design-system', '/components'];

	const showFooter = $derived(!excludeFooterRoutes.includes($page.url.pathname));
	const isHome = $derived($page.url.pathname === '/');

	// Initialize i18n and auth on mount
	onMount(async () => {
		try {
			// Initialize auth state - let Supabase handle OAuth automatically
			supabaseAuthStore.initialize();
			
			await initializeI18n('uk-ua'); // Start with Ukrainian as default
		} catch (error) {
			console.error('Failed to initialize:', error);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	{#if $i18nReady}
		<SubHeader />
		<Header />
		<main class="flex-grow">
			{@render children?.()}
		</main>
		{#if showFooter}
			<Footer />
		{/if}
		
		<!-- Cookie Consent - now inside i18nReady block for proper translations -->
		<CookieConsent />
	{/if}
</div>
