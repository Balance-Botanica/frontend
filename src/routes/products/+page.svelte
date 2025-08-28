<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import ProductSearch from '$lib/components/ProductSearch.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';

	const { data }: { data: PageData } = $props();
	
	// Create page translations
	const pageTranslations = createPageTranslations();

	// Handle search event
	function handleSearch(event: CustomEvent) {
		console.log('ProductsPage: handleSearch event received', event.detail);
		const { searchTerm, category, size, flavor, minPrice, maxPrice } = event.detail;
		
		// Build query parameters
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (category) params.set('category', category);
		if (size) params.set('size', size);
		if (flavor) params.set('flavor', flavor);
		if (minPrice !== null) params.set('minPrice', minPrice.toString());
		if (maxPrice !== null) params.set('maxPrice', maxPrice.toString());
		
		const url = `/products?${params.toString()}`;
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
		title={$pageTranslations.t('products.meta.title')}
		description={$pageTranslations.t('products.meta.description')}
		locale={$pageTranslations.locale}
	/>
{/if}

<div class="min-h-screen bg-gray-50 overflow-x-hidden">
	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-3 sm:px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
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
				minPrice={data.minPrice}
				maxPrice={data.maxPrice}
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
						{#if $pageTranslations?.locale === 'uk-ua'}
							{#if data.searchTerm}
								Знайдено {data.totalProducts} {data.totalProducts === 1 ? 'продукт' : data.totalProducts < 5 ? 'продукти' : 'продуктів'} за запитом "{data.searchTerm}"
							{:else}
								Показано {data.totalProducts} з {data.allProductsCount} продуктів
							{/if}
						{:else}
							{#if data.searchTerm}
								Found {data.totalProducts} {data.totalProducts === 1 ? 'product' : 'products'} for "{data.searchTerm}"
							{:else}
								{$pageTranslations?.t('products.search.results_info', { count: data.totalProducts, total: data.allProductsCount })}
							{/if}
						{/if}
					{:else}
						{#if $pageTranslations?.locale === 'uk-ua'}
							Показано {data.totalProducts} {data.totalProducts === 1 ? 'продукт' : data.totalProducts < 5 ? 'продукти' : 'продуктів'}
						{:else}
							{$pageTranslations?.t('products.search.results_info', { count: data.totalProducts, total: data.totalProducts })}
						{/if}
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
					<h3 class="mt-2 text-sm font-medium text-gray-900">{$pageTranslations?.t('products.no_products_found')}</h3>
					<p class="mt-1 text-sm text-gray-500">
						{$pageTranslations?.t('products.try_different_filters')}
					</p>
					<div class="mt-6">
						<button
							on:click={handleReset}
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4b766e] hover:bg-[#3d5f58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b766e]"
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