<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import { page } from '$app/stores';
	import type { SupportedLocale } from '$lib/i18n/types';
	import { createPageTranslations } from '$lib/i18n/store';

	const { data } = $props();
	const lang = $derived(($page.params?.lang || 'uk-ua') as SupportedLocale);
	const isEnglish = $derived(lang === 'en');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived(data.keyPoints || []);

	const translations = $derived(() => ({
		learnMore:
			$pageTranslations?.t('cbdTypes.learnMore') || (isEnglish ? 'Learn More' : 'Дізнатися більше'),
		relatedArticles:
			$pageTranslations?.t('cbdTypes.relatedArticles') ||
			(isEnglish ? 'Related Articles' : "Пов'язані статті"),
		tableOfContents:
			$pageTranslations?.t('cbdTypes.tableOfContents') ||
			(isEnglish ? 'Table of Contents' : 'Зміст'),
		comparison:
			$pageTranslations?.t('cbdTypes.comparison') || (isEnglish ? 'Comparison' : 'Порівняння'),
		scientificEvidence:
			$pageTranslations?.t('cbdTypes.scientificEvidence') ||
			(isEnglish ? 'Scientific Evidence' : 'Наукові докази'),
		chooseYourType:
			$pageTranslations?.t('cbdTypes.chooseYourCBDType') ||
			(isEnglish ? 'Choose Your CBD Type' : 'Оберіть свій тип CBD'),
		isolate: $pageTranslations?.t('cbdTypes.isolate') || (isEnglish ? 'CBD Isolate' : 'Ізолят CBD'),
		fullSpectrum:
			$pageTranslations?.t('cbdTypes.fullSpectrum') ||
			(isEnglish ? 'Full Spectrum' : 'Повний спектр'),
		broadSpectrum:
			$pageTranslations?.t('cbdTypes.broadSpectrum') ||
			(isEnglish ? 'Broad Spectrum' : 'Широкий спектр'),
		thcContent:
			$pageTranslations?.t('cbdTypes.thcContent') || (isEnglish ? 'THC Content' : 'Вміст THC'),
		otherCannabinoids:
			$pageTranslations?.t('cbdTypes.otherCannabinoids') ||
			(isEnglish ? 'Other Cannabinoids' : 'Інші каннабіноїди'),
		entourageEffect:
			$pageTranslations?.t('cbdTypes.entourageEffect') ||
			(isEnglish ? 'Entourage Effect' : 'Ефект супроводу'),
		bioavailability:
			$pageTranslations?.t('cbdTypes.bioavailability') ||
			(isEnglish ? 'Bioavailability' : 'Біодоступність'),
		drugTestRisk:
			$pageTranslations?.t('cbdTypes.drugTestRisk') ||
			(isEnglish ? 'Drug Test Risk' : 'Ризик тестів'),
		priceRange:
			$pageTranslations?.t('cbdTypes.priceRange') ||
			(isEnglish ? 'Price Range' : 'Ціновий діапазон'),
		feature: $pageTranslations?.t('cbdTypes.feature') || (isEnglish ? 'Feature' : 'Характеристика'),
		none: $pageTranslations?.t('cbdTypes.none') || (isEnglish ? 'None' : 'Немає'),
		maximum: $pageTranslations?.t('cbdTypes.maximum') || (isEnglish ? 'Maximum' : 'Максимальний'),
		high: $pageTranslations?.t('cbdTypes.high') || (isEnglish ? 'High' : 'Високий'),
		veryLow: $pageTranslations?.t('cbdTypes.veryLow') || (isEnglish ? 'Very Low' : 'Дуже низький'),
		allExceptTHC:
			$pageTranslations?.t('cbdTypes.allExceptTHC') ||
			(isEnglish ? 'All except THC' : 'Всі крім THC'),
		faqTitle:
			$pageTranslations?.t('cbdTypes.faqTitle') ||
			(isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'),
		cbdSafetyResearch:
			$pageTranslations?.t('cbdTypes.cbdSafetyResearch') ||
			(isEnglish ? 'CBD Safety & Research' : 'Безпека CBD та дослідження'),
		evidenceBased:
			$pageTranslations?.t('cbdTypes.evidenceBased') ||
			(isEnglish ? 'Evidence-Based' : 'Науково обґрунтовано'),
		cbdDosageGuide:
			$pageTranslations?.t('cbdTypes.cbdDosageGuide') ||
			(isEnglish ? 'CBD Dosage Guide' : 'Посібник з дозування CBD'),
		calculator:
			$pageTranslations?.t('cbdTypes.calculator') || (isEnglish ? 'Calculator' : 'Калькулятор'),
		cbdForDogsGuide:
			$pageTranslations?.t('cbdTypes.cbdForDogsGuide') ||
			(isEnglish ? 'CBD for Dogs: Complete Guide' : 'CBD для собак: повний посібник'),
		canineHealth:
			$pageTranslations?.t('cbdTypes.canineHealth') ||
			(isEnglish ? 'Canine Health' : "Здоров'я собак"),
		cbdForCatsGuide:
			$pageTranslations?.t('cbdTypes.cbdForCatsGuide') ||
			(isEnglish ? 'CBD for Cats: Complete Guide' : 'CBD для котів: повний посібник'),
		felineHealth:
			$pageTranslations?.t('cbdTypes.felineHealth') ||
			(isEnglish ? 'Feline Health' : "Здоров'я котів"),
		veterinaryCBDGuide:
			$pageTranslations?.t('cbdTypes.veterinaryCBDGuide') ||
			(isEnglish ? 'Veterinary CBD Guide' : 'Ветеринарний посібник CBD'),
		professional:
			$pageTranslations?.t('cbdTypes.professional') || (isEnglish ? 'Professional' : 'Професійний'),
		cbdCompleteGuide:
			$pageTranslations?.t('cbdTypes.cbdCompleteGuide') ||
			(isEnglish ? 'CBD Complete Guide' : 'Повний посібник CBD'),
		everythingYouNeed:
			$pageTranslations?.t('cbdTypes.everythingYouNeed') ||
			(isEnglish ? 'Everything you need to know about CBD' : 'Все, що потрібно знати про CBD'),
		comprehensive:
			$pageTranslations?.t('cbdTypes.comprehensive') ||
			(isEnglish ? 'Comprehensive' : 'Комплексний')
	}));

	// Comparison data
	const comparisonData = $derived(
		() =>
			[
				{
					feature: translations.thcContent,
					isolate: '0%',
					fullSpectrum: '≤0.3%',
					broadSpectrum: '0%'
				},
				{
					feature: translations.otherCannabinoids,
					isolate: translations.none,
					fullSpectrum: isEnglish
						? 'All (CBD, THC, CBG, CBN, etc.)'
						: 'Всі (CBD, THC, CBG, CBN тощо)',
					broadSpectrum: translations.allExceptTHC
				},
				{
					feature: translations.entourageEffect,
					isolate: translations.none,
					fullSpectrum: translations.maximum,
					broadSpectrum: translations.high
				},
				{
					feature: translations.bioavailability,
					isolate: '30-35%',
					fullSpectrum: '35-40%',
					broadSpectrum: '32-38%'
				},
				{
					feature: translations.drugTestRisk,
					isolate: translations.none,
					fullSpectrum: translations.veryLow,
					broadSpectrum: translations.none
				},
				{
					feature: translations.priceRange,
					isolate: isEnglish ? '$' : '₴',
					fullSpectrum: isEnglish ? '$$$' : '₴₴₴',
					broadSpectrum: isEnglish ? '$$' : '₴₴'
				}
			] as const
	);
</script>

<SEO title={data.title} description={data.description} />

<main class="cbd-types-main">
	<div class="cbd-types-container">
		<!-- Hero Section -->
		<ArticleHero
			title={data.title}
			description={data.description}
			author={data.author}
			date={data.date}
			readingTime={data.readingTime}
			{lang}
		/>

		<!-- Quick Comparison Section -->
		<section class="cbd-types-comparison-section">
			<div class="cbd-types-comparison-container">
				<h2 class="cbd-types-comparison-title">{translations.comparison}</h2>
				<div class="cbd-types-comparison-table">
					<div class="cbd-types-comparison-header">
						<div class="cbd-types-comparison-feature">
							{translations.feature}
						</div>
						<div class="cbd-types-comparison-type isolate">
							<div class="cbd-types-comparison-type-icon">🧪</div>
							<div class="cbd-types-comparison-type-name">{translations.isolate}</div>
						</div>
						<div class="cbd-types-comparison-type full-spectrum">
							<div class="cbd-types-comparison-type-icon">🌿</div>
							<div class="cbd-types-comparison-type-name">{translations.fullSpectrum}</div>
						</div>
						<div class="cbd-types-comparison-type broad-spectrum">
							<div class="cbd-types-comparison-type-icon">🌱</div>
							<div class="cbd-types-comparison-type-name">{translations.broadSpectrum}</div>
						</div>
					</div>
					{#each comparisonData() as row}
						<div class="cbd-types-comparison-row">
							<div class="cbd-types-comparison-feature">{row.feature}</div>
							<div class="cbd-types-comparison-value isolate">{row.isolate}</div>
							<div class="cbd-types-comparison-value full-spectrum">{row.fullSpectrum}</div>
							<div class="cbd-types-comparison-value broad-spectrum">{row.broadSpectrum}</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- Article Content with Layout -->
		{#if data.content}
			<ArticleLayout toc={tocItems} {keyPoints} {lang} content={data.content} />
		{/if}

		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="cbd-types-faq">
				<h2>{translations.faqTitle}</h2>
				<div class="cbd-types-faq-list">
					{#each data.seoData.faq as faq}
						<div class="cbd-types-faq-item">
							<h3 class="cbd-types-faq-question">{faq.question}</h3>
							<p class="cbd-types-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="cbd-types-related" id="related-articles">
			<h2>{translations.relatedArticles}</h2>
			<div class="cbd-types-related-grid">
				<a href={`${lang}/cbd/safety`} class="cbd-types-related-card">
					<h3>{translations.cbdSafetyResearch}</h3>
					<p>
						{isEnglish
							? 'Safety studies and scientific research on CBD'
							: 'Дослідження безпеки та наукові дані про CBD'}
					</p>
					<span class="card-tag">{translations.evidenceBased}</span>
				</a>

				<a href={`${lang}/cbd/dosage`} class="cbd-types-related-card">
					<h3>{translations.cbdDosageGuide}</h3>
					<p>
						{isEnglish
							? 'Calculate the right CBD dosage for your needs'
							: 'Розрахуйте правильну дозу CBD для ваших потреб'}
					</p>
					<span class="card-tag">{translations.calculator}</span>
				</a>

				<a href={`${lang}/cbd/dogs`} class="cbd-types-related-card">
					<h3>{translations.cbdForDogsGuide}</h3>
					<p>
						{isEnglish
							? 'Scientific guide to CBD therapy for dogs'
							: 'Науковий посібник з CBD терапії для собак'}
					</p>
					<span class="card-tag">{translations.canineHealth}</span>
				</a>

				<a href={`${lang}/cbd/cats`} class="cbd-types-related-card">
					<h3>{translations.cbdForCatsGuide}</h3>
					<p>
						{isEnglish
							? 'Scientific guide to CBD therapy for cats'
							: 'Науковий посібник з CBD терапії для котів'}
					</p>
					<span class="card-tag">{translations.felineHealth}</span>
				</a>

				<a href={`${lang}/veterinary-cbd`} class="cbd-types-related-card">
					<h3>{translations.veterinaryCBDGuide}</h3>
					<p>
						{isEnglish
							? 'Professional veterinary recommendations'
							: 'Професійні ветеринарні рекомендації'}
					</p>
					<span class="card-tag">{translations.professional}</span>
				</a>

				<a href={`${lang}/cbd`} class="cbd-types-related-card">
					<h3>{translations.cbdCompleteGuide}</h3>
					<p>
						{translations.everythingYouNeed}
					</p>
					<span class="card-tag">{translations.comprehensive}</span>
				</a>
			</div>
		</section>
	</div>
</main>

<style>
	.cbd-types-main {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 25%, #f1f5f9 50%, #fefefe 100%);
		padding: 2rem 0;
	}

	.cbd-types-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.cbd-types-hero {
		text-align: center;
		margin-bottom: 4rem;
		padding: 4rem 2rem;
		background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
		color: white;
		border-radius: 24px;
		box-shadow: 0 20px 40px rgba(30, 64, 175, 0.3);
		position: relative;
		overflow: hidden;
	}

	.cbd-types-hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
			repeat;
		opacity: 0.1;
	}

	.cbd-types-hero-content {
		position: relative;
		z-index: 2;
	}

	.cbd-types-title {
		font-size: 3.5rem;
		font-weight: 900;
		margin-bottom: 1.5rem;
		line-height: 1.1;
		text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.cbd-types-subtitle {
		font-size: 1.375rem;
		margin-bottom: 2rem;
		line-height: 1.6;
		opacity: 0.95;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
	}

	.cbd-types-meta {
		display: flex;
		justify-content: center;
		gap: 3rem;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.cbd-types-hero-visual {
		position: relative;
		z-index: 2;
		margin-top: 3rem;
	}

	.cbd-types-comparison-preview {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.cbd-type-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 2rem;
		min-width: 200px;
		text-align: center;
		transition: all 0.3s ease;
	}

	.cbd-type-card:hover {
		transform: translateY(-5px);
		background: rgba(255, 255, 255, 0.15);
	}

	.cbd-type-card .cbd-type-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.cbd-type-card h3 {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.cbd-type-card p {
		font-size: 0.875rem;
		opacity: 0.9;
		margin: 0;
	}

	/* Comparison Section */
	.cbd-types-comparison-section {
		margin: -2rem 0 4rem 0;
		position: relative;
		z-index: 10;
	}

	.cbd-types-comparison-container {
		background: white;
		border-radius: 20px;
		padding: 3rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.cbd-types-comparison-title {
		color: #1e293b;
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
		text-align: center;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.cbd-types-comparison-table {
		background: #f8fafc;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid #e2e8f0;
	}

	.cbd-types-comparison-header {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		font-weight: 600;
	}

	.cbd-types-comparison-header > div {
		padding: 1.5rem 1rem;
		text-align: center;
		border-right: 1px solid rgba(255, 255, 255, 0.2);
	}

	.cbd-types-comparison-header > div:last-child {
		border-right: none;
	}

	.cbd-types-comparison-type {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.cbd-types-comparison-type-icon {
		font-size: 1.5rem;
	}

	.cbd-types-comparison-type-name {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.cbd-types-comparison-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		border-bottom: 1px solid #e2e8f0;
		transition: background-color 0.3s ease;
	}

	.cbd-types-comparison-row:hover {
		background: rgba(59, 130, 246, 0.05);
	}

	.cbd-types-comparison-row:last-child {
		border-bottom: none;
	}

	.cbd-types-comparison-feature {
		padding: 1.25rem 1rem;
		font-weight: 600;
		color: #374151;
		border-right: 1px solid #e2e8f0;
	}

	.cbd-types-comparison-value {
		padding: 1.25rem 1rem;
		text-align: center;
		border-right: 1px solid #e2e8f0;
		font-weight: 500;
	}

	.cbd-types-comparison-value:last-child {
		border-right: none;
	}

	.cbd-types-comparison-value.isolate {
		background: rgba(59, 130, 246, 0.05);
	}

	.cbd-types-comparison-value.full-spectrum {
		background: rgba(34, 197, 94, 0.05);
	}

	.cbd-types-comparison-value.broad-spectrum {
		background: rgba(168, 85, 247, 0.05);
	}

	/* Content Grid */
	.cbd-types-content-grid {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 4rem;
		margin-bottom: 4rem;
	}

	.cbd-types-sidebar {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.cbd-types-toc {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.cbd-types-toc h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.cbd-types-toc nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.cbd-types-toc nav li {
		margin-bottom: 0.75rem;
	}

	.cbd-types-toc nav a {
		color: #64748b;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.3s ease;
		display: block;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.cbd-types-toc nav a:hover {
		color: #3b82f6;
		background: #eff6ff;
		transform: translateX(4px);
	}

	.cbd-types-key-insights {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.1);
	}

	.cbd-types-key-insights h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.insights-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.insight-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		transition: all 0.3s ease;
	}

	.insight-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.insight-icon {
		font-size: 1.5rem;
		min-width: 2rem;
		text-align: center;
	}

	.insight-content h4 {
		color: #1e293b;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.insight-content p {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0;
		line-height: 1.4;
	}

	.cbd-types-research-highlights {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(168, 85, 247, 0.1);
	}

	.cbd-types-research-highlights h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.research-highlights {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.research-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-radius: 12px;
		border: 1px solid #e2e8f0;
		position: relative;
	}

	.research-item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		border-radius: 2px 0 0 2px;
	}

	.research-year {
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		font-weight: 700;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.875rem;
		min-width: 60px;
		text-align: center;
	}

	.research-content h4 {
		color: #1e293b;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.research-content p {
		color: #64748b;
		font-size: 0.875rem;
		margin: 0;
		line-height: 1.4;
	}

	.cbd-types-article {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.cbd-types-content {
		padding: 4rem;
		line-height: 1.8;
	}

	.cbd-types-content :global(h2) {
		color: #1e293b;
		font-size: 2.25rem;
		font-weight: 800;
		margin: 4rem 0 2rem 0;
		border-bottom: 4px solid #3b82f6;
		padding-bottom: 1rem;
		scroll-margin-top: 2rem;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.cbd-types-content :global(h3) {
		color: #374151;
		font-size: 1.75rem;
		font-weight: 700;
		margin: 3rem 0 1.5rem 0;
		scroll-margin-top: 2rem;
		border-left: 4px solid #10b981;
		padding-left: 1rem;
	}

	.cbd-types-content :global(h4) {
		color: #4b5563;
		font-size: 1.375rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.5rem;
	}

	.cbd-types-content :global(p) {
		margin-bottom: 1.75rem;
		color: #475569;
		font-size: 1.0625rem;
		line-height: 1.7;
	}

	.cbd-types-content :global(ul) {
		margin: 2rem 0;
		padding-left: 2.5rem;
	}

	.cbd-types-content :global(li) {
		margin-bottom: 0.875rem;
		color: #475569;
		font-size: 1.0625rem;
		position: relative;
	}

	.cbd-types-content :global(li::marker) {
		color: #3b82f6;
		font-weight: bold;
	}

	.cbd-types-content :global(blockquote) {
		border-left: 6px solid #3b82f6;
		padding: 2rem 2.5rem;
		margin: 3rem 0;
		background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
		border-radius: 0 12px 12px 0;
		font-style: italic;
		color: #1e293b;
		font-size: 1.125rem;
		line-height: 1.6;
		position: relative;
	}

	.cbd-types-content :global(blockquote::before) {
		content: '"';
		font-size: 4rem;
		color: #3b82f6;
		opacity: 0.2;
		position: absolute;
		top: -10px;
		left: 15px;
		font-family: serif;
	}

	/* Links styling */
	.cbd-types-article-content :global(a) {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.cbd-types-article-content :global(a:hover) {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	.cbd-types-faq {
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-radius: 20px;
		padding: 4rem;
		margin-bottom: 4rem;
		border: 1px solid #e2e8f0;
	}

	.cbd-types-faq h2 {
		color: #1e293b;
		font-size: 2.75rem;
		font-weight: 800;
		margin-bottom: 3rem;
		text-align: center;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.cbd-types-faq-list {
		display: grid;
		gap: 2rem;
	}

	.cbd-types-faq-item {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 2.5rem;
		transition: all 0.3s ease;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.cbd-types-faq-item:hover {
		border-color: #3b82f6;
		box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
		transform: translateY(-2px);
	}

	.cbd-types-faq-question {
		color: #1e293b;
		font-size: 1.375rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.4;
	}

	.cbd-types-faq-answer {
		color: #64748b;
		line-height: 1.7;
		font-size: 1.0625rem;
		margin: 0;
	}

	.cbd-types-related {
		background: white;
		border-radius: 20px;
		padding: 4rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.cbd-types-related h2 {
		color: #1e293b;
		font-size: 2.75rem;
		font-weight: 800;
		margin-bottom: 3rem;
		text-align: center;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.cbd-types-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2.5rem;
	}

	.cbd-types-related-card {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 2.5rem;
		text-decoration: none;
		transition: all 0.3s ease;
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		position: relative;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.cbd-types-related-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.cbd-types-related-card:hover {
		border-color: #3b82f6;
		background: white;
		transform: translateY(-6px);
		box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
	}

	.cbd-types-related-card:hover::before {
		opacity: 1;
	}

	.cbd-types-related-card h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
		line-height: 1.4;
		position: relative;
		z-index: 2;
	}

	.cbd-types-related-card p {
		color: #64748b;
		font-size: 0.9375rem;
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
		position: relative;
		z-index: 2;
	}

	.card-tag {
		display: inline-block;
		padding: 0.375rem 1rem;
		background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 50px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		position: relative;
		z-index: 2;
	}

	@media (max-width: 1200px) {
		.cbd-types-content-grid {
			grid-template-columns: 300px 1fr;
			gap: 3rem;
		}
		.cbd-types-comparison-header {
			grid-template-columns: 2fr 1fr 1fr 1fr;
		}
		.cbd-types-comparison-row {
			grid-template-columns: 2fr 1fr 1fr 1fr;
		}
	}

	@media (max-width: 1024px) {
		.cbd-types-title {
			font-size: 2.75rem;
		}
		.cbd-types-subtitle {
			font-size: 1.25rem;
		}
		.cbd-types-meta {
			flex-direction: column;
			gap: 1rem;
		}
		.cbd-types-content {
			padding: 3rem 2rem;
		}
		.cbd-types-comparison-container {
			padding: 2rem;
		}
		.cbd-types-faq {
			padding: 3rem 2rem;
		}
		.cbd-types-related {
			padding: 3rem 2rem;
		}
	}

	@media (max-width: 768px) {
		.cbd-types-content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		.cbd-types-sidebar {
			position: static;
		}
		.cbd-types-title {
			font-size: 2.25rem;
		}
		.cbd-types-hero {
			padding: 3rem 1.5rem;
		}
		.cbd-types-meta {
			gap: 1.5rem;
		}
		.cbd-types-comparison-preview {
			flex-direction: column;
			align-items: center;
		}
		.cbd-types-comparison-header {
			display: none;
		}
		.cbd-types-comparison-row {
			grid-template-columns: 1fr;
			border-bottom: 1px solid #e2e8f0;
		}
		.cbd-types-comparison-row .cbd-types-comparison-feature {
			font-weight: 700;
			background: #f8fafc;
			border-right: none;
		}
		.cbd-types-comparison-value {
			display: grid;
			grid-template-columns: 1fr 2fr;
			border-right: none;
		}
		.cbd-types-comparison-value::before {
			content: attr(data-label);
			font-weight: 600;
			color: #374151;
		}
		.cbd-types-related-grid {
			grid-template-columns: 1fr;
		}
		.cbd-types-toc {
			padding: 2rem;
		}
		.cbd-types-key-insights {
			padding: 2rem;
		}
		.cbd-types-research-highlights {
			padding: 2rem;
		}
		.cbd-types-article {
			border-radius: 16px;
		}
		.cbd-types-content {
			padding: 2rem 1.5rem;
		}
		.cbd-types-faq {
			padding: 2rem 1.5rem;
		}
		.cbd-types-related {
			padding: 2rem 1.5rem;
		}
	}
</style>
