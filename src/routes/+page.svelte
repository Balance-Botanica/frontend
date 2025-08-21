<script lang="ts">
	import { onMount } from 'svelte';
	import MadeInUkraine from '$lib/components/MadeInUkraine.svelte';
	import CalculatorSection from '$lib/components/CalculatorSection.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import ProductsSection from '$lib/components/ProductsSection.svelte';
	import BenefitIcon from '$lib/components/BenefitIcon.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';
	import mainBanner from '$lib/assets/images/main-banner.png';

	export let data: PageData;

	let isScrolled = false;

	// Создаем переводы для страницы
	const pageTranslations = createPageTranslations();

	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

{#if $pageTranslations}
	<SEO
		title={$pageTranslations.t('benefits.meta.title')}
		description={$pageTranslations.t('benefits.meta.description')}
		locale={$pageTranslations.locale}
	/>

	<!-- Full Screen Hero Banner -->
	<section class="relative flex h-screen items-center justify-center overflow-hidden">
		<!-- Background Image with Overlay -->
		<div class="absolute inset-0">
			<img
				src={mainBanner}
				alt="Balance Botanica - Premium CBD Products"
				class="h-full w-full object-cover"
			/>
			<!-- Dark overlay for better text readability -->
			<div class="absolute inset-0 bg-black/40"></div>
		</div>

		<!-- Hero Content -->
		<div class="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
			<h1 class="mb-6 text-5xl leading-tight font-bold md:text-7xl">
				{$pageTranslations.t('benefits.hero.title')}
			</h1>
			<p class="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl">
				{$pageTranslations.t('benefits.hero.subtitle')}
			</p>
			<div class="flex flex-col justify-center gap-4 sm:flex-row">
				<a
					href="/products"
					class="transform rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-800 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:shadow-xl"
				>
					{$pageTranslations.t('benefits.hero.shop_button')}
				</a>
				<a
					href="/about"
					class="transform rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-green-800"
				>
					{$pageTranslations.t('benefits.hero.learn_button')}
				</a>
			</div>
		</div>

		<!-- Scroll Indicator -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
			<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				></path>
			</svg>
		</div>
	</section>

	<!-- Main Content -->
	<main class="min-h-screen bg-white">
		<!-- Benefits Section - Split into Two Products -->
		<section class="bg-[#3f6f68] px-4 py-20">
			<div class="mx-auto max-w-6xl">
				<h2 class="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
					{$pageTranslations.t('benefits.title')}
				</h2>
				<div class="grid gap-16 text-white md:grid-cols-2">
					<!-- Left Column - Golden Paste CBD -->
					<div class="space-y-6">
						<h3 class="mb-8 text-center text-2xl font-bold">
							{$pageTranslations.t('benefits.golden_paste.title')}
						</h3>

						<!-- Куркума -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🟡" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.golden_paste.turmeric.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.golden_paste.turmeric.description')}
								</p>
							</div>
						</div>

						<!-- Імбир -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🟠" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.golden_paste.ginger.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.golden_paste.ginger.description')}
								</p>
							</div>
						</div>

						<!-- Кокосове масло -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🥥" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.golden_paste.coconut_oil.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.golden_paste.coconut_oil.description')}
								</p>
							</div>
						</div>

						<!-- CBD для собак -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🐕" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.golden_paste.cbd_for_dogs.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.golden_paste.cbd_for_dogs.description')}
								</p>
							</div>
						</div>
					</div>

					<!-- Right Column - CBD Oil -->
					<div class="space-y-6">
						<h3 class="mb-8 text-center text-2xl font-bold">
							{$pageTranslations.t('benefits.cbd_oil.title')}
						</h3>

						<!-- MCT Oil основа -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="💧" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.cbd_oil.mct_base.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.cbd_oil.mct_base.description')}
								</p>
							</div>
						</div>

						<!-- Два смаки -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🍖" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.cbd_oil.two_flavors.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.cbd_oil.two_flavors.description')}
								</p>
							</div>
						</div>

						<!-- Зручний дозатор -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="💧" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.cbd_oil.convenient_dropper.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.cbd_oil.convenient_dropper.description')}
								</p>
							</div>
						</div>

						<!-- Швидка дія -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="⚡" />
							<div>
								<h4 class="mb-1 text-lg font-semibold">
									{$pageTranslations.t('benefits.cbd_oil.fast_action.title')}
								</h4>
								<p class="text-sm text-white/80">
									{$pageTranslations.t('benefits.cbd_oil.fast_action.description')}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom recommendation text -->
				<div class="mt-12 border-t border-white/20 pt-8 text-center">
					<p class="mx-auto max-w-3xl text-sm text-white/70">
						{@html $pageTranslations.locale === 'uk-ua'
							? 'Обидва продукти можна давати як собакам, так і котам. Щоб правильно обрати продукт та дозування, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">використайте наш калькулятор</a> та проконсультуватися з ветеринаром.'
							: 'Both products can be given to both dogs and cats. To properly choose a product and dosage, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">use our calculator</a> and consult with your veterinarian.'}
					</p>
				</div>
			</div>
		</section>

		<!-- Featured Products on Home -->
		<ProductsSection
			products={data.products}
			limit={3}
			title={$pageTranslations.t('benefits.products.homepage_title')}
		/>

		<!-- Made in Ukraine Section -->
		<MadeInUkraine />

		<!-- Calculator Section -->
		<CalculatorSection />

		<!-- FAQ Section -->
		<FAQ />
	</main>
{/if}
