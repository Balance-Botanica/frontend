<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { currentLocale } from '$lib/i18n/store';
	import BlogLayout from '$lib/components/BlogLayout.svelte';

	const { data }: { data: any } = $props();

	// Get slug and lang from URL parameters
	let slug = $derived($page.params?.slug);
	let lang = $derived($page.params?.lang || 'uk-ua');

	// Track previous locale to detect changes and prevent loops
	let previousLocale = $currentLocale;
	let isNavigating = false;

	// Navigate to same article when locale changes
	$effect(() => {
		if ($currentLocale !== previousLocale && slug && !isNavigating) {
		previousLocale = $currentLocale;
		isNavigating = true;

		// Small delay to prevent rapid navigation loops
		setTimeout(() => {
			// Use language prefix in URL instead of query parameter
			const langPrefix = $currentLocale === 'en' ? '/en' : '';
			goto(`${langPrefix}/blog/${slug}`, { replaceState: true });
			isNavigating = false;
		}, 100);
	});
</script>

<svelte:head>
	<title>{data?.title} - Balance Botanica</title>
	<meta name="description" content={data?.description} />
</svelte:head>

<BlogLayout
	title={data?.title}
	description={data?.description}
	date={data?.date}
	author={data?.author}
	tags={data?.tags}
	slug={slug}
>
	{@html data?.content}
</BlogLayout>
