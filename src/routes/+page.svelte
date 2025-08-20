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
	<section class="relative h-screen flex items-center justify-center overflow-hidden">
		<!-- Background Image with Overlay -->
		<div class="absolute inset-0">
			<img 
				src={mainBanner} 
				alt="Balance Botanica - Premium CBD Products" 
				class="w-full h-full object-cover"
			/>
			<!-- Dark overlay for better text readability -->
			<div class="absolute inset-0 bg-black/40"></div>
		</div>
		
		<!-- Hero Content -->
		<div class="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
			<h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
				{$pageTranslations.t('benefits.hero.title')}
			</h1>
			<p class="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
				{$pageTranslations.t('benefits.hero.subtitle')}
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a 
					href="/products" 
					class="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
				>
					{$pageTranslations.t('benefits.hero.shop_button')}
				</a>
				<a 
					href="/about" 
					class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-800 transition-all duration-300 transform hover:scale-105"
				>
					{$pageTranslations.t('benefits.hero.learn_button')}
				</a>
			</div>
		</div>
		
		<!-- Scroll Indicator -->
		<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
			<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
			</svg>
		</div>
	</section>

	<!-- Main Content -->
	<main class="min-h-screen bg-white">
		<!-- Benefits Section - Split into Two Products -->
		<section class="py-20 px-4 bg-[#3f6f68]">
			<div class="max-w-6xl mx-auto">
				<h2 class="text-3xl md:text-4xl font-bold text-white mb-12 text-center">{$pageTranslations.t('benefits.title')}</h2>
				<div class="grid md:grid-cols-2 gap-16 text-white">
					
					<!-- Left Column - Golden Paste CBD -->
					<div class="space-y-6">
						<h3 class="text-2xl font-bold text-center mb-8">{$pageTranslations.t('benefits.golden_paste.title')}</h3>
						
						<!-- Куркума -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🟡" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.golden_paste.turmeric.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.golden_paste.turmeric.description')}</p>
							</div>
						</div>

						<!-- Імбир -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🟠" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.golden_paste.ginger.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.golden_paste.ginger.description')}</p>
							</div>
						</div>

						<!-- Кокосове масло -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🥥" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.golden_paste.coconut_oil.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.golden_paste.coconut_oil.description')}</p>
							</div>
						</div>

						<!-- CBD для собак -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🐕" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.golden_paste.cbd_for_dogs.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.golden_paste.cbd_for_dogs.description')}</p>
							</div>
						</div>
					</div>

					<!-- Right Column - CBD Oil -->
					<div class="space-y-6">
						<h3 class="text-2xl font-bold text-center mb-8">{$pageTranslations.t('benefits.cbd_oil.title')}</h3>
						
						<!-- MCT Oil основа -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="💧" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.cbd_oil.mct_base.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.cbd_oil.mct_base.description')}</p>
							</div>
						</div>

						<!-- Два смаки -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="🍖" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.cbd_oil.two_flavors.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.cbd_oil.two_flavors.description')}</p>
							</div>
						</div>

						<!-- Зручний дозатор -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="💧" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.cbd_oil.convenient_dropper.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.cbd_oil.convenient_dropper.description')}</p>
							</div>
						</div>

						<!-- Швидка дія -->
						<div class="flex items-start gap-4">
							<BenefitIcon emoji="⚡" />
							<div>
								<h4 class="text-lg font-semibold mb-1">{$pageTranslations.t('benefits.cbd_oil.fast_action.title')}</h4>
								<p class="text-white/80 text-sm">{$pageTranslations.t('benefits.cbd_oil.fast_action.description')}</p>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Bottom recommendation text -->
				<div class="text-center mt-12 pt-8 border-t border-white/20">
					<p class="text-white/70 text-sm max-w-3xl mx-auto">
						{@html $pageTranslations.locale === 'uk-ua' 
							? 'Обидва продукти можна давати як собакам, так і котам. Щоб правильно обрати продукт та дозування, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">використайте наш калькулятор</a> та проконсультуватися з ветеринаром.'
							: 'Both products can be given to both dogs and cats. To properly choose a product and dosage, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">use our calculator</a> and consult with your veterinarian.'
						}
					</p>
				</div>
			</div>
		</section>
		
		<!-- Featured Products on Home -->
		<ProductsSection products={data.products} limit={3} title={$pageTranslations.t('benefits.products.homepage_title')} />
		
		<!-- Made in Ukraine Section -->
		<MadeInUkraine />
		
		<!-- Calculator Section -->
		<CalculatorSection />
		
		<!-- FAQ Section -->
		<FAQ />
	</main>
{/if} 
