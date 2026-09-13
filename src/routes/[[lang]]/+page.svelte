<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import MadeInUkraine from '$lib/components/MadeInUkraine.svelte';
	import CalculatorSection from '$lib/components/CalculatorSection.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import ProductsSection from '$lib/components/ProductsSection.svelte';
	import HeroBanner from '$lib/components/HeroBanner.svelte';
	import BenefitsSection from '$lib/components/BenefitsSection.svelte';
	import IngredientsSection from '$lib/components/ingredients/IngredientsSection.svelte';
	import EmailSubscription from '$lib/components/EmailSubscription.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';
	import mainBanner from '$lib/assets/images/main-banner.png';

	const { data }: { data: PageData } = $props();

	// Use global translations (reactive to language changes)
	const pageTranslations = createPageTranslations();

	// Debug logging
	console.log('🔍 Page data received:', data);
	console.log('📦 Products in data:', data?.products);
	console.log('📊 Products count:', data?.products?.length || 0);

	// State for mobile sections
	let activeSection = 'hero';
	let isScrolled = false;

	onMount(() => {
		// Add scroll listener for mobile section tracking
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Function to scroll to a section
	function scrollToSection(sectionId: string) {
		activeSection = sectionId;
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<!-- Always rendered so crawlers get head tags in SSR HTML (fallbacks before hydration) -->
	<SEO
		title={String($pageTranslations?.t('benefits.meta.title') || 'Balance Botanica - Golden Paste for Dogs')}
		description={String(
			$pageTranslations?.t('benefits.meta.description') ||
				'Golden paste for dogs (turmeric 95%, ginger, pepper, coconut oil) — complementary feed for mobility support. Not a medicine.'
		)}
	/>

{#if $pageTranslations}

	<!-- Main Content -->
	<main class="flex-1">
		<!-- Hero Section -->
		<HeroBanner
			title={$pageTranslations.t('benefits.hero.title')}
			subtitle={$pageTranslations.t('benefits.hero.subtitle')}
			shopButtonText={$pageTranslations.t('benefits.hero.shop_button')}
			learnButtonText={$pageTranslations.t('benefits.hero.learn_button')}
			imageUrl={mainBanner}
			imageAlt="Balance Botanica - Premium CBD Products"
		/>

		<!-- Benefits Section -->
		<BenefitsSection />

		<!-- Ingredients widgets: turmeric / coconut / ginger / pepper -->
		<IngredientsSection />

		<!-- Featured Products on Home (same grid + cards as /products: 4 across) -->
		<ProductsSection
			products={data.products}
			limit={4}
			columns={4}
			gap="gap-6"
			cardClassName="bg-white border border-[#efe0c3] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full"
			title={$pageTranslations.t('benefits.products.homepage_title')}
			translations={$pageTranslations}
		/>

		<!-- Made in Ukraine Section -->
		<MadeInUkraine />

		<!-- Calculator Section -->
		<CalculatorSection />

		<!-- FAQ Section -->
		<FAQ />

		<!-- Refill subscription (web + Flutter app share this) -->
		<EmailSubscription />
	</main>
{/if}

<style>
	/* Removed unused CSS selectors */
</style>
