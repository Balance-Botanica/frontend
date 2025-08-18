<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import SubHeader from '$lib/components/SubHeader.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	let { children } = $props();

	const excludeFooterRoutes = [
		'/design-system',
		'/components',
		'/footer-demo',
		'/subheader-demo'
	];

	const showFooter = $derived(!excludeFooterRoutes.includes($page.url.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<SubHeader />
	<main class="flex-grow">
		{@render children?.()}
	</main>
	{#if showFooter}
		<Footer />
	{/if}
</div>
