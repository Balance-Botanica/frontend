<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function handleAddToCart(event: CustomEvent<{ productId: string; product: any }>) {
		console.log('Add to cart:', event.detail);
		// TODO: Implement add to cart functionality
	}

	function handleImageClick(event: CustomEvent<{ productId: string; imageUrl: string; index: number }>) {
		console.log('Image clicked:', event.detail);
		// TODO: Implement image click functionality (e.g., open modal)
	}
</script>

<svelte:head>
	<title>Products - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Products</h1>
					<p class="mt-1 text-sm text-gray-500">
						Manage your product catalog
					</p>
				</div>
				<a
					href="/demo/products/add"
					class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Add Product
				</a>
			</div>
		</div>
	</div>

	<!-- Products Grid -->
	<div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{#if data.products && data.products.length > 0}
		<div class="products-grid grid gap-6">
			{#each data.products as product}
				{console.log('🎯 Rendering product:', product)}
				<ProductCard
					{product}
					showRating={true}
					showBestsellerBadge={true}
					showCategoryTags={true}
					showDescription={true}
					showAddToCart={true}
					on:addToCart={handleAddToCart}
					on:imageClick={handleImageClick}
				/>
			{/each}
		</div>
		{:else}
			<div class="text-center py-12">
				<div class="text-gray-400 mb-4">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
				<p class="text-gray-500 mb-6">Get started by adding your first product to the catalog.</p>
				<a
					href="/demo/products/add"
					class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Add Product
				</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.products-grid {
		grid-template-columns: repeat(auto-fit, minmax(300px, 450px));
		max-width: 100%;
		justify-content: center;
	}

	/* На экранах больше 1400px - используем больше места */
	@media (min-width: 1400px) {
		.products-grid {
			grid-template-columns: repeat(auto-fit, minmax(300px, 500px));
		}
	}

	/* На экранах больше 1600px - еще больше места */
	@media (min-width: 1600px) {
		.products-grid {
			grid-template-columns: repeat(auto-fit, minmax(300px, 550px));
		}
	}

	/* На экранах меньше 700px - 2x2 сетка */
	@media (max-width: 700px) {
		.products-grid {
			grid-template-columns: repeat(2, minmax(300px, 1fr));
			justify-content: center;
		}
	}

	/* На совсем маленьких экранах - 1 колонка */
	@media (max-width: 650px) {
		.products-grid {
			grid-template-columns: minmax(300px, 1fr);
			justify-content: center;
		}
	}
</style>
