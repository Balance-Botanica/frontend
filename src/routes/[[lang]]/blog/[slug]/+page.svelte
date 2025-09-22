<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { language } from '$lib/stores/language';
	import BlogLayout from '$lib/components/BlogLayout.svelte';

	const { data }: { data: any } = $props();

	// Get slug and lang from URL parameters
	const slug = $derived($page.params?.slug);
	const lang = $derived($page.params?.lang || 'uk-ua');

	// Track previous locale to detect changes and prevent loops
	let previousLocale = $language;
	let isNavigating = false;

	// Navigate to same article when locale changes
	$effect(() => {
		if ($language !== previousLocale && slug && !isNavigating) {
			previousLocale = $language;
			isNavigating = true;

			// Small delay to prevent rapid navigation loops
			setTimeout(() => {
				// Use language prefix in URL - English gets /en, Ukrainian gets no prefix
				const fullUrl = $language === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;
				goto(fullUrl, { replaceState: true });
				isNavigating = false;
			}, 100);
		}
	});
</script>

<svelte:head>
	<title>{data?.title || 'Article Not Found'} - Balance Botanica</title>
	<meta name="description" content={data?.description || 'This article could not be found.'} />
</svelte:head>

<BlogLayout
	title={data?.title || 'Article Not Found'}
	description={data?.description || 'This article could not be found.'}
	date={data?.date || new Date().toISOString()}
	author={data?.author || 'Balance Botanica'}
	tags={data?.tags || []}
	slug={slug || ''}
>
	{@html data?.content || '<p>Article content not available.</p>'}
</BlogLayout>
