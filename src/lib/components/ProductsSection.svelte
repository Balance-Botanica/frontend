<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { onMount, onDestroy } from 'svelte';

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

	// Debug logging
	console.log('🔍 ProductsSection received products:', products);
	console.log('📊 Products count:', products?.length || 0);
	console.log('📋 First product:', products?.[0]);
	
	// Log each product's image details
	$: if (products) {
		console.log('\n🔄 ProductsSection products update:');
		products.forEach((product, index) => {
			console.log(`\n📸 Product ${index + 1} in ProductsSection:`);
			console.log('  Name:', product.name);
			console.log('  ImageUrls:', product.imageUrls);
			
			if (product.imageUrls) {
				try {
					const parsed = JSON.parse(product.imageUrls);
					console.log('  Parsed ImageUrls:', parsed);
					console.log('  Image count:', Array.isArray(parsed) ? parsed.length : 'Not array');
					console.log('  Will show slider:', Array.isArray(parsed) && parsed.length > 1);
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					console.log('  ❌ Failed to parse imageUrls:', errorMessage);
				}
			} else {
				console.log('  ❌ No imageUrls field');
			}
		});
	}

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
	
	$: {
		console.log('🔄 displayProducts updated:');
		console.log('  Products count:', products?.length || 0);
		console.log('  Limit:', limit);
		console.log('  Display products count:', displayProducts.length);
		console.log('  First display product:', displayProducts[0]?.name);
		
		// Log each product's image details
		displayProducts.forEach((product, index) => {
			console.log(`\n📸 Product ${index + 1} in displayProducts:`);
			console.log('  Name:', product.name);
			console.log('  ImageUrls:', product.imageUrls);
			
			if (product.imageUrls) {
				try {
					const parsed = JSON.parse(product.imageUrls);
					console.log('  Parsed ImageUrls:', parsed);
					console.log('  Image count:', Array.isArray(parsed) ? parsed.length : 'Not array');
					console.log('  Will show slider:', Array.isArray(parsed) && parsed.length > 1);
				} catch (error: unknown) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					console.log('  ❌ Failed to parse imageUrls:', errorMessage);
				}
			} else {
				console.log('  ❌ No imageUrls field');
			}
		});
	}

	// Slider navigation state
	let currentIndex = 0;
	let containerRef: HTMLDivElement;
	let visibleProducts = 1;
	let touchStartX = 0;
	let touchEndX = 0;
	
	// Track currentIndex changes
	$: {
		console.log('🎠 currentIndex changed:', currentIndex);
		console.log('  Max index:', Math.max(0, displayProducts.length - visibleProducts));
		console.log('  Can go prev:', currentIndex > 0);
		console.log('  Can go next:', currentIndex < Math.max(0, displayProducts.length - visibleProducts));
	}
	
	// Track visibleProducts changes
	$: {
		console.log('👁️ visibleProducts changed:', visibleProducts);
		console.log('  Products count:', displayProducts.length);
		console.log('  Max index:', Math.max(0, displayProducts.length - visibleProducts));
		console.log('  Current index:', currentIndex);
	}

	const handlePrevClick = () => {
		console.log('⬅️ Previous button clicked');
		console.log('  Current index:', currentIndex);
		if (currentIndex > 0) {
			currentIndex--;
			console.log('  ✅ Moved to index:', currentIndex);
		} else {
			console.log('  ❌ Already at first index');
		}
	};

	const handleNextClick = () => {
		console.log('➡️ Next button clicked');
		const maxIndex = Math.max(0, displayProducts.length - visibleProducts);
		console.log('  Current index:', currentIndex);
		console.log('  Max index:', maxIndex);
		if (currentIndex < maxIndex) {
			currentIndex++;
			console.log('  ✅ Moved to index:', currentIndex);
		} else {
			console.log('  ❌ Already at last index');
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		console.log('⌨️ Key pressed:', event.key);
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			console.log('  ⬅️ Left arrow, going to previous');
			handlePrevClick();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			console.log('  ➡️ Right arrow, going to next');
			handleNextClick();
		}
	};

	const handleTouchStart = (event: TouchEvent) => {
		touchStartX = event.touches[0].clientX;
		console.log('👆 Touch start:', touchStartX);
	};

	const handleTouchEnd = (event: TouchEvent) => {
		touchEndX = event.changedTouches[0].clientX;
		console.log('👆 Touch end:', touchEndX);
		handleSwipe();
	};

	const handleSwipe = () => {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;
		
		console.log('👆 Swipe detected:');
		console.log('  Touch start X:', touchStartX);
		console.log('  Touch end X:', touchEndX);
		console.log('  Difference:', diff);
		console.log('  Threshold:', swipeThreshold);

		if (Math.abs(diff) > swipeThreshold) {
			if (diff > 0) {
				// Swiped left - go to next
				console.log('  ➡️ Swiped left, going to next');
				handleNextClick();
			} else {
				// Swiped right - go to previous
				console.log('  ⬅️ Swiped right, going to previous');
				handlePrevClick();
			}
		} else {
			console.log('  ❌ Swipe too small, ignoring');
		}
	};

	const getVisibleProducts = () => {
		// Determine how many products are visible based on screen width
		if (typeof window !== 'undefined') {
			const width = window.innerWidth;
			console.log('📱 Screen width:', width);
			
			if (width >= 1920) {
				console.log('  🖥️ Wide screen: 3 products per row');
				return 3; // 3 products per row on wide screens
			}
			if (width >= 1280) {
				console.log('  🖥️ Large screen: 3 products per row');
				return 3; // 3 products per row on large screens
			}
			if (width >= 1024) {
				console.log('  🖥️ Medium screen: 2 products per row');
				return 2; // 2 products per row on medium screens
			}
		}
		console.log('  📱 Default: 1 product per row');
		return 1; // 1 product per row on small screens
	};

	const handleResize = () => {
		const newVisibleProducts = getVisibleProducts();
		console.log('🔄 Resize event:');
		console.log('  Old visible products:', visibleProducts);
		console.log('  New visible products:', newVisibleProducts);
		
		if (newVisibleProducts !== visibleProducts) {
			console.log('  📱 Updating visible products');
			visibleProducts = newVisibleProducts;
			// Reset to first page when screen size changes
			currentIndex = 0;
		}
	};

	// Update current index when products change
	$: if (displayProducts.length > 0) {
		console.log('🔄 Resetting currentIndex to 0');
		currentIndex = 0;
	}

	onMount(() => {
		console.log('🎠 ProductsSection onMount:');
		console.log('  Products count:', displayProducts.length);
		console.log('  Visible products:', getVisibleProducts());
		console.log('  Window width:', typeof window !== 'undefined' ? window.innerWidth : 'N/A');
		
		visibleProducts = getVisibleProducts();
		window.addEventListener('resize', handleResize);
		// Add keyboard navigation
		document.addEventListener('keydown', handleKeyDown);
		
		console.log('  ✅ Event listeners added');
		console.log('  ✅ Initial visibleProducts:', visibleProducts);
	});

	onDestroy(() => {
		console.log('🗑️ ProductsSection onDestroy:');
		console.log('  Removing event listeners');
		window.removeEventListener('resize', handleResize);
		document.removeEventListener('keydown', handleKeyDown);
		console.log('  ✅ Event listeners removed');
	});
</script>

<section class="px-4 py-16">
	<div class="mx-auto max-w-screen-2xl">
		{#if title}
			<div class="mb-12 flex items-center justify-between">
				<h2 class="text-4xl font-bold text-gray-900">{title}</h2>
				
				<!-- Navigation Controls -->
				<div class="flex items-center gap-4">
					<a 
						href="/products" 
						class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
					>
						Уся продукція
					</a>
					
					<button
						class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						on:click={handlePrevClick}
						disabled={currentIndex === 0}
						aria-label="Previous products"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					
					<button
						class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						on:click={handleNextClick}
						disabled={currentIndex >= Math.max(0, displayProducts.length - visibleProducts)}
						aria-label="Next products"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		{/if}

		{#if displayProducts.length > 0}
			<!-- Debug info -->
			<div class="mb-4 text-center text-sm text-gray-500">
				Showing {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
			</div>
			
			<div 
				class="products-container" 
				bind:this={containerRef}
				on:touchstart={handleTouchStart}
				on:touchend={handleTouchEnd}
			>
				<div 
					class="products-grid"
					style="transform: translateX(-{currentIndex * (100 / visibleProducts)}%)"
				>
					{#each displayProducts as product (product.id)}
						<div class="product-item">
							<ProductCard
								{product}
								{showRating}
								{showBestsellerBadge}
								{showCategoryTags}
								{showDescription}
								{showAddToCart}
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- Pagination Dots -->
			{#if displayProducts.length > visibleProducts}
				<div class="mt-8 flex justify-center">
					<div class="flex gap-2">
						{#each Array(Math.ceil(displayProducts.length / visibleProducts)) as _, index}
							<button
								class="h-2 w-2 rounded-full transition-colors {index === currentIndex ? 'bg-green-600' : 'bg-gray-300'}"
								on:click={() => currentIndex = index}
								aria-label="Go to page {index + 1}"
							/>
						{/each}
					</div>
				</div>
			{/if}
		{:else}
			<p class="text-center text-gray-500 mt-8">Товари скоро з'являться.</p>
		{/if}
	</div>
</section>

<style>
	.products-container {
		overflow: hidden;
		width: 100%;
		user-select: none;
		touch-action: pan-y pinch-zoom;
	}

	.products-grid {
		display: flex;
		gap: 2rem;
		transition: transform 0.3s ease-in-out;
		width: max-content;
	}

	.product-item {
		flex-shrink: 0;
		width: calc((100vw - 2rem) / 1); /* Default: 1 product per row */
		max-width: 400px;
		user-select: text; /* Allow text selection within product cards */
	}

	/* Responsive grid adjustments */
	@media (min-width: 640px) {
		.product-item {
			width: calc((100vw - 4rem) / 2); /* 2 products per row */
			max-width: 350px;
		}
	}

	@media (min-width: 1024px) {
		.product-item {
			width: calc((100vw - 6rem) / 3); /* 3 products per row */
			max-width: 320px;
		}
	}

	@media (min-width: 1280px) {
		.product-item {
			width: calc((100vw - 8rem) / 3); /* 3 products per row */
			max-width: 350px;
		}
	}

	@media (min-width: 1536px) {
		.product-item {
			width: calc((100vw - 10rem) / 3); /* 3 products per row */
			max-width: 380px;
		}
	}

	@media (min-width: 1920px) {
		.product-item {
			width: calc((100vw - 12rem) / 3); /* 3 products per row on wide screens */
			max-width: 400px;
		}
	}

	/* Ensure container doesn't exceed viewport */
	@media (min-width: 1920px) {
		.products-container {
			max-width: calc(100vw - 300px); /* Account for padding and margins */
		}
	}

	/* Additional breakpoint for ultra-wide screens */
	@media (min-width: 2560px) {
		.product-item {
			width: calc((100vw - 16rem) / 3); /* 3 products per row on ultra-wide screens */
			max-width: 450px;
		}
		
		.products-container {
			max-width: calc(100vw - 400px);
		}
	}
</style>
