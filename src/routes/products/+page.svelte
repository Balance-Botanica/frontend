<script lang="ts">
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Products - Balance Botanica</title>
	<meta name="description" content="Browse our premium CBD products for wellness and relaxation" />
</svelte:head>

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
		{:else if data.products && data.products.length > 0}
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
				<h3 class="mt-2 text-sm font-medium text-gray-900">No products available</h3>
				<p class="mt-1 text-sm text-gray-500">
					We're working on adding amazing products. Check back soon!
				</p>
			</div>
		{/if}
	</div>
</div>

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
