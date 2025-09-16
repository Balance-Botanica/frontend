<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { RawProduct } from '$lib/types/product.types';

	// Products to display
	export let products: RawProduct[] = [];

	// Grid layout options
	export let columns: number = 4; // Default to 4 columns
	export let gap: string = 'gap-6'; // Default gap between items
	export let cardClassName: string = ''; // Additional classes for product cards
	export let gridClassName: string = ''; // Additional classes for the grid container

	// Product card display options (passed through to ProductCard)
	export let showRating: boolean = true;
	export let showBestsellerBadge: boolean = true;
	export let showCategoryTags: boolean = true;
	export let showDescription: boolean = true;
	export let showAddToCart: boolean = true;

	// Sorting options
	export let sortBy: 'name' | 'price' | 'createdAt' | 'popularity' | null = null;
	export let sortOrder: 'asc' | 'desc' = 'asc';

	// Filtering options
	export let filterByCategory: string | null = null;
	export let filterByAvailability: boolean | null = null;

	// Pagination options
	export let enablePagination: boolean = false;
	export let itemsPerPage: number = 12;
	export let currentPage: number = 1;

	// Touch handling for swipe gestures
	let touchStartX = 0;
	let touchEndX = 0;
	let containerRef: HTMLDivElement | null = null;

	// Computed values
	$: gridColumns = `grid-cols-${columns}`;
	$: gridGap = gap;

	// Validation
	$: if (columns < 1 || columns > 6) {
		console.warn(
			`ProductGrid: columns should be between 1 and 6, got ${columns}. Using default of 4.`
		);
		columns = 4;
	}

	// Processed products with sorting and filtering
	$: processedProducts = (() => {
		let result = [...products];

		// Apply filtering
		if (filterByCategory) {
			result = result.filter((product) => {
				if (!product.categories) return false;
				try {
					const categories = JSON.parse(product.categories);
					return Array.isArray(categories) && categories.includes(filterByCategory);
				} catch {
					return false;
				}
			});
		}

		if (filterByAvailability !== null) {
			result = result.filter((product) =>
				filterByAvailability ? product.stock > 0 : product.stock === 0
			);
		}

		// Apply sorting
		if (sortBy) {
			result.sort((a, b) => {
				let comparison = 0;

				switch (sortBy) {
					case 'name':
						comparison = a.name.localeCompare(b.name);
						break;
					case 'price':
						comparison = a.price - b.price;
						break;
					case 'createdAt': {
						const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
						const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
						comparison = dateA - dateB;
						break;
					}
					case 'popularity': {
						// For now, we'll sort by stock as a proxy for popularity
						comparison = a.stock - b.stock;
						break;
					}
				}

				return sortOrder === 'asc' ? comparison : -comparison;
			});
		}

		// Apply pagination
		if (enablePagination) {
			const startIndex = (currentPage - 1) * itemsPerPage;
			const endIndex = startIndex + itemsPerPage;
			result = result.slice(startIndex, endIndex);
		}

		return result;
	})();

	// Total pages for pagination
	$: totalPages = enablePagination ? Math.ceil(products.length / itemsPerPage) : 0;

	// Pagination controls
	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	// Touch handling for swipe gestures
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.changedTouches[0].screenX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}

	function handleSwipe() {
		const swipeThreshold = 50; // Minimum distance for swipe
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swipe left - next page
				nextPage();
			} else {
				// Swipe right - previous page
				prevPage();
			}
		}
	}
</script>

<div
	class={`grid ${gridGap} ${gridClassName}`}
	bind:this={containerRef}
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
>
	{#each processedProducts as product, index (product.id)}
		<ProductCard
			{product}
			{showRating}
			{showBestsellerBadge}
			{showCategoryTags}
			{showDescription}
			{showAddToCart}
			className={cardClassName}
			productIndex={index}
		/>
	{/each}
</div>

{#if enablePagination && totalPages > 1}
	<div class="mt-8 flex items-center justify-center gap-2">
		<button
			class="touch-button rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={prevPage}
			disabled={currentPage === 1}
		>
			Previous
		</button>

		{#each Array(totalPages) as _, i}
			<button
				class={`touch-button rounded-lg px-4 py-2 ${i + 1 === currentPage ? 'bg-green-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
				on:click={() => goToPage(i + 1)}
			>
				{i + 1}
			</button>
		{/each}

		<button
			class="touch-button rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={nextPage}
			disabled={currentPage === totalPages}
		>
			Next
		</button>
	</div>
{/if}

<style>
	/* Responsive grid adjustments */
	@media (max-width: 767px) {
		.grid {
			grid-template-columns: 1fr;
			gap: 1rem;
			width: 100%;
			max-width: 100%;
			overflow-x: hidden;
		}
	}

	@media (min-width: 640px) and (max-width: 767px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.25rem;
		}
	}

	@media (min-width: 768px) {
		/* Desktop grid - default 3 columns */
		.grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}

		/* For different column counts */
		.grid-cols-1 {
			grid-template-columns: repeat(1, 1fr);
		}
		.grid-cols-2 {
			grid-template-columns: repeat(2, 1fr);
		}
		.grid-cols-3 {
			grid-template-columns: repeat(3, 1fr);
		}
		.grid-cols-4 {
			grid-template-columns: repeat(4, 1fr);
		}
		.grid-cols-5 {
			grid-template-columns: repeat(5, 1fr);
		}
		.grid-cols-6 {
			grid-template-columns: repeat(6, 1fr);
		}

		/* Gap utilities */
		.gap-0 {
			gap: 0;
		}
		.gap-1 {
			gap: 0.25rem;
		}
		.gap-2 {
			gap: 0.5rem;
		}
		.gap-3 {
			gap: 0.75rem;
		}
		.gap-4 {
			gap: 1rem;
		}
		.gap-5 {
			gap: 1.25rem;
		}
		.gap-6 {
			gap: 1.5rem;
		}
		.gap-8 {
			gap: 2rem;
		}
		.gap-10 {
			gap: 2.5rem;
		}
		.gap-12 {
			gap: 3rem;
		}
	}

	/* Touch-friendly buttons for mobile */
	@media (max-width: 767px) {
		.touch-button {
			min-height: 44px;
			min-width: 44px;
			padding: 0.5rem 1rem;
			border-radius: 8px;
			font-weight: 500;
			transition: all 0.2s ease;
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			text-align: center;
		}

		.touch-button:active {
			transform: scale(0.98);
		}
	}

	/* Desktop styles */
	@media (min-width: 768px) {
		.touch-button {
			/* Reset touch-specific styles for desktop */
			min-height: auto;
			min-width: auto;
			transform: none;
		}

		.touch-button:active {
			transform: none;
		}
	}
</style>
