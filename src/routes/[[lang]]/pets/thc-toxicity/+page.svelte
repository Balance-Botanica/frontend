<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { page } from '$app/stores';

	// Получаем данные из load функции
	const { data } = $props();

	// Определяем язык
	const lang = $derived($page.params?.lang || 'uk-ua');
	const isEnglish = $derived(lang === 'en');

	// Переводы для элементов интерфейса
	const translations = {
		learnMore: isEnglish ? 'Learn More' : 'Узнать больше',
		relatedArticles: isEnglish ? 'Related Articles' : 'Связанные статьи',
		backToMain: isEnglish ? 'Back to CBD Guide' : 'Назад до CBD гайда'
	};
</script>

<SEO title={data.title} description={data.description} locale={lang} />

<main class="thc-toxicity-main">
	<div class="thc-toxicity-container">
		<!-- Breadcrumb -->
		<nav class="breadcrumb">
			<a href="/{lang}/cbd" class="breadcrumb-link">{translations.backToMain}</a>
			<span class="breadcrumb-separator">→</span>
			<span class="breadcrumb-current">{isEnglish ? 'THC Toxicity' : 'THC токсичність'}</span>
		</nav>

		<!-- Hero Section -->
		<header class="thc-toxicity-hero">
			<h1 class="thc-toxicity-title">{data.title}</h1>
			<p class="thc-toxicity-subtitle">{data.description}</p>
		</header>

		<!-- Article Content from Markdown -->
		{#if data.content}
			<div class="thc-toxicity-article-content">
				{@html data.content}
			</div>
		{/if}

		<!-- FAQ Section -->
		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="thc-toxicity-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="thc-toxicity-faq-list">
					{#each data.seoData.faq as faq}
						<div class="thc-toxicity-faq-item">
							<h3 class="thc-toxicity-faq-question">{faq.question}</h3>
							<p class="thc-toxicity-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Related Articles -->
		<section class="thc-toxicity-related">
			<h2>{translations.relatedArticles}</h2>
			<div class="thc-toxicity-related-grid">
				<div class="thc-toxicity-related-card">
					<h3>{isEnglish ? 'CBD Safety Guide' : 'Безпека CBD'}</h3>
					<p>
						{isEnglish
							? 'Learn about CBD product safety and quality standards'
							: 'Дізнайтеся про безпеку CBD продуктів та стандарти якості'}
					</p>
					<a href="/{lang}/cbd/safety/" class="thc-toxicity-link">{translations.learnMore} →</a>
				</div>
				<div class="thc-toxicity-related-card">
					<h3>{isEnglish ? 'CBD for Dogs' : 'CBD для собак'}</h3>
					<p>
						{isEnglish
							? 'Safe CBD use guidelines for dogs'
							: 'Рекомендації по безпечному використанню CBD для собак'}
					</p>
					<a href="/{lang}/cbd/dogs/" class="thc-toxicity-link">{translations.learnMore} →</a>
				</div>
				<div class="thc-toxicity-related-card">
					<h3>{isEnglish ? 'CBD for Cats' : 'CBD для котів'}</h3>
					<p>
						{isEnglish
							? 'Safe CBD use guidelines for cats'
							: 'Рекомендації по безпечному використанню CBD для котів'}
					</p>
					<a href="/{lang}/cbd/cats/" class="thc-toxicity-link">{translations.learnMore} →</a>
				</div>
				<div class="thc-toxicity-related-card">
					<h3>{isEnglish ? 'CBD Types' : 'Види CBD'}</h3>
					<p>
						{isEnglish
							? 'Understanding different CBD forms and their safety'
							: 'Розуміння різних форм CBD та їх безпека'}
					</p>
					<a href="/{lang}/cbd/types/" class="thc-toxicity-link">{translations.learnMore} →</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.thc-toxicity-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.thc-toxicity-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* Breadcrumb */
	.breadcrumb {
		margin-bottom: 24px;
		font-size: 14px;
	}

	.breadcrumb-link {
		color: #4b766e;
		text-decoration: none;
		font-weight: 500;
	}

	.breadcrumb-link:hover {
		text-decoration: underline;
	}

	.breadcrumb-separator {
		margin: 0 8px;
		color: #666;
	}

	.breadcrumb-current {
		color: #666;
		font-weight: 500;
	}

	/* Hero Section */
	.thc-toxicity-hero {
		text-align: center;
		margin-bottom: 48px;
		padding: 40px 20px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.thc-toxicity-title {
		font-family: 'Nunito', sans-serif;
		font-size: 42px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.thc-toxicity-subtitle {
		font-size: 18px;
		color: #666;
		margin: 0;
		font-weight: 400;
		line-height: 1.6;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Article content from markdown */
	.thc-toxicity-article {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
		line-height: 1.6;
	}

	.thc-toxicity-article h1,
	.thc-toxicity-article h2,
	.thc-toxicity-article h3,
	.thc-toxicity-article h4 {
		color: #1a1a1a;
		font-family: 'Nunito', sans-serif;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.thc-toxicity-article h1 {
		font-size: 36px;
		font-weight: 700;
		border-bottom: 3px solid #4b766e;
		padding-bottom: 12px;
		margin-top: 0;
	}

	.thc-toxicity-article h2 {
		font-size: 28px;
		font-weight: 600;
		border-bottom: 2px solid #4b766e;
		padding-bottom: 8px;
	}

	.thc-toxicity-article h3 {
		font-size: 24px;
		font-weight: 600;
	}

	.thc-toxicity-article p {
		font-size: 16px;
		color: #333;
		margin: 0 0 16px 0;
		line-height: 1.7;
	}

	.thc-toxicity-article ul,
	.thc-toxicity-article ol {
		margin: 16px 0;
		padding-left: 24px;
	}

	.thc-toxicity-article li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.thc-toxicity-article strong {
		font-weight: 600;
		color: #1a1a1a;
	}

	.thc-toxicity-article blockquote {
		border-left: 4px solid #4b766e;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
		background: #f8f9fa;
		padding: 16px 20px;
		border-radius: 0 8px 8px 0;
	}

	.thc-toxicity-article-content a {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.thc-toxicity-article-content a:hover {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	/* Warning boxes for important information */
	.thc-toxicity-article .warning {
		background: #fff3cd;
		border: 1px solid #ffeaa7;
		border-left: 4px solid #f39c12;
		padding: 16px 20px;
		margin: 20px 0;
		border-radius: 0 8px 8px 0;
	}

	.thc-toxicity-article .danger {
		background: #fadbd8;
		border: 1px solid #f5c6cb;
		border-left: 4px solid #e74c3c;
		padding: 16px 20px;
		margin: 20px 0;
		border-radius: 0 8px 8px 0;
	}

	/* FAQ Section */
	.thc-toxicity-faq {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.thc-toxicity-faq h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.thc-toxicity-faq-list {
		display: grid;
		gap: 16px;
	}

	.thc-toxicity-faq-item {
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.2s ease;
	}

	.thc-toxicity-faq-item:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.thc-toxicity-faq-question {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.thc-toxicity-faq-answer {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Related Articles */
	.thc-toxicity-related {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-top: 32px;
	}

	.thc-toxicity-related h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.thc-toxicity-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.thc-toxicity-related-card {
		padding: 24px;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.thc-toxicity-related-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.thc-toxicity-related-card h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.thc-toxicity-related-card p {
		font-size: 14px;
		color: #666;
		margin: 0 0 16px 0;
		line-height: 1.5;
	}

	.thc-toxicity-link {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	.thc-toxicity-link:hover {
		color: #3a5d56;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.thc-toxicity-title {
			font-size: 32px;
		}

		.thc-toxicity-subtitle {
			font-size: 16px;
		}

		.thc-toxicity-article,
		.thc-toxicity-faq,
		.thc-toxicity-related {
			padding: 24px 20px;
		}

		.thc-toxicity-article h1 {
			font-size: 28px;
		}

		.thc-toxicity-article h2 {
			font-size: 24px;
		}

		.thc-toxicity-related-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.thc-toxicity-faq-list {
			grid-template-columns: 1fr;
		}

		.breadcrumb {
			font-size: 12px;
		}
	}
</style>
