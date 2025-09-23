<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import { page } from '$app/stores';
	import type { SupportedLocale } from '$lib/i18n/types';
	import { createPageTranslations } from '$lib/i18n/store';

	// Получаем данные из load функции
	const { data } = $props();

	// Определяем язык
	const lang = $derived(($page.params?.lang || 'uk-ua') as SupportedLocale);
	const isEnglish = $derived(lang === 'en');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived($pageTranslations?.pillarArticles.dogHealth.keyPoints || []);
</script>

<SEO title={data.title} description={data.description} />

<main class="dog-health-main">
	<div class="dog-health-container">
		<!-- Hero Section -->
		<ArticleHero
			title={data.title}
			description={data.description}
			author={data.author}
			date={data.date}
			readingTime={data.readingTime}
			{lang}
		/>

		<!-- Article Content with Layout -->
		{#if data.content}
			<ArticleLayout toc={tocItems} {keyPoints} {lang} content={data.content} />
		{/if}

		<!-- FAQ Section -->
		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="dog-health-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="dog-health-faq-list">
					{#each data.seoData.faq as faq, index (index)}
						<div class="dog-health-faq-item">
							<h3 class="dog-health-faq-question">{faq.question}</h3>
							<p class="dog-health-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Related Articles -->
		<section class="dog-health-related">
			<h2>{pageTranslations.relatedArticles}</h2>
			<div class="dog-health-related-grid">
				<div class="dog-health-related-card">
					<h3>{isEnglish ? 'CBD for Dogs' : 'CBD для собак'}</h3>
					<p>
						{isEnglish
							? 'Natural CBD supplements for dog health and wellness'
							: "Натуральні CBD добавки для здоров'я та благополуччя собак"}
					</p>
					<a href="/{lang}/knowledgebase/cbd/dogs/" class="dog-health-link"
						>{translations.learnMore} →</a
					>
				</div>
				<div class="dog-health-related-card">
					<h3>{isEnglish ? 'Gelatin for Dogs' : 'Желатин для собак'}</h3>
					<p>
						{isEnglish
							? 'Natural joint support and health benefits'
							: "Натуральна підтримка суглобів та користь для здоров'я"}
					</p>
					<a href="/{lang}/dogs/gelatin/" class="dog-health-link">{translations.learnMore} →</a>
				</div>
				<div class="dog-health-related-card">
					<h3>{isEnglish ? 'Turmeric for Dogs' : 'Куркума для собак'}</h3>
					<p>
						{isEnglish
							? 'Natural anti-inflammatory and health benefits'
							: "Натуральні протизапальні властивості та користь для здоров'я"}
					</p>
					<a href="/{lang}/dogs/turmeric/" class="dog-health-link">{translations.learnMore} →</a>
				</div>
				<div class="dog-health-related-card">
					<h3>{isEnglish ? 'Arthritis in Dogs' : 'Артрит у собак'}</h3>
					<p>
						{isEnglish
							? 'Natural approaches to managing joint health'
							: "Натуральні підходи до управління здоров'ям суглобів"}
					</p>
					<a href="/{lang}/dogs/arthritis/" class="dog-health-link">{translations.learnMore} →</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.dog-health-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.dog-health-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.dog-health-hero {
		text-align: center;
		margin-bottom: 48px;
	}

	.dog-health-title {
		font-family: 'Nunito', sans-serif;
		font-size: 48px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.dog-health-subtitle {
		font-size: 20px;
		color: #666;
		margin: 0;
		font-weight: 400;
	}

	/* Article content from markdown */
	.dog-health-article {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
		line-height: 1.6;
	}

	.dog-health-article h1,
	.dog-health-article h2,
	.dog-health-article h3,
	.dog-health-article h4 {
		color: #1a1a1a;
		font-family: 'Nunito', sans-serif;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.dog-health-article h1 {
		font-size: 36px;
		font-weight: 700;
		border-bottom: 3px solid #4b766e;
		padding-bottom: 12px;
		margin-top: 0;
	}

	.dog-health-article h2 {
		font-size: 28px;
		font-weight: 600;
		border-bottom: 2px solid #4b766e;
		padding-bottom: 8px;
	}

	.dog-health-article h3 {
		font-size: 24px;
		font-weight: 600;
	}

	.dog-health-article p {
		font-size: 16px;
		color: #333;
		margin: 0 0 16px 0;
		line-height: 1.7;
	}

	.dog-health-article ul,
	.dog-health-article ol {
		margin: 16px 0;
		padding-left: 24px;
	}

	.dog-health-article li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.dog-health-article strong {
		font-weight: 600;
		color: #1a1a1a;
	}

	.dog-health-article blockquote {
		border-left: 4px solid #4b766e;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
	}

	/* Links styling */
	.dog-health-article-content a {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.dog-health-article-content a:hover {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	/* FAQ Section */
	.dog-health-faq {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.dog-health-faq h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.dog-health-faq-list {
		display: grid;
		gap: 16px;
	}

	.dog-health-faq-item {
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.2s ease;
	}

	.dog-health-faq-item:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.dog-health-faq-question {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.dog-health-faq-answer {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Related Articles */
	.dog-health-related {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-top: 32px;
	}

	.dog-health-related h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.dog-health-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.dog-health-related-card {
		padding: 24px;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.dog-health-related-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.dog-health-related-card h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.dog-health-related-card p {
		font-size: 14px;
		color: #666;
		margin: 0 0 16px 0;
		line-height: 1.5;
	}

	.dog-health-link {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	.dog-health-link:hover {
		color: #3a5d56;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.dog-health-title {
			font-size: 36px;
		}

		.dog-health-subtitle {
			font-size: 18px;
		}

		.dog-health-article,
		.dog-health-faq,
		.dog-health-related {
			padding: 24px 20px;
		}

		.dog-health-article h1 {
			font-size: 28px;
		}

		.dog-health-article h2 {
			font-size: 24px;
		}

		.dog-health-related-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.dog-health-faq-list {
			grid-template-columns: 1fr;
		}
	}
</style>
