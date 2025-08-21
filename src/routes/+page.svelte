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

	<!-- Main Content -->
	<main class="main-section">
		<!-- Hero Section - Fixed Height -->
		<section class="hero-section">
			<div class="hero-content">
				<!-- Left Column - Text Content -->
				<div class="hero-text">
					<h1 class="hero-title">
						{$pageTranslations.t('benefits.hero.title')}
					</h1>
					<p class="hero-subtitle">
						{$pageTranslations.t('benefits.hero.subtitle')}
					</p>
					<div class="hero-buttons">
						<a href="/products" class="hero-button primary">
							{$pageTranslations.t('benefits.hero.shop_button')}
						</a>
						<a href="/about" class="hero-button secondary">
							{$pageTranslations.t('benefits.hero.learn_button')}
						</a>
					</div>
				</div>

				<!-- Right Column - Hero Image -->
				<div class="hero-image">
					<img src={mainBanner} alt="Balance Botanica - Premium CBD Products" class="hero-banner" />
				</div>
			</div>
		</section>

		<!-- Benefits Section - Split into Two Products -->
		<section class="benefits-section">
			<div class="benefits-content">
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

<style>
	/* Frame 427320931 - Main Section Layout */
	.main-section {
		/* Auto layout */
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0;
		gap: 0;

		width: 100%;
		min-height: 100vh;

		/* Inside auto layout */
		flex: none;
		order: 2;
		flex-grow: 0;
	}

	/* Hero Section - Fixed Height */
	.hero-section {
		width: 100%;
		height: 640px;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		/* Auto layout */
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 150px;
		gap: 60px;

		width: 1920px;
		height: 640px;

		/* Inside auto layout */
		flex: none;
		order: 2;
		flex-grow: 0;

		/* Responsive adjustments */
		max-width: 100vw;
		overflow-x: auto;
	}

	.hero-text {
		flex: 1;
		max-width: 600px;
	}

	.hero-title {
		font-size: 3.5rem;
		font-weight: 900;
		color: #1a1a1a;
		line-height: 1.1;
		margin-bottom: 1.5rem;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: #404040;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.hero-buttons {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.hero-button {
		padding: 1rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		font-size: 1rem;
	}

	.hero-button.primary {
		background: #3f6f68;
		color: white;
	}

	.hero-button.primary:hover {
		background: #2d5a54;
		transform: translateY(-2px);
	}

	.hero-button.secondary {
		background: transparent;
		color: #3f6f68;
		border: 2px solid #3f6f68;
	}

	.hero-button.secondary:hover {
		background: #3f6f68;
		color: white;
		transform: translateY(-2px);
	}

	.hero-image {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.hero-banner {
		max-width: 100%;
		height: auto;
		border-radius: 16px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	/* Benefits Section - Full Width Background */
	.benefits-section {
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		background: #3f6f68;
		padding: 5rem 0;
	}

	.benefits-content {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Responsive design for smaller screens */
	@media (max-width: 1920px) {
		.hero-content {
			width: 100%;
			padding: 10px 4rem;
		}
	}

	@media (max-width: 768px) {
		.hero-section {
			height: auto;
			min-height: 640px;
			padding: 2rem 0;
		}

		.hero-content {
			flex-direction: column;
			padding: 10px 2rem;
			gap: 40px;
			height: auto;
		}

		.hero-title {
			font-size: 2.5rem;
			text-align: center;
		}

		.hero-subtitle {
			text-align: center;
		}

		.hero-buttons {
			justify-content: center;
		}

		.hero-text {
			text-align: center;
		}

		.benefits-section {
			padding: 3rem 0;
		}

		.benefits-content {
			padding: 0 1rem;
		}
	}

	@media (max-width: 480px) {
		.hero-content {
			padding: 10px 1rem;
			gap: 30px;
		}

		.hero-title {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1.125rem;
		}

		.hero-button {
			padding: 0.875rem 1.5rem;
			font-size: 0.875rem;
		}

		.benefits-section {
			padding: 2rem 0;
		}
	}
</style>
