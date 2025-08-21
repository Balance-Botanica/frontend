<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	export interface UiProduct {
		id: string;
		name: string;
		description?: string | null;
		price: number;
		stock: number;
		size?: string;
		flavor?: string;
		categories?: string | null;
		imageUrls?: string | null;
		createdAt?: Date;
		updatedAt?: Date;
	}

	export let products: UiProduct[] = [];
	export let title: string = 'Наші товари';
	// Optional limit of items to render; if undefined/null, render all
	export let limit: number | null | undefined = null;

	// Pass-through flags to `ProductCard`
	export let showRating: boolean = true;
	export let showBestsellerBadge: boolean = true;
	export let showCategoryTags: boolean = true;
	export let showDescription: boolean = true;
	export let showAddToCart: boolean = true;

	$: displayProducts = Array.isArray(products)
		? typeof limit === 'number' && limit > 0
			? products.slice(0, limit)
			: products
		: [];
</script>

<section class="px-4 py-16">
	<div class="mx-auto max-w-screen-2xl">
		{#if title}
			<h2 class="mb-12 text-center text-4xl font-bold text-gray-900">{title}</h2>
		{/if}

		{#if displayProducts.length > 0}
			<div class="products-grid">
				{#each displayProducts as product, _index (product.id)}
					<ProductCard
						{product}
						{showRating}
						{showBestsellerBadge}
						{showCategoryTags}
						{showDescription}
						{showAddToCart}
					/>
				{/each}
			</div>
		{:else}
			<p class="text-center text-gray-500">Товари скоро з'являться.</p>
		{/if}
	</div>
</section>

<style>
	.products-grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		justify-items: stretch;
	}

	/* Responsive grid adjustments */
	@media (min-width: 640px) {
		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		}
	}

	@media (min-width: 1280px) {
		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		}
	}

	@media (min-width: 1536px) {
		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		}
	}
</style>
