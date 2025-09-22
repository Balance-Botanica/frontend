<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ProductSearch from '$lib/components/ProductSearch.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import type { SupportedLocale } from '$lib/i18n/types';

	const { data }: { data: PageData } = $props();

	// Use global translations (reactive to language changes)
	const pageTranslations = createPageTranslations();

	// Handle search event
	function handleSearch(event: CustomEvent) {
		console.log('ProductsPage: handleSearch event received', event.detail);
		const { searchTerm, category, size, flavor, minPrice, maxPrice } = event.detail;

		// Build query parameters
		const queryParams: string[] = [];
		if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);
		if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
		if (size) queryParams.push(`size=${encodeURIComponent(size)}`);
		if (flavor) queryParams.push(`flavor=${encodeURIComponent(flavor)}`);
		if (minPrice !== null) queryParams.push(`minPrice=${minPrice}`);
		if (maxPrice !== null) queryParams.push(`maxPrice=${maxPrice}`);

		// Include language parameter in navigation
		const currentLang = $page.params.lang || 'uk';
		const langPrefix = currentLang === 'uk' ? '' : `/${currentLang}`;
		const queryString = queryParams.join('&');
		const url = `${langPrefix}/products${queryString ? '?' + queryString : ''}`;
		console.log('ProductsPage: Navigating to URL:', url);

		// Navigate to the same page with new query parameters
		goto(url);
	}

	// Handle reset event
	function handleReset() {
		console.log('ProductsPage: handleReset called');
		// Navigate to the base products page without query parameters
		goto('/products');
	}
</script>

{#if $pageTranslations}
<SEO
		title={String($pageTranslations.t('products.meta.title'))}
		description={String($pageTranslations.t('products.meta.description'))}
		currentPath={$page.url.pathname}
/>
{/if}

<div class="min-h-screen overflow-x-hidden bg-gray-50">
	<!-- Main Content -->
	<div class="mx-auto max-w-7xl overflow-x-hidden px-3 py-8 sm:px-4 sm:px-6 lg:px-8">
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
				<!-- Products Grid using ProductGrid component -->
				<ProductGrid
					products={data.products}
					columns={3}
					gap="gap-6"
					cardClassName="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full"
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
							on:click={handleReset}
							class="inline-flex items-center rounded-md border border-transparent bg-[#4b766e] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3d5f58] focus:ring-2 focus:ring-[#4b766e] focus:ring-offset-2 focus:outline-none"
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

	/* Add any additional styling here if needed */
</style>
