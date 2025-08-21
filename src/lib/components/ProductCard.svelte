<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Helper function to parse image URLs
	function parseImageUrls(imageUrlsString: string | null): string[] {
		if (!imageUrlsString) return [];

		console.log('🔧 Parsing imageUrlsString:', imageUrlsString);

		try {
			// First try to parse as JSON
			const parsed = JSON.parse(imageUrlsString);
			console.log('✅ Successfully parsed as JSON:', parsed);

			if (Array.isArray(parsed)) {
				return parsed.filter((url) => typeof url === 'string' && url.trim() !== '');
			} else {
				console.warn('⚠️ Parsed result is not an array:', parsed);
				return [];
			}
		} catch (jsonError) {
			console.log('❌ JSON parse failed, trying comma-separated:', jsonError);

			// If JSON fails, try comma-separated string
			try {
				const urls = imageUrlsString
					.split(',')
					.map((url) => url.trim())
					.filter((url) => url !== '');
				console.log('✅ Successfully parsed as comma-separated:', urls);
				return urls;
			} catch (splitError) {
				console.error('❌ All parsing methods failed:', splitError);
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
	export let product: {
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
	};

	export let showRating: boolean = true;
	export let showBestsellerBadge: boolean = true;
	export let showCategoryTags: boolean = true;
	export let showDescription: boolean = true;
	export let showAddToCart: boolean = true;
	export let className: string = '';

	// Internal state
	let currentImageIndex = 0;
	let imageUrls: string[] = [];
	let categories: string[] = [];
	let isImageLoading = true;
	let imageLoadTimeout: ReturnType<typeof setTimeout>;
	let imgRef: HTMLImageElement | null = null;

	const dispatch = createEventDispatcher<{
		addToCart: { productId: string; product: typeof product };
		imageClick: { productId: string; imageUrl: string; index: number };
	}>();

	// Parse image URLs and categories
	$: {
		console.log('🔍 Product data:', {
			imageUrls: product.imageUrls,
			categories: product.categories,
			size: product.size,
			flavor: product.flavor
		});

		if (product.imageUrls) {
			imageUrls = parseImageUrls(product.imageUrls);
			console.log('📸 Parsed imageUrls:', imageUrls);
		} else {
			imageUrls = [];
			console.log('📸 No images found');
		}

		// Add fallback image if no Cloudinary images
		if (imageUrls.length === 0) {
			imageUrls = ['/images/animal1.jpg'];
			console.log('📸 Added fallback image');
		}

		if (product.categories) {
			categories = parseCategories(product.categories);
			console.log('🏷️ Parsed categories:', categories);
		} else {
			categories = [];
			console.log('🏷️ No categories found');
		}

		currentImageIndex = 0;
	}

	// Re-evaluate loader when image changes or loads from cache (CSR safe)
	$: if (imageUrls.length > 0) {
		if (imageLoadTimeout) {
			clearTimeout(imageLoadTimeout);
		}
		isImageLoading = !(browser && imgRef && imgRef.complete);
		imageLoadTimeout = setTimeout(() => {
			if (isImageLoading) {
				console.log('🔄 Safety: hiding loader after 5s');
				isImageLoading = false;
			}
		}, 5000);
	}

	// Format price from kopiyky to UAH
	$: formattedPrice = (product.price / 100).toFixed(2);

	// Navigation functions
	function nextImage() {
		if (imageUrls.length > 1) {
			currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
		}
	}

	function prevImage() {
		if (imageUrls.length > 1) {
			currentImageIndex = currentImageIndex === 0 ? imageUrls.length - 1 : currentImageIndex - 1;
		}
	}

	function goToImage(index: number) {
		if (index >= 0 && index < imageUrls.length) {
			currentImageIndex = index;
		}
	}

	function handleAddToCart() {
		dispatch('addToCart', { productId: product.id, product });
	}

	function handleImageClick() {
		if (imageUrls[currentImageIndex]) {
			dispatch('imageClick', {
				productId: product.id,
				imageUrl: imageUrls[currentImageIndex],
				index: currentImageIndex
			});
		}
	}

	// Auto-advance slideshow for multiple images
	let slideshowInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		if (imageUrls.length > 1) {
			slideshowInterval = setInterval(() => {
				nextImage();
			}, 5000);
		}

		return () => {
			if (slideshowInterval) {
				clearInterval(slideshowInterval);
			}
			if (imageLoadTimeout) {
				clearTimeout(imageLoadTimeout);
			}
		};
	});

	$: if (imageUrls.length > 1 && slideshowInterval) {
		clearInterval(slideshowInterval);
		slideshowInterval = setInterval(() => {
			nextImage();
		}, 5000);
	}
</script>

<div
	class="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm {className}"
	style="min-width: 300px; height: 628px;"
>
	<div class="flex h-full flex-col space-y-6 p-6">
		<!-- Top Section: Rating + Bestseller Badge -->
		{#if showRating || showBestsellerBadge}
			<div class="flex items-start justify-between">
				<!-- Rating and Reviews -->
				{#if showRating}
					<div class="flex items-center space-x-2">
						<div class="flex space-x-1">
							{#each Array(5) as _, _i}
								<svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							{/each}
						</div>
						<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]">100 Відгуків</span
						>
					</div>
				{/if}

				<!-- Bestseller Badge -->
				{#if showBestsellerBadge}
					<div class="rounded-[38px] bg-[#1f1f1f] px-3 py-1.5">
						<span class="text-[14px] leading-[19.6px] font-normal text-white">Бестселер</span>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Product Image Section -->
		<div class="relative w-full overflow-hidden rounded-xl bg-white" style="height: 200px;">
			<!-- Main Image -->
			{#if imageUrls.length > 0}
				<img
					src={imageUrls[currentImageIndex]}
					alt={product.name}
					class="h-full w-full cursor-pointer object-cover"
					data-product-image
					bind:this={imgRef}
					on:click={handleImageClick}
					on:load={() => {
						console.log('🖼️ Image loaded successfully:', imageUrls[currentImageIndex]);
						isImageLoading = false;
						// Clear timeout since image loaded successfully
						if (imageLoadTimeout) {
							clearTimeout(imageLoadTimeout);
						}
					}}
					on:error={() => {
						console.log('Image load error, switching to fallback');
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
				/>
			{:else}
				<!-- Fallback Image -->
				<img
					src="/images/animal1.jpg"
					alt={product.name}
					class="h-full w-full cursor-pointer object-cover"
					on:click={handleImageClick}
					on:load={() => {
						console.log('Fallback image loaded');
						isImageLoading = false;
					}}
					style="object-fit: cover; object-position: center;"
				/>
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

			<!-- Navigation Controls (only for 2+ images) -->
			{#if imageUrls.length > 1}
				<!-- Previous Button -->
				<button
					class="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/50"
					on:click={prevImage}
					aria-label="Previous image"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<!-- Next Button -->
				<button
					class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:bg-black/50"
					on:click={nextImage}
					aria-label="Next image"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>

				<!-- Image Indicators -->
				<div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-1">
					{#each imageUrls as _, index}
						<button
							class="h-2 w-2 rounded-full transition-all duration-200 {index === currentImageIndex
								? 'bg-white'
								: 'bg-white/50'}"
							on:click={() => goToImage(index)}
							aria-label={`Go to image ${index + 1}`}
						></button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Tags -->
		{#if showCategoryTags}
			<div class="flex flex-wrap gap-2">
				<!-- Size Tag -->
				<div class="rounded-[38px] bg-[#f0f0f0] px-3 py-1.5">
					<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]"
						>{product.size || 'N/A'}</span
					>
				</div>
				<!-- Flavor Tag with Label Color -->
				<div class="rounded-[38px] bg-blue-500 px-3 py-1.5">
					<span class="text-[14px] leading-[19.6px] font-normal text-white"
						>{product.flavor || 'N/A'}</span
					>
				</div>
				<!-- Category Tags -->
				{#if categories.length > 0}
					{#each categories as category, _index}
						<div class="rounded-[38px] bg-[#e5dcd3] px-3 py-1.5">
							<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]">{category}</span
							>
						</div>
					{/each}
				{/if}
			</div>
		{/if}

		<!-- Product Information -->
		<div class="space-y-2">
			<!-- Product Name -->
			<h3 class="font-poppins text-[18px] leading-[25.2px] font-semibold text-black">
				{product.name}
			</h3>

			<!-- Product Description -->
			{#if showDescription && product.description}
				<p
					class="font-poppins line-clamp-2 text-[14px] leading-[19.6px] font-normal text-[#474747]"
				>
					{product.description}
				</p>
			{/if}
		</div>

		<!-- Price -->
		<div class="font-poppins text-[22px] leading-[30.8px] font-semibold text-black">
			{formattedPrice} грн
		</div>

		<!-- Action Buttons Section - Sticky to bottom -->
		<div class="mt-auto space-y-3">
			<!-- Add to Cart Button -->
			{#if showAddToCart}
				<button
					class="font-poppins w-full rounded-xl bg-[#4b766e] px-4 py-3 text-[14px] leading-[19.6px] font-medium text-white transition-colors duration-200 hover:bg-[#3d5f58]"
					on:click={handleAddToCart}
				>
					До кошика
				</button>
			{/if}

			<!-- Future Subscribe Button Placeholder -->
			<!-- <button class="w-full bg-[#1f1f1f] hover:bg-[#333] text-white font-medium text-[14px] leading-[19.6px] py-3 px-4 rounded-xl transition-colors duration-200 font-poppins">
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
		font-family: 'Poppins', sans-serif;
	}
</style>
