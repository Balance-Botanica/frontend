<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';

	export interface UiProduct {
		id: string;
		name: string;
		description?: string | null;
		price: number;
		stock: number;
		size: string;
		flavor: string;
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
		? (typeof limit === 'number' && limit > 0 ? products.slice(0, limit) : products)
		: [];
</script>

<section class="py-16 px-4">
	<div class="max-w-screen-2xl mx-auto">
		{#if title}
			<h2 class="text-4xl font-bold text-center text-gray-900 mb-12">{title}</h2>
		{/if}

		{#if displayProducts.length > 0}
			<div class="grid gap-6" style="grid-template-columns: repeat(auto-fit, minmax(300px, 450px)); justify-content: center;">
				{#each displayProducts as product}
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
