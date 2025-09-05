<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { currentLocale } from '$lib/i18n/store';
	import BlogLayout from '$lib/components/BlogLayout.svelte';

	export let data: any;

	// Get slug from URL parameters
	$: slug = $page.params.slug;

	// Track previous locale to detect changes and prevent loops
	let previousLocale = $currentLocale;
	let isNavigating = false;

	// Navigate to same article when locale changes
	$: if ($currentLocale !== previousLocale && slug && !isNavigating) {
		previousLocale = $currentLocale;
		isNavigating = true;

		// Small delay to prevent rapid navigation loops
		setTimeout(() => {
			goto(`/blog/${slug}?lang=${$currentLocale}`, { replaceState: true });
			isNavigating = false;
		}, 100);
	}
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
