<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { createPageTranslations } from '$lib/i18n/store';
	import { BASELINE_PER_TSP } from './calculator.config.js';
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
	let imgRef: HTMLImageElement | null = null; // Changed from HTMLDivElement to HTMLImageElement
	let touchStartX = 0;
	let touchStartY = 0;
	const touchEndX = 0;
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

	const pageTranslations = createPageTranslations();

	// Pack-size badge from categories: trial / week / halfmonth / month (paste jars, weighed in grams).
	// Unit letter follows the page locale so badges never mix alphabets (30 г vs 30 g).
	function unitLabel(): string {
		const locale = ($pageTranslations as any)?.locale || 'uk-ua';
		const match = /([\d.,]+)\s*(g|ml)/i.exec(product.size || '');
		if (!match) return product.size || '';
		const num = match[1].replace(',', '.');
		const unit = match[2].toLowerCase() === 'ml' ? (locale === 'en' ? 'ml' : 'мл') : locale === 'en' ? 'g' : 'г';
		return `${num} ${unit}`;
	}

	$: packMeta = categories.includes('trial')
		? { tier: 'TRIAL', cls: 'bg-stone-500' }
		: categories.includes('week')
			? { tier: 'WEEK', cls: 'bg-[#3f6f68]' }
			: categories.includes('halfmonth')
				? { tier: 'HALF', cls: 'bg-main' }
				: categories.includes('month')
					? { tier: 'MONTH', cls: 'bg-[#1f1f1f]' }
					: null;

	$: packBadge = packMeta ? `${packMeta.tier} · ${unitLabel()}${packMeta.tier === 'MONTH' ? ' 🫙' : ''}` : null;

	// Teaspoons per jar parsed from size ("30 g" -> ~6 tsp at ~5g/tsp, paste density ≈ 1)
	$: jarTsp = (() => {
		const match = /([\d.,]+)\s*(g|ml)/i.exec(product.size || '');
		if (!match) return 0;
		return parseFloat(match[1].replace(',', '.')) / 5;
	})();

	// Per-day price for a medium dog (~1 tsp/day) — the number that sells MONTH
	$: perDayPrice = jarTsp > 0 ? (product.price / 100 / jarTsp).toFixed(1) : null;

	// Savings vs the TRIAL jar (honest per-tsp math, see BASELINE_PER_TSP)
	$: savingsPct = (() => {
		if (jarTsp <= 0) return null;
		const perTsp = product.price / 100 / jarTsp;
		const pct = Math.round((1 - perTsp / BASELINE_PER_TSP) * 100);
		return pct > 0 ? pct : null;
	})();

	$: isSubscription = categories.includes('subscription');

	// Technical category slugs customers should never see as pills: the tier
	// lives in the overlay badge, 'subscription' in the refill CTA below.
	const HIDDEN_CATEGORIES = [
		'dogs',
		'curcumin',
		'paste',
		'treats',
		'subscription',
		'trial',
		'week',
		'halfmonth',
		'month'
	];

	// Human-readable tag labels (locale-aware: Ukrainian by default, English on /en)
	function tagLabel(value: string): string {
		const locale = ($pageTranslations as any)?.locale || 'uk-ua';
		const ukMap: Record<string, string> = {
			trial: 'Пробник',
			week: 'Тиждень',
			halfmonth: 'Півмісяця',
			month: 'Місяць',
			subscription: 'Підписка',
			'turmeric-ginger': 'Куркума та імбир',
			'pumpkin-coconut': 'Гарбуз і кокос'
		};
		const enMap: Record<string, string> = {
			trial: 'Trial',
			week: 'Week',
			halfmonth: 'Half month',
			month: 'Month',
			subscription: 'Subscription',
			'turmeric-ginger': 'Turmeric & ginger',
			'pumpkin-coconut': 'Pumpkin & coconut'
		};
		const map = locale === 'en' ? enMap : ukMap;
		if (map[value]) return map[value];
		// Measurements like "30 g" / "100 ml" stay as-is (units need no translation)
		if (/^[\d.,\s]+(g|ml)$/i.test(value.trim())) {
			return locale === 'en' ? value : value.replace(/\bg\b/gi, 'г').replace(/\bml\b/gi, 'мл');
		}
		let label = value.replace(/[-_]+/g, ' ');
		if (locale !== 'en') {
			label = label.replace(/\bg\b/gi, 'г').replace(/\bml\b/gi, 'мл');
		} else {
			label = label.replace(/\b\w/g, (c) => c.toUpperCase());
		}
		return label;
	}

	$: visibleCategories = categories.filter((c) => !HIDDEN_CATEGORIES.includes(c));

	function goToProduct() {
		goto(`products/${product.id}`);
	}

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
			dispatch('imageClick', {
				productId: product.id,
				imageUrl: imageUrls[currentImageIndex],
				index: currentImageIndex
			});
			// Product click opens the detail page (reviews, dosage, subscription)
			goToProduct();
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
	<div class="flex h-full flex-col items-start justify-end gap-4 p-4 md:gap-6 md:p-6">
		<!-- Product Image Section with overlaid badges (Rozetka-style: no badge rows, no layout shifts) -->
		<div
			class="group relative w-full overflow-hidden rounded-xl bg-white"
			style="height: 240px;"
			ontouchstart={handleTouchStart}
			ontouchend={handleTouchEnd}
		>
			<!-- Pack tier badge with per-day price, top-left (single source of value) -->
			{#if packBadge}
				<div
					class="absolute top-3 left-3 z-10 rounded-2xl {packMeta?.cls} px-3 py-1.5 shadow-lg"
				>
					<div class="text-[13px] leading-[18px] font-bold whitespace-nowrap text-white md:text-[14px]"
						>{packBadge}</div
					>
					{#if perDayPrice}
						<div class="text-[11px] leading-[14px] font-bold whitespace-nowrap text-white/85">
							≈ {perDayPrice} {($pageTranslations as any)?.locale === 'en' ? 'UAH/day' : 'грн/день'}
						</div>
					{/if}
				</div>
			{/if}
			<!-- New-product pill, top-right (honest: no reviews yet, so no fake stars) -->
			{#if showRating}
				<div
					class="absolute top-3 right-3 z-10 rounded-full bg-amber-100 px-3 py-1.5 shadow-lg ring-1 ring-amber-200"
				>
					<span class="text-[13px] leading-[18px] font-bold text-amber-800 md:text-[14px]"
						>{$pageTranslations?.t('products.badge_new') || 'New'}</span
					>
				</div>
			{/if}
			<!-- Image Counter (only for multiple images, bottom-right to avoid the New pill) -->
			{#if imageUrls.length > 1}
				<div
					class="absolute right-3 bottom-3 z-10 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
				>
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
					<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-main"></div>
				</div>
			{/if}

			<!-- Navigation Controls (only for 2+ unique images) -->
			{#if imageUrls.length > 1}
				<!-- Previous Button -->
				<button
					class="touch-button absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-black/60"
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
					class="touch-button absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-black/40 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-black/60"
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
							class="touch-button h-3 w-3 rounded-full transition-all duration-300 {index ===
							currentImageIndex
								? 'scale-125 bg-white shadow-lg'
								: 'bg-white/60 hover:bg-white/80'}"
							onclick={() => goToImage(index)}
							aria-label={`Go to image ${index + 1}`}
						></button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product Tags: flavor only (size lives in the overlay badge + title, no triplicates) -->
		{#if showCategoryTags}
			<div class="flex flex-wrap gap-3">
				<!-- Flavor Tag: warm tint, on-palette (the old blue matched nothing) -->
				<div class="rounded-[38px] bg-turmeric-soft px-4 py-2 ring-1 ring-turmeric/20">
					<span class="text-[14px] leading-[19.6px] font-bold text-turmeric-deep"
						>{product.flavor ? tagLabel(product.flavor) : 'N/A'}</span
					>
				</div>
			<!-- Category Tags (technical slugs hidden, human labels only) -->
			{#if visibleCategories.length > 0}
				{#each visibleCategories as category, _index}
					<div class="rounded-[38px] bg-[#e5dcd3] px-4 py-2">
						<span class="text-[14px] leading-[19.6px] font-normal text-[#474747]"
							>{tagLabel(category)}</span
						>
					</div>
				{/each}
			{/if}
			</div>
		{/if}

		<!-- Product Information -->
		<div class="w-full space-y-2 md:space-y-3">
			<!-- Product Name (links to detail page) -->
			<h3
				class="font-poppins text-[18px] leading-[26px] font-semibold text-black md:text-[20px] md:leading-[28px]"
			>
				<a
					href={`products/${product.id}`}
					class="transition-colors hover:text-main hover:underline"
				>
					{product.name}
				</a>
			</h3>

			<!-- Product Description -->
			{#if showDescription && product.description}
				<p
					class="font-poppins line-clamp-2 text-[14px] leading-[20px] font-normal text-[#474747] md:text-[16px] md:leading-[22px]"
				>
					{product.description}
				</p>
			{/if}
		</div>

		<!-- Price + honest savings vs TRIAL (computed per-tsp, never hand-typed) -->
		<div class="flex flex-wrap items-center gap-2.5">
			<div
				class="font-poppins text-[26px] leading-[30px] font-black tracking-tight text-gray-900 md:text-[28px] md:leading-[32px]"
			>
				{formattedPrice} <span class="text-[16px] font-bold text-gray-500">грн</span>
			</div>
			{#if savingsPct}
				<div class="rounded-full bg-green-100 px-2.5 py-1 text-[13px] font-black text-green-800">
					−{savingsPct}%
				</div>
			{/if}
		</div>

		<!-- Action Buttons Section - Sticky to bottom -->
		<div class="mt-auto w-full space-y-3">
			<!-- Add to Cart Button -->
			{#if showAddToCart}
				<button
					class="touch-button font-poppins w-full rounded-xl bg-main px-6 py-4 text-[16px] leading-[22px] font-bold text-white shadow-lg shadow-main/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b25f0e]"
					onclick={handleAddToCart}
				>
					До кошика
				</button>
			{/if}

			<!-- Refill subscription CTA (only on subscription packs like MONTH) -->
			{#if isSubscription}
				<a
					href="/#subscribe"
					class="touch-button font-poppins block w-full rounded-xl bg-[#1f1f1f] px-4 py-3 text-center text-[14px] leading-[19.6px] font-medium text-white transition-colors duration-200 hover:bg-[#333]"
				>
					🔁 Refill — не закінчиться раптово
				</a>
			{/if}
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
		h3,
		p,
		div {
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
