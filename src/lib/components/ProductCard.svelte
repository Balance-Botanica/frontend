<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { cartStore } from '$lib/stores/cart.store';
	import { notificationStore } from '$lib/stores/notifications';
	import { createClientProduct, type RawProduct } from '$lib/types/product.types';

	// Helper function to parse image URLs
	function parseImageUrls(imageUrlsString: string | null): string[] {
		if (!imageUrlsString) return [];

		// console.log('🔧 Parsing imageUrlsString:', imageUrlsString);

		try {
			// First try to parse as JSON
			const parsed = JSON.parse(imageUrlsString);
			// console.log('✅ Successfully parsed as JSON:', parsed);

			if (Array.isArray(parsed)) {
				const filtered = parsed.filter((url) => typeof url === 'string' && url.trim() !== '');
				// console.log('✅ Filtered array result:', filtered);
				return filtered;
			} else {
				// console.warn('⚠️ Parsed result is not an array:', parsed);
				return [];
			}
		} catch (jsonError) {
			// console.log('❌ JSON parse failed, trying comma-separated:', jsonError);

			// If JSON fails, try comma-separated string
			try {
				const urls = imageUrlsString
					.split(',')
					.map((url) => url.trim())
					.filter((url) => url !== '' && url !== 'undefined' && url !== 'null')
					.filter((url) => url.startsWith('http')); // Only valid URLs
				// console.log('✅ Successfully parsed as comma-separated:', urls);
				return urls;
			} catch (splitError) {
				// console.error('❌ All parsing methods failed:', splitError);
				return [];
			}
		}
	}

	// Helper function to parse categories
	function parseCategories(categoriesString: string | null): string[] {
		if (!categoriesString) return [];

		try {
			const parsed = JSON.parse(categoriesString);
			if (Array.isArray(parsed)) {
				return parsed.filter((cat) => typeof cat === 'string' && cat.trim() !== '');
			}
		} catch (error) {
			console.error('❌ Error parsing categories:', error);
		}
		return [];
	}

	// Props
	export let product: RawProduct;

	export let showRating: boolean = true;
	export let showBestsellerBadge: boolean = true;
	export let forceBestsellerBadge: boolean = false; // New prop to force showing bestseller badge
	export let showCategoryTags: boolean = true;
	export let showDescription: boolean = true;
	export let showAddToCart: boolean = true;
	export let className: string = '';
	export let productIndex: number = -1; // New prop to track the index of the product

	// Internal state
	let currentImageIndex = 0;
	let imageUrls: string[] = [];
	let categories: string[] = [];
	let isImageLoading = true;
	let imageLoadTimeout: ReturnType<typeof setTimeout>;
	let imgRef: HTMLImageElement | null = null; // Changed from HTMLDivElement to HTMLImageElement
	let touchStartX = 0;
	let touchStartY = 0;
	let touchEndX = 0;
	let isSwiping = false;

	const dispatch = createEventDispatcher<{
		addToCart: { productId: string; product: typeof product };
		imageClick: { productId: string; imageUrl: string; index: number };
	}>();

	// Parse image URLs and categories
	$: {
		// console.log(`\n🔍 ProductCard for "${product.name}":`);
		// console.log('  Raw imageUrls:', product.imageUrls);
		// console.log('  Raw categories:', product.categories);
		// console.log('  Size:', product.size);
		// console.log('  Flavor:', product.flavor);

		// Get images from imageUrls field
		if (product.imageUrls) {
			imageUrls = parseImageUrls(product.imageUrls);
			// console.log('  📸 Parsed imageUrls:', imageUrls);
			// console.log('  📸 Image count:', imageUrls.length);
			// console.log('  🎠 Will show slider:', imageUrls.length > 1);
		} else {
			imageUrls = [];
			// console.log('  📸 No images found');
		}

		// Add fallback image if no images found
		if (imageUrls.length === 0) {
			imageUrls = ['/images/animal1.jpg'];
			// console.log('📸 Added fallback image');
		}

		// Filter out duplicate images to avoid showing same image multiple times
		const uniqueImageUrls = [...new Set(imageUrls)];
		if (uniqueImageUrls.length !== imageUrls.length) {
			// console.log('🔄 Filtered out duplicate images:', uniqueImageUrls);
			imageUrls = uniqueImageUrls;
		}

		if (product.categories) {
			categories = parseCategories(product.categories);
			// console.log('🏷️ Parsed categories:', categories);
		} else {
			categories = [];
			// console.log('🏷️ No categories found');
		}

		currentImageIndex = 0;
		
		// Log final state
		// console.log(`  ✅ Final state for "${product.name}":`);
		// console.log('    ImageUrls:', imageUrls);
		// console.log('    Image count:', imageUrls.length);
		// console.log('    Categories:', categories);
		// console.log('    Will show slider:', imageUrls.length > 1);
	}

	// Re-evaluate loader when image changes or loads from cache (CSR safe)
	$: if (imageUrls.length > 0) {
		if (imageLoadTimeout) {
			clearTimeout(imageLoadTimeout);
		}
		isImageLoading = !(browser && imgRef && imgRef.complete);
		// console.log(`🖼️ Image loading state for "${product.name}":`, isImageLoading);
		imageLoadTimeout = setTimeout(() => {
			if (isImageLoading) {
				// console.log(`🔄 Safety: hiding loader after 5s for "${product.name}"`);
				isImageLoading = false;
			}
		}, 5000);
	}

	// Format price from kopiyky to UAH
	$: formattedPrice = (product.price / 100).toFixed(2);
	
	// Log price formatting
	$: {
		// console.log(`💰 Price for "${product.name}": ${product.price} kopiyky = ${formattedPrice} грн`);
	}

	// Navigation functions
	function nextImage() {
		if (imageUrls.length > 1) {
			const oldIndex = currentImageIndex;
			currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
			// console.log(`🔄 Next image for "${product.name}": ${oldIndex} → ${currentImageIndex}`);
		} else {
			// console.log(`❌ Cannot go to next image for "${product.name}" - only ${imageUrls.length} image(s)`);
		}
	}

	function prevImage() {
		if (imageUrls.length > 1) {
			const oldIndex = currentImageIndex;
			currentImageIndex = currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
			// console.log(`🔄 Previous image for "${product.name}": ${oldIndex} → ${currentImageIndex}`);
		} else {
			// console.log(`❌ Cannot go to previous image for "${product.name}" - only ${imageUrls.length} image(s)`);
		}
	}

	function goToImage(index: number) {
		if (index >= 0 && index < imageUrls.length) {
			const oldIndex = currentImageIndex;
			currentImageIndex = index;
			// console.log(`🎯 Go to image ${index} for "${product.name}": ${oldIndex} → ${currentImageIndex}`);
		} else {
			// console.log(`❌ Invalid image index ${index} for "${product.name}" (valid range: 0-${imageUrls.length - 1})`);
		}
	}

	// Touch event handlers
	function handleTouchStart(event: TouchEvent) {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
		isSwiping = true;
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isSwiping) return;
		
		const touchX = event.touches[0].clientX;
		const touchY = event.touches[0].clientY;
		
		const diffX = touchStartX - touchX;
		const diffY = touchStartY - touchY;
		
		// Check if horizontal swipe
		if (Math.abs(diffX) > Math.abs(diffY)) {
			event.preventDefault();
		}
	}

	function handleTouchEnd(event: TouchEvent) {
		if (!isSwiping) return;
		
		const touchEndX = event.changedTouches[0].clientX;
		const diffX = touchStartX - touchEndX;
		const absDiffX = Math.abs(diffX);
		
		// Minimum swipe distance
		if (absDiffX > 50) {
			if (diffX > 0) {
				nextImage(); // Swipe left - next image
			} else {
				prevImage(); // Swipe right - previous image
			}
		}
		
		isSwiping = false;
	}
	
	// Add keyboard event handler for accessibility
	function handleKeyDown(event: KeyboardEvent, action: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			action();
		}
	}

	function handleAddToCart() {
		try {
			// Convert raw product data to client product for cart
			const clientProduct = createClientProduct(product);

			// Add to cart
			cartStore.addItem(clientProduct, 1);

			// Show success notification
			notificationStore.success(`${product.name} added to cart!`, {
				duration: 3000
			});

			// Dispatch event for parent components
			dispatch('addToCart', { productId: product.id, product });
		} catch (error) {
			console.error('❌ Error adding product to cart:', error);
			notificationStore.error('Failed to add item to cart. Please try again.');
		}
	}

	function handleImageClick() {
		if (imageUrls[currentImageIndex]) {
			// console.log(`🖼️ Image clicked for "${product.name}" at index ${currentImageIndex}`);
			dispatch('imageClick', {
				productId: product.id,
				imageUrl: imageUrls[currentImageIndex],
				index: currentImageIndex
			});
		} else {
			// console.log(`❌ No image at index ${currentImageIndex} for "${product.name}"`);
		}
	}

	// Auto-advance slideshow for multiple images
	let slideshowInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		// console.log(`🎠 ProductCard onMount for "${product.name}":`);
		// console.log('  ImageUrls length:', imageUrls.length);
		// console.log('  Will start slideshow:', imageUrls.length > 1);
		// console.log('  Product data:', {
		// 	name: product.name,
		// 	imageUrls: product.imageUrls,
		// 	size: product.size,
		// 	flavor: product.flavor,
		// 	categories: product.categories
		// });
		// console.log('  Current imageUrls state:', imageUrls);
		
		// Only start slideshow if there are multiple unique images
		if (imageUrls.length > 1) {
			// console.log('  🎠 Starting slideshow with interval');
			slideshowInterval = setInterval(() => {
				// console.log(`  🎠 Auto-advancing to next image for "${product.name}"`);
				nextImage();
			}, 5000);
		} else {
			// console.log('  ❌ Not enough images for slideshow');
		}

		return () => {
			// console.log(`🗑️ ProductCard cleanup for "${product.name}":`);
			if (slideshowInterval) {
				// console.log('  🎠 Clearing slideshow interval');
				clearInterval(slideshowInterval);
			}
			if (imageLoadTimeout) {
				// console.log('  ⏰ Clearing image load timeout');
				clearTimeout(imageLoadTimeout);
			}
		};
	});

	$: if (imageUrls.length > 1 && slideshowInterval) {
		// console.log(`🔄 Restarting slideshow for "${product.name}" due to imageUrls change`);
		// console.log('  New imageUrls:', imageUrls);
		// console.log('  Image count:', imageUrls.length);
		clearInterval(slideshowInterval);
		slideshowInterval = setInterval(() => {
			// console.log(`  🎠 Auto-advancing to next image for "${product.name}" (restarted)`);
			nextImage();
		}, 5000);
	}
</script>

<div
	class="overflow-hidden {className}"
	style="min-height: 650px; height: 100%; display: flex; flex-direction: column; max-width: 100%;"
>
	<div class="flex h-full flex-col justify-end items-start p-4 md:p-6 gap-4 md:gap-6">
		<!-- Top Section: Rating + Bestseller Badge -->
		{#if showRating || (showBestsellerBadge && (forceBestsellerBadge || productIndex === 1 || productIndex === 2))}
			<div class="flex items-start justify-between w-full py-1">
				<!-- Rating and Reviews -->
				{#if showRating}
					<div class="flex flex-col items-start space-y-1 md:space-y-2">
						<div class="flex space-x-1">
							{#each Array(5) as _, _i}
								<svg class="h-4 w-4 md:h-5 md:w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							{/each}
						</div>
						<span class="text-[14px] md:text-[16px] leading-[18px] md:leading-[22px] font-normal text-[#474747]">100 Відгуків</span>
					</div>
				{/if}

				<!-- Bestseller Badge -->
				{#if showBestsellerBadge && (forceBestsellerBadge || productIndex === 1 || productIndex === 2)}
					<div class="rounded-[38px] bg-[#1f1f1f] px-3 py-1 md:px-4 md:py-2 ml-auto">
						<span class="text-[14px] md:text-[16px] leading-[22px] font-normal text-white">Бестселер</span>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Spacer div when no ratings or bestseller badge -->
			<div class="h-4 md:h-8"></div>
		{/if}

		<!-- Product Image Section -->
		<div 
			class="relative w-full overflow-hidden rounded-xl bg-white group" 
			style="height: 240px;"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<!-- Image Counter (only for multiple images) -->
			{#if imageUrls.length > 1}
				<div class="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
					{currentImageIndex + 1} / {imageUrls.length}
				</div>
			{/if}
			<!-- Main Image -->
			{#if imageUrls.length > 0}
				<div 
					class="h-full w-full cursor-pointer object-cover transition-opacity duration-500"
					role="button"
					tabindex="0"
					onclick={handleImageClick}
					onkeydown={(e) => handleKeyDown(e, handleImageClick)}
					data-product-image
				>
					<img
						src={imageUrls[currentImageIndex]}
						alt={product.name}
						class="h-full w-full object-cover"
						ontouchstart={handleTouchStart}
						ontouchmove={handleTouchMove}
						ontouchend={handleTouchEnd}
						onload={() => {
							// console.log('🖼️ Image loaded successfully:', imageUrls[currentImageIndex]);
							isImageLoading = false;
							// Clear timeout since image loaded successfully
							if (imageLoadTimeout) {
								clearTimeout(imageLoadTimeout);
							}
						}}
						onerror={() => {
							// console.log('Image load error, switching to fallback');
							isImageLoading = false;
							// Clear timeout since we're handling the error
							if (imageLoadTimeout) {
								clearTimeout(imageLoadTimeout);
							}
							// Add fallback image instead of replacing
							if (!imageUrls.includes('/images/animal1.jpg')) {
								imageUrls = [...imageUrls, '/images/animal1.jpg'];
							}
						}}
						style="object-fit: cover; object-position: center;"
						bind:this={imgRef}
					/>
				</div>
			{:else}
				<!-- Fallback Image -->
				<div 
					class="h-full w-full cursor-pointer object-cover"
					role="button"
					tabindex="0"
					onclick={handleImageClick}
					onkeydown={(e) => handleKeyDown(e, handleImageClick)}
				>
					<img
						src="/images/animal1.jpg"
						alt={product.name}
						class="h-full w-full object-cover"
						ontouchstart={handleTouchStart}
						ontouchmove={handleTouchMove}
						ontouchend={handleTouchEnd}
						onload={() => {
							// console.log('Fallback image loaded');
							isImageLoading = false;
						}}
						style="object-fit: cover; object-position: center;"
						bind:this={imgRef}
					/>
				</div>
			{/if}

			<!-- Loading State -->
			{#if isImageLoading && imageUrls.length > 0}
				<div
					class="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-100/60"
					aria-live="polite"
					aria-label="Loading image"
				>
					<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-[#4b766e]"></div>
				</div>
			{/if}

			<!-- Navigation Controls (only for 2+ unique images) -->
			{#if imageUrls.length > 1}
				<!-- Previous Button -->
				<button
					class="touch-button absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
					onclick={prevImage}
					aria-label="Previous image"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Next Button -->
				<button
					class="touch-button absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100"
					onclick={nextImage}
					aria-label="Next image"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				<!-- Image Indicators -->
				<div class="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-2">
					{#each imageUrls as _, index}
						<button
							class="touch-button h-3 w-3 rounded-full transition-all duration-300 {index === currentImageIndex
								? 'bg-white shadow-lg scale-125'
								: 'bg-white/60 hover:bg-white/80'}"
							onclick={() => goToImage(index)}
							aria-label={`Go to image ${index + 1}`}
						></button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Tags -->
		{#if showCategoryTags}
			<div class="flex flex-wrap gap-3">
				<!-- Size Tag -->
				<div class="rounded-[38px] bg-[#f0f0f0] px-4 py-2">
					<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]"
						>{product.size || 'N/A'}</span
					>
				</div>
				<!-- Flavor Tag with Label Color -->
				<div class="rounded-[38px] bg-blue-500 px-4 py-2">
					<span class="text-[14px] leading-[19.6px] font-normal text-white"
						>{product.flavor || 'N/A'}</span
					>
				</div>
				<!-- Category Tags -->
				{#if categories.length > 0}
					{#each categories as category, _index}
						<div class="rounded-[38px] bg-[#e5dcd3] px-4 py-2">
							<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]">{category}</span
							>
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- Product Information -->
		<div class="space-y-2 md:space-y-3 w-full">
			<!-- Product Name -->
			<h3 class="font-poppins text-[18px] md:text-[20px] leading-[26px] md:leading-[28px] font-semibold text-black">
				{product.name}
			</h3>

			<!-- Product Description -->
			{#if showDescription && product.description}
				<p
					class="font-poppins line-clamp-2 text-[14px] md:text-[16px] leading-[20px] md:leading-[22px] font-normal text-[#474747]"
				>
					{product.description}
				</p>
			{/if}
		</div>

		<!-- Price -->
		<div class="font-poppins text-[20px] md:text-[24px] leading-[28px] md:leading-[33px] font-semibold text-black">
			{formattedPrice} грн
		</div>

		<!-- Action Buttons Section - Sticky to bottom -->
		<div class="mt-auto space-y-4 w-full">
			<!-- Add to Cart Button -->
			{#if showAddToCart}
				<button
					class="touch-button font-poppins w-full rounded-xl bg-[#4b766e] px-6 py-4 text-[16px] leading-[22px] font-medium text-white transition-colors duration-200 hover:bg-[#3d5f58]"
					onclick={handleAddToCart}
				>
					До кошика
				</button>
			{/if}

			<!-- Future Subscribe Button Placeholder -->
			<!-- <button class="touch-button w-full bg-[#1f1f1f] hover:bg-[#333] text-white font-medium text-[14px] leading-[19.6px] py-3 px-4 rounded-xl transition-colors duration-200 font-poppins">
				Підписатися
			</button> -->
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}

	.font-poppins {
		font-family: 'Nunito', sans-serif;
	}
	
	/* Prevent overflow on small screens */
	@media (max-width: 400px) {
		h3, p, div {
			max-width: 100%;
			word-break: break-word;
		}
	}
	
	/* Mobile-specific styles */
	@media (max-width: 767px) {
		.mobile-card {
			background-color: white;
			border-radius: 16px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			overflow: hidden;
			transition: all 0.2s ease;
		}

		.mobile-card:hover {
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}
		
		.touch-button {
			min-height: 44px;
			min-width: 44px;
			padding: var(--spacing-sm) var(--spacing-md);
			border-radius: 8px;
			font-weight: var(--font-weight-medium);
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