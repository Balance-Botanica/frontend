<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ProductSearch from '$lib/components/ProductSearch.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';

	const { data }: { data: PageData } = $props();

	// Use global translations (reactive to global locale changes)
	const pageTranslations = createPageTranslations();

	// Language prefix preserved across all navigations ('' for default uk, '/en', '/uk-ua', ...)
	function langPrefix(): string {
		const lang = $page.params.lang;
		return lang ? `/${lang}` : '';
	}

	function buildUrl(params: Record<string, string | null>) {
		const queryParams: string[] = [];
		for (const [key, value] of Object.entries(params)) {
			if (value !== null && value !== undefined && value !== '') {
				queryParams.push(`${key}=${encodeURIComponent(value)}`);
			}
		}
		const queryString = queryParams.join('&');
		return `${langPrefix()}/products${queryString ? '?' + queryString : ''}`;
	}

	// Handle search event
	function handleSearch(event: CustomEvent) {
		const { searchTerm, category, size, flavor, minPrice, maxPrice } = event.detail;
		goto(
			buildUrl({
				search: searchTerm || null,
				category: category || null,
				size: size || null,
				flavor: flavor || null,
				minPrice: minPrice !== null && minPrice !== undefined ? String(minPrice) : null,
				maxPrice: maxPrice !== null && maxPrice !== undefined ? String(maxPrice) : null
			})
		);
	}

	// Handle reset event (keeps the language!)
	function handleReset() {
		goto(`${langPrefix()}/products`);
	}

	// Remove a single active filter and navigate
	function removeFilter(key: string) {
		goto(
			buildUrl({
				search: key === 'search' ? null : data.searchTerm || null,
				category: key === 'category' ? null : data.category || null,
				size: key === 'size' ? null : data.size || null,
				flavor: key === 'flavor' ? null : data.flavor || null,
				minPrice:
					key === 'minPrice' || data.minPrice === null ? null : String(data.minPrice),
				maxPrice:
					key === 'maxPrice' || data.maxPrice === null ? null : String(data.maxPrice)
			})
		);
	}

	// Active filter chips (human-readable)
	const activeFilters = $derived(
		[
			data.searchTerm ? { key: 'search', label: `“${data.searchTerm}”` } : null,
			data.category ? { key: 'category', label: humanize(data.category) } : null,
			data.size ? { key: 'size', label: humanize(data.size) } : null,
			data.flavor ? { key: 'flavor', label: humanize(data.flavor) } : null,
			data.minPrice !== null ? { key: 'minPrice', label: `≥ ${data.minPrice} грн` } : null,
			data.maxPrice !== null ? { key: 'maxPrice', label: `≤ ${data.maxPrice} грн` } : null
		].filter(Boolean) as { key: string; label: string }[]
	);

	const hasFilters = $derived(activeFilters.length > 0);

	function humanize(value: string): string {
		const map: Record<string, string> = {
			trial: 'Trial',
			week: 'Week',
			halfmonth: 'Half month',
			month: 'Month',
			curcumin: 'Curcumin',
			paste: 'Paste',
			treats: 'Treats',
			dogs: 'Dogs',
			subscription: 'Subscription',
			'turmeric-ginger': 'Turmeric & ginger',
			'pumpkin-coconut': 'Pumpkin & coconut'
		};
		if (map[value]) return map[value];
		return value
			.replace(/[-_]+/g, ' ')
			.replace(/\b\w/g, (c) => c.toUpperCase());
	}

	// SEO with SSR-safe fallbacks (never gate <SEO> behind client-side translations)
	const seoTitle = $derived(
		$pageTranslations?.t('products.meta.title') ||
			'Golden Paste Jars TRIAL / WEEK / HALF / MONTH | Balance Botanica'
	);
	const seoDescription = $derived(
		$pageTranslations?.t('products.meta.description') ||
			'Golden paste jars for dogs: 30 / 100 / 250 / 500 ml. About 60 mg curcuminoids per teaspoon.'
	);
</script>

<!-- Always rendered so crawlers get title/description/canonical in SSR HTML -->
<SEO
	title={String(seoTitle)}
	description={String(seoDescription)}
	currentPath={$page.url.pathname}
	robots={hasFilters ? 'noindex, follow' : undefined}
/>

<div class="min-h-screen overflow-x-hidden bg-cream">
	<!-- Main Content -->
	<div class="mx-auto max-w-7xl overflow-x-hidden px-3 py-8 sm:px-4 sm:px-6 lg:px-8">
		<!-- Breadcrumb -->
		<nav aria-label="Breadcrumb" class="mb-4 text-sm text-gray-500">
			<a href={`${langPrefix() || '/'}`} class="hover:text-main hover:underline">
				{$pageTranslations?.t('products.home') || 'Home'}
			</a>
			<span class="mx-2">/</span>
			<span aria-current="page" class="font-medium text-gray-700">
				{$pageTranslations?.t('header.navigation.shop') || 'Shop'}
			</span>
		</nav>

		<h1 class="mb-2 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
			{$pageTranslations?.t('products.shop_title') || 'Golden paste jars for dogs'}
		</h1>
		<p class="mb-6 text-lg text-gray-600">
			{$pageTranslations?.t('products.shop_subtitle') ||
				'TRIAL to taste · MONTH to save. About 60 mg curcuminoids per teaspoon.'}
		</p>

		{#if data.error}
			<div class="py-12 text-center">
				<div class="mb-4 text-red-600">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Something went wrong</h3>
				<p class="text-gray-600">{data.error}</p>
			</div>
		{:else}
			<!-- Search and Filter Component -->
			<ProductSearch
				searchTerm={data.searchTerm}
				selectedCategory={data.category}
				selectedSize={data.size}
				selectedFlavor={data.flavor}
				minPrice={data.minPrice === null ? null : undefined}
				maxPrice={data.maxPrice === null ? null : undefined}
				categories={data.categories}
				sizes={data.sizes}
				flavors={data.flavors}
				on:search={handleSearch}
				on:reset={handleReset}
			/>

			<!-- Active filter chips -->
			{#if hasFilters}
				<div class="mb-4 flex flex-wrap items-center gap-2" aria-live="polite">
					{#each activeFilters as filter (filter.key)}
						<button
							type="button"
							onclick={() => removeFilter(filter.key)}
							class="inline-flex items-center gap-1.5 rounded-full bg-main px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#b25f0e]"
							aria-label={`Remove filter ${filter.label}`}
						>
							{filter.label}
							<span aria-hidden="true" class="text-base leading-none">×</span>
						</button>
					{/each}
					<button
						type="button"
						onclick={handleReset}
						class="text-sm font-medium text-gray-500 underline hover:text-gray-700"
					>
						{$pageTranslations?.t('products.reset_filters') || 'Reset'}
					</button>
				</div>
			{/if}

			<!-- Results Info -->
			<div class="mb-6">
				<p class="text-gray-600">
					{#if data.searchTerm || data.category || data.size || data.flavor || data.minPrice !== null || data.maxPrice !== null}
						{#if data.searchTerm}
							{$pageTranslations?.t('products.search.found_results', {
								count: data.totalProducts,
								query: data.searchTerm,
								total: data.allProductsCount
							}) || `Found ${data.totalProducts} products for "${data.searchTerm}"`}
						{:else}
							{$pageTranslations?.t('products.search.results_info', {
								count: data.totalProducts,
								total: data.allProductsCount
							}) || `Showing ${data.totalProducts} of ${data.allProductsCount} products`}
						{/if}
					{:else}
						{$pageTranslations?.t('products.search.results_info', {
							count: data.totalProducts,
							total: data.allProductsCount
						}) || `Showing ${data.totalProducts} of ${data.allProductsCount} products`}
					{/if}
				</p>
			</div>

			{#if data.products && data.products.length > 0}
				<!-- Products Grid: same 4-across grid + cards as homepage -->
				<ProductGrid
					products={data.products}
					columns={4}
					gap="gap-6"
					cardClassName="bg-white border border-[#efe0c3] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full"
				/>
			{:else}
				<!-- Empty State -->
				<div class="py-12 text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">
						{$pageTranslations?.t('products.no_products_found')}
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						{$pageTranslations?.t('products.try_different_filters')}
					</p>
					<div class="mt-6">
						<button
							onclick={handleReset}
							class="inline-flex items-center rounded-md border border-transparent bg-main px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#b25f0e] focus:ring-2 focus:ring-main focus:ring-offset-2 focus:outline-none"
						>
							{$pageTranslations?.t('products.reset_filters')}
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	/* Prevent horizontal scrolling */
	:global(body) {
		overflow-x: hidden;
		max-width: 100vw;
	}
</style>
