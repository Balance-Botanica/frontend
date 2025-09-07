<script lang="ts">
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import type { RawProduct } from '$lib/types/product.types';
	import { createPageTranslations } from '$lib/i18n/store';

	export let products: RawProduct[] = [];
	export let title: string = 'Наші товари';
	export let translations: any = null;
	// Optional limit of items to render; if undefined/null, render all
	export let limit: number | null | undefined = null;

	// Pass-through flags to `ProductCard`
	export let showRating: boolean = true;
	export let showBestsellerBadge: boolean = true;
	export let showCategoryTags: boolean = true;
	export let showDescription: boolean = true;
	export let showAddToCart: boolean = true;

	// Grid configuration
	export let columns: number = 4;
	export let gap: string = 'gap-6';
	export let cardClassName: string = '';

	$: displayProducts = Array.isArray(products)
		? typeof limit === 'number' && limit > 0
			? products.slice(0, limit)
			: products
		: [];

	// Use provided translations or fallback to global translations
	$: pageTranslations = translations && typeof translations.subscribe === 'function'
		? translations
		: createPageTranslations();

</script>

<div id="products" class="w-full bg-white px-4 py-16 sm:px-6 lg:px-8">
	<div class="w-full">
		{#if title}
			<div class="mb-12 flex items-center justify-between">
				<h2 class="text-4xl font-bold text-gray-900">{title}</h2>
				
				<!-- Navigation Controls -->
				<div class="flex items-center gap-4">
					<!-- Removed "Уся продукція" button -->
				</div>
			</div>
		{/if}

		{#if displayProducts.length > 0}
			<!-- Debug info -->
			<div class="mb-4 text-center text-sm text-gray-500">
				{#if $pageTranslations?.t}
					{$pageTranslations.t('products.search.results_info', {
						count: displayProducts.length,
						total: displayProducts.length
					})}
				{:else}
					Showing {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
				{/if}
			</div>
			
			<!-- Product Grid -->
			<ProductGrid 
				products={displayProducts}
				{columns}
				{gap}
				{cardClassName}
				{showRating}
				{showBestsellerBadge}
				{showCategoryTags}
				{showDescription}
				{showAddToCart}
			/>
		{:else}
			<p class="text-center text-gray-500 mt-8">Товари скоро з'являться.</p>
		{/if}
	</div>
</div>

<style>
	/* Removed the media query for small screens padding */
</style>