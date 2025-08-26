<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import ProductSearch from '$lib/components/ProductSearch.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';

	const { data }: { data: PageData } = $props();
	
	// Create page translations
	const pageTranslations = createPageTranslations();

	// Handle search event
	function handleSearch(event: CustomEvent) {
		const { searchTerm, category, size, flavor, minPrice, maxPrice } = event.detail;
		
		// Build query parameters
		const params = new URLSearchParams();
		if (data.category) params.set('category', data.category);
		if (searchTerm) params.set('search', searchTerm);
		if (size) params.set('size', size);
		if (flavor) params.set('flavor', flavor);
		if (minPrice !== null) params.set('minPrice', minPrice.toString());
		if (maxPrice !== null) params.set('maxPrice', maxPrice.toString());
		
		// Navigate to the same page with new query parameters
		goto(`/categories?${params.toString()}`);
	}

	// Handle reset event
	function handleReset() {
		// Navigate to the base categories page with category parameter
		if (data.category) {
			goto(`/categories?category=${data.category}`);
		} else {
			goto('/categories');
		}
	}

	// Handle category change
	function handleCategoryChange(category: string) {
		// Navigate to the categories page with selected category
		if (category) {
			goto(`/categories?category=${category}`);
		} else {
			goto('/categories');
		}
	}
</script>

<!-- Fixed block closing issue -->
{#if $pageTranslations}
<SEO
	title={$pageTranslations.t('products.meta.title')}
	description={$pageTranslations.t('products.meta.description')}
	locale={$pageTranslations.locale}
/>

<div class="min-h-screen bg-gray-50">
	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
			<!-- Category Navigation -->
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900 mb-4">
					{#if data.category}
						{data.category}
					{:else}
						{$pageTranslations.t('products.search.title')}
					{/if}
				</h1>
				
				<!-- Category Filter Chips -->
				<div class="flex flex-wrap gap-2 mb-6">
					<button
						on:click={() => handleCategoryChange('')}
						class:active={data.category === ''}
						class="px-4 py-2 rounded-full text-sm font-medium transition-colors {data.category === '' ? 'bg-[#4b766e] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
					>
						{$pageTranslations.t('products.search.all_categories')}
					</button>
					
					{#each data.categories as cat}
						<button
							on:click={() => handleCategoryChange(cat)}
							class:active={data.category === cat}
							class="px-4 py-2 rounded-full text-sm font-medium transition-colors {data.category === cat ? 'bg-[#4b766e] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
						>
							{cat}
						</button>
					{/each}
				</div>
			</div>

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
					{#if data.searchTerm || data.size || data.flavor || data.minPrice !== null || data.maxPrice !== null}
						{$pageTranslations.t('products.search.results_info', { count: data.totalProducts, total: data.allProductsCount })}
					{:else}
						{$pageTranslations.t('products.search.results_info', { count: data.totalProducts, total: data.totalProducts })}
					{/if}
				</p>
			</div>

			{#if data.products && data.products.length > 0}
				<!-- Products Grid using ProductCard component -->
				<div class="products-grid-container">
					<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
						{#each data.products as product (product.id)}
							<ProductCard {product} />
						{/each}
					</div>
				</div>
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
					<h3 class="mt-2 text-sm font-medium text-gray-900">{$pageTranslations.t('products.no_products_found')}</h3>
					<p class="mt-1 text-sm text-gray-500">
						{$pageTranslations.t('products.try_different_filters')}
					</p>
					<div class="mt-6">
						<button
							on:click={handleReset}
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#4b766e] hover:bg-[#3d5f58] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b766e]"
						>
							{$pageTranslations.t('products.reset_filters')}
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
{/if}

<style>
	.products-grid-container {
		max-width: 1400px;
		margin: 0 auto;
	}

	/* Ensure grid items don't get too wide on very large screens */
	@media (min-width: 1920px) {
		.products-grid-container {
			max-width: 1200px;
		}
	}

	@media (min-width: 2560px) {
		.products-grid-container {
			max-width: 1400px;
		}
	}
</style>