<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import SEO from '$lib/components/SEO.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import { cartStore } from '$lib/stores/cart.store';
	import { notificationStore } from '$lib/stores/notifications';
	import { createClientProduct } from '$lib/types/product.types';
	import { MG_PER_TSP, BASELINE_PER_TSP } from '$lib/components/calculator.config.js';

	const { data }: { data: PageData } = $props();
	const pageTranslations = createPageTranslations();

	const product = $derived(data.product);

	function langPrefix(): string {
		const lang = $page.params.lang;
		return lang ? `/${lang}` : '';
	}

	function parseJsonArray(value: string | null | undefined): string[] {
		if (!value) return [];
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string' && v) : [];
		} catch {
			return [];
		}
	}

	const images = $derived(
		parseJsonArray(product.imageUrls).length > 0
			? parseJsonArray(product.imageUrls)
			: ['/images/animal1.jpg']
	);
	const categories = $derived(parseJsonArray(product.categories));
	const priceUAH = $derived(product.price / 100);
	const formattedPrice = $derived(priceUAH.toFixed(2));

	// Teaspoons per jar from size ("30 g" -> ~6 tsp at ~5g/tsp, paste density ≈ 1)
	const jarTsp = $derived(
		(() => {
			const match = /([\d.,]+)\s*(g|ml)/i.exec(product.size || '');
			if (!match) return 0;
			return parseFloat(match[1].replace(',', '.')) / 5;
		})()
	);
	const perDayPrice = $derived(jarTsp > 0 ? (priceUAH / jarTsp).toFixed(1) : null);
	const isSubscription = $derived(categories.includes('subscription'));

	let qty = $state(1);
	let currentImage = $state(0);

	function t(key: string): string {
		try {
			const v = ($pageTranslations as any)?.t?.(key);
			return typeof v === 'string' && v && !v.startsWith('[') ? v : '';
		} catch {
			return '';
		}
	}

	// Human-readable flavor (DB stores slugs like 'turmeric-ginger')
	function flavorLabel(value: string): string {
		const locale = ($pageTranslations as any)?.locale || 'uk-ua';
		const ukMap: Record<string, string> = {
			'turmeric-ginger': 'Куркума та імбир',
			'pumpkin-coconut': 'Гарбуз і кокос'
		};
		const enMap: Record<string, string> = {
			'turmeric-ginger': 'Turmeric & ginger',
			'pumpkin-coconut': 'Pumpkin & coconut'
		};
		const map = locale === 'en' ? enMap : ukMap;
		return map[value] || value;
	}

	function addToCart() {
		try {
			cartStore.addItem(createClientProduct(product), qty);
			notificationStore.success(`${product.name} ${t('products.pdp.added') || 'added to cart'}`, {
				duration: 3000
			});
		} catch {
			notificationStore.error('Failed to add item to cart. Please try again.');
		}
	}

	const seoTitle = $derived(`${product.name} | Balance Botanica`);
	const seoImage = $derived(images[0] || '');
	const productJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Product',
			name: product.name,
			image: images,
			description: product.description || product.name,
			brand: { '@type': 'Brand', name: 'Balance Botanica' },
			offers: {
				'@type': 'Offer',
				priceCurrency: 'UAH',
				price: priceUAH.toFixed(2),
				availability:
					product.stock > 0
						? 'https://schema.org/InStock'
						: 'https://schema.org/OutOfStock'
			}
		})
	);
</script>

<SEO
	title={seoTitle}
	description={String(product.description || product.name).slice(0, 160)}
	image={seoImage}
	currentPath={$page.url.pathname}
/>
<!-- Product structured data: SSR-rendered so Google sees it without JS -->
<svelte:head>
	{@html `<script type="application/ld+json">${productJsonLd}</script>`}
</svelte:head>

<div class="min-h-screen bg-cream">
	<div class="shell py-8">
		<!-- Breadcrumb -->
		<nav aria-label="Breadcrumb" class="mb-6 text-sm text-gray-500">
			<a href={`${langPrefix() || '/'}`} class="hover:text-main hover:underline">
				{t('products.home') || 'Home'}
			</a>
			<span class="mx-2">/</span>
			<a href={`${langPrefix()}/products`} class="hover:text-main hover:underline">
				{t('header.navigation.shop') || 'Shop'}
			</a>
			<span class="mx-2">/</span>
			<span aria-current="page" class="font-medium text-gray-700">{product.name}</span>
		</nav>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Gallery -->
			<div>
				<div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
					<img
						src={images[currentImage]}
						alt={product.name}
						class="h-auto max-h-[480px] w-full object-cover"
						loading="eager"
					/>
				</div>
				{#if images.length > 1}
					<div class="mt-3 flex gap-2">
						{#each images as img, i}
							<button
								type="button"
								onclick={() => (currentImage = i)}
								class="overflow-hidden rounded-xl ring-2 transition-all {i === currentImage
									? 'ring-main'
									: 'opacity-60 ring-transparent hover:opacity-100'}"
								aria-label={`View image ${i + 1}`}
							>
								<img src={img} alt="" class="h-16 w-16 object-cover" loading="lazy" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Info -->
			<div>
				<h1 class="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
					{product.name}
				</h1>

				<div class="mt-3 flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
						{product.size}
					</span>
					{#if jarTsp > 0}
						<span class="rounded-full bg-main/10 px-3 py-1 text-sm font-bold text-main">
							{t('products.pdp.servings').replace('{n}', String(Math.round(jarTsp * 60))) ||
								`≈${Math.round(jarTsp * 60)} mg curcuminoids per jar`}
						</span>
					{/if}
					{#if product.stock > 0}
						<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
							✓
						</span>
					{/if}
				</div>

				<div class="mt-4 flex flex-wrap items-center gap-3">
					<span class="text-4xl font-black tracking-tight text-gray-900"
						>{formattedPrice} <span class="text-2xl font-bold text-gray-500">грн</span></span
					>
					{#if jarTsp > 0 && Math.round((1 - priceUAH / jarTsp / BASELINE_PER_TSP) * 100) > 0}
						<span class="rounded-full bg-green-100 px-3 py-1 text-sm font-black text-green-800">
							−{Math.round((1 - priceUAH / jarTsp / BASELINE_PER_TSP) * 100)}%
						</span>
					{/if}
					{#if perDayPrice}
						<span class="pb-1 text-lg font-bold text-ember">
							{(t('products.pdp.per_day') || '≈ {price} UAH per day for a medium dog').replace(
								'{price}',
								perDayPrice
							)}
						</span>
					{/if}
				</div>

				{#if product.description}
					<p class="mt-4 leading-relaxed text-gray-600">{product.description}</p>
				{/if}

				<!-- Trust row -->
				<div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
					<div class="rounded-2xl bg-white px-3 py-2.5 text-center text-[13px] font-bold text-gray-700 ring-1 ring-black/5">
						🧪 {t('products.pdp.trust_coa') || 'Heavy-metal tested batch'}
					</div>
					<div class="rounded-2xl bg-white px-3 py-2.5 text-center text-[13px] font-bold text-gray-700 ring-1 ring-black/5">
						❄️ {t('products.pdp.trust_fridge') || 'Keep refrigerated'}
					</div>
					<div class="rounded-2xl bg-white px-3 py-2.5 text-center text-[13px] font-bold text-gray-700 ring-1 ring-black/5">
						🩺 {t('products.pdp.trust_vet') || 'Ask your vet about dosing'}
					</div>
				</div>

				<!-- Qty + Add to cart -->
				<div class="mt-6 flex items-center gap-3">
					<div class="flex items-center rounded-full bg-white ring-1 ring-black/10">
						<button
							type="button"
							onclick={() => (qty = Math.max(1, qty - 1))}
							class="px-4 py-3 text-xl font-black text-gray-600 hover:text-gray-900"
							aria-label="Decrease quantity"
						>
							−
						</button>
						<span class="min-w-8 text-center text-lg font-black">{qty}</span>
						<button
							type="button"
							onclick={() => (qty = Math.min(99, qty + 1))}
							class="px-4 py-3 text-xl font-black text-gray-600 hover:text-gray-900"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
					<button
						type="button"
						onclick={addToCart}
						disabled={product.stock <= 0}
						class="flex-1 rounded-full bg-main px-6 py-3.5 text-lg font-extrabold text-white shadow-xl shadow-main/30 transition-all hover:-translate-y-0.5 hover:bg-[#b25f0e] disabled:cursor-not-allowed disabled:opacity-40"
					>
						До кошика
					</button>
				</div>

				{#if isSubscription}
					<a
						href="/#subscribe"
						class="mt-3 block rounded-full bg-[#1f1f1f] px-6 py-3 text-center font-bold text-white transition-colors hover:bg-[#333]"
					>
						{t('products.pdp.subscribe_cta') || '🔁 Refill subscription — never run out'}
					</a>
				{/if}

				<a
					href={`${langPrefix()}/#calculator`}
					class="mt-3 block text-center text-sm font-semibold text-main hover:underline"
				>
					{t('products.pdp.calculator_cta') || 'Not sure about the dose? Use the calculator'}
				</a>

				<!-- Details -->
				<div class="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/5">
					<h2 class="mb-3 text-lg font-extrabold text-gray-900">
						{t('products.pdp.details') || 'Details'}
					</h2>
					<dl class="space-y-2 text-sm">
						<div class="flex justify-between gap-4">
							<dt class="text-gray-500">{t('products.pdp.size') || 'Volume'}</dt>
							<dd class="font-bold text-gray-900">{product.size}</dd>
						</div>
						<div class="flex justify-between gap-4">
							<dt class="text-gray-500">{t('products.pdp.flavor') || 'Taste'}</dt>
							<dd class="font-bold text-gray-900">{flavorLabel(product.flavor)}</dd>
						</div>
						<div class="flex justify-between gap-4">
							<dt class="text-gray-500">Куркуміноїди / 5 г</dt>
							<dd class="font-bold text-gray-900">~{MG_PER_TSP} мг</dd>
						</div>
					</dl>
				</div>

				<button
					type="button"
					onclick={() => goto(`${langPrefix()}/products`)}
					class="mt-6 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:underline"
				>
					← {t('products.pdp.back') || 'Back to shop'}
				</button>
			</div>
		</div>
	</div>
</div>
