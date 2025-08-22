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


	const { children } = $props();

	const excludeFooterRoutes = ['/design-system', '/components'];

	const showFooter = $derived(!excludeFooterRoutes.includes($page.url.pathname));
	const isHome = $derived($page.url.pathname === '/');

	// Инициализируем i18n при загрузке
	onMount(async () => {
		try {
			await initializeI18n('uk-ua'); // Start with Ukrainian as default
		} catch (error) {
			console.error('Failed to initialize i18n:', error);
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
	{/if}
	
	<!-- Глобальный Cookie Consent -->
	<CookieConsent />
</div>
