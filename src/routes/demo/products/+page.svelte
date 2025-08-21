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

	function handleImageClick(
		event: CustomEvent<{ productId: string; imageUrl: string; index: number }>
	) {
		console.log('Image clicked:', event.detail);
		// TODO: Implement image click functionality (e.g., open modal)
	}
</script>

<svelte:head>
	<title>Products - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="border-b bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-2 py-6 sm:px-4 lg:px-6">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Products</h1>
					<p class="mt-1 text-sm text-gray-500">Manage your product catalog</p>
				</div>
				<a
					href="/demo/products/add"
					class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Add Product
				</a>
			</div>
		</div>
	</div>

	<!-- Products Grid -->
	<div class="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
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
			<div class="py-12 text-center">
				<div class="mb-4 text-gray-400">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">No products yet</h3>
				<p class="mb-6 text-gray-500">Get started by adding your first product to the catalog.</p>
				<a
					href="/demo/products/add"
					class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
