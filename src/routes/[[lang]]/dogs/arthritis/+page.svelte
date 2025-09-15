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
		backToMain: isEnglish ? 'Back to Dog Health' : 'Назад до здоров\'я собак'
	};
</script>

<SEO
	title={data.title}
	description={data.description}
	locale={lang}
/>

<main class="dog-arthritis-main">
	<div class="dog-arthritis-container">
		<!-- Breadcrumb -->
		<nav class="breadcrumb">
			<a href="/{lang}/dog-health" class="breadcrumb-link">{translations.backToMain}</a>
			<span class="breadcrumb-separator">→</span>
			<span class="breadcrumb-current">{isEnglish ? 'Arthritis Treatment' : 'Лікування артриту'}</span>
		</nav>

		<!-- Hero Section -->
		<header class="dog-arthritis-hero">
			<h1 class="dog-arthritis-title">{data.title}</h1>
			<p class="dog-arthritis-subtitle">{data.description}</p>
		</header>

		<!-- Article Content from Markdown -->
		{#if data.content}
			<div class="dog-arthritis-article-content">
				{@html data.content}
			</div>
		{/if}

		<!-- FAQ Section -->
		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="dog-arthritis-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="dog-arthritis-faq-list">
					{#each data.seoData.faq as faq}
						<div class="dog-arthritis-faq-item">
							<h3 class="dog-arthritis-faq-question">{faq.question}</h3>
							<p class="dog-arthritis-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Related Articles -->
		<section class="dog-arthritis-related">
			<h2>{translations.relatedArticles}</h2>
			<div class="dog-arthritis-related-grid">
				<div class="dog-arthritis-related-card">
					<h3>{isEnglish ? 'CBD for Dogs' : 'CBD для собак'}</h3>
					<p>{isEnglish ? 'Learn about CBD therapy for arthritis and joint pain' : 'Дізнайтеся про CBD терапію при артриті та болю в суглобах'}</p>
					<a href="/{lang}/cbd/dogs/" class="dog-arthritis-link">{translations.learnMore} →</a>
				</div>
				<div class="dog-arthritis-related-card">
					<h3>{isEnglish ? 'Joint Supplements' : 'Добавки для суглобів'}</h3>
					<p>{isEnglish ? 'Natural supplements for joint health' : 'Натуральні добавки для здоров\'я суглобів'}</p>
					<a href="/{lang}/dogs/gelatin/" class="dog-arthritis-link">{translations.learnMore} →</a>
				</div>
				<div class="dog-arthritis-related-card">
					<h3>{isEnglish ? 'Senior Dog Care' : 'Догляд за літніми собаками'}</h3>
					<p>{isEnglish ? 'Special care tips for older dogs' : 'Особливі поради по догляду за літніми собаками'}</p>
					<a href="/{lang}/dog-health/" class="dog-arthritis-link">{translations.learnMore} →</a>
				</div>
				<div class="dog-arthritis-related-card">
					<h3>{isEnglish ? 'Weight Management' : 'Контроль ваги'}</h3>
					<p>{isEnglish ? 'Importance of weight control for joint health' : 'Важливість контролю ваги для здоров\'я суглобів'}</p>
					<a href="/{lang}/dog-health/" class="dog-arthritis-link">{translations.learnMore} →</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.dog-arthritis-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.dog-arthritis-container {
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
		color: #4B766E;
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
	.dog-arthritis-hero {
		text-align: center;
		margin-bottom: 48px;
	}

	.dog-arthritis-title {
		font-family: 'Nunito', sans-serif;
		font-size: 42px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.dog-arthritis-subtitle {
		font-size: 18px;
		color: #666;
		margin: 0;
		font-weight: 400;
		line-height: 1.6;
		max-width: 800px;
		margin: 0 auto;
	}

	/* Article content from markdown */
	.dog-arthritis-article {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
		line-height: 1.6;
	}

	.dog-arthritis-article h1,
	.dog-arthritis-article h2,
	.dog-arthritis-article h3,
	.dog-arthritis-article h4 {
		color: #1a1a1a;
		font-family: 'Nunito', sans-serif;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.dog-arthritis-article h1 {
		font-size: 36px;
		font-weight: 700;
		border-bottom: 3px solid #4B766E;
		padding-bottom: 12px;
		margin-top: 0;
	}

	.dog-arthritis-article h2 {
		font-size: 28px;
		font-weight: 600;
		border-bottom: 2px solid #4B766E;
		padding-bottom: 8px;
	}

	.dog-arthritis-article h3 {
		font-size: 24px;
		font-weight: 600;
	}

	.dog-arthritis-article p {
		font-size: 16px;
		color: #333;
		margin: 0 0 16px 0;
		line-height: 1.7;
	}

	.dog-arthritis-article ul,
	.dog-arthritis-article ol {
		margin: 16px 0;
		padding-left: 24px;
	}

	.dog-arthritis-article li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.dog-arthritis-article strong {
		font-weight: 600;
		color: #1a1a1a;
	}

	.dog-arthritis-article blockquote {
		border-left: 4px solid #4B766E;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
		background: #f8f9fa;
		padding: 16px 20px;
		border-radius: 0 8px 8px 0;
	}

	.dog-arthritis-article-content a {
		color: #4B766E;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.dog-arthritis-article-content a:hover {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	/* FAQ Section */
	.dog-arthritis-faq {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.dog-arthritis-faq h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.dog-arthritis-faq-list {
		display: grid;
		gap: 16px;
	}

	.dog-arthritis-faq-item {
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.2s ease;
	}

	.dog-arthritis-faq-item:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.dog-arthritis-faq-question {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.dog-arthritis-faq-answer {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Related Articles */
	.dog-arthritis-related {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-top: 32px;
	}

	.dog-arthritis-related h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.dog-arthritis-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.dog-arthritis-related-card {
		padding: 24px;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.dog-arthritis-related-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.dog-arthritis-related-card h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.dog-arthritis-related-card p {
		font-size: 14px;
		color: #666;
		margin: 0 0 16px 0;
		line-height: 1.5;
	}

	.dog-arthritis-link {
		color: #4B766E;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	.dog-arthritis-link:hover {
		color: #3a5d56;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.dog-arthritis-title {
			font-size: 32px;
		}

		.dog-arthritis-subtitle {
			font-size: 16px;
		}

		.dog-arthritis-article,
		.dog-arthritis-faq,
		.dog-arthritis-related {
			padding: 24px 20px;
		}

		.dog-arthritis-article h1 {
			font-size: 28px;
		}

		.dog-arthritis-article h2 {
			font-size: 24px;
		}

		.dog-arthritis-related-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.dog-arthritis-faq-list {
			grid-template-columns: 1fr;
		}

		.breadcrumb {
			font-size: 12px;
		}
	}
</style>
