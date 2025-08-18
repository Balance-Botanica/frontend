<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();

	const hiddenFooterPrefixes = ['/design-system', '/components', '/footer-demo'];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

{#if !hiddenFooterPrefixes.some((p) => $page.url.pathname.startsWith(p))}
	<Footer />
{/if}
