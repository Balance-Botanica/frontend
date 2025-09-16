<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import { page } from '$app/stores';

	// Получаем данные из load функции
	const { data } = $props();

	// Определяем язык
	const lang = $derived($page.params?.lang || 'uk-ua');
	const isEnglish = $derived(lang === 'en');

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived([
		isEnglish
			? 'Evidence-based research and clinical studies'
			: 'Доказові дослідження та клінічні випробування',
		isEnglish
			? 'Safe for dogs and cats with proper dosing'
			: 'Безпечний для собак та котів при правильному дозуванні',
		isEnglish
			? 'Natural pain relief and anti-inflammatory effects'
			: 'Натуральне знеболення та протизапальні ефекти',
		isEnglish ? 'Supported by veterinary science' : 'Підтримується ветеринарною наукою'
	]);

	// Переводы для элементов интерфейса
	const translations = $derived({
		learnMore: isEnglish ? 'Learn More' : 'Узнать больше',
		relatedArticles: isEnglish ? 'Related Articles' : 'Связанные статьи'
	});
</script>

<SEO title={data.title} description={data.description} locale={lang} />

<main class="cbd-main">
	<div class="cbd-container">
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
			<section class="cbd-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="cbd-faq-list">
					{#each data.seoData.faq as faq}
						<div class="cbd-faq-item">
							<h3 class="cbd-faq-question">{faq.question}</h3>
							<p class="cbd-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Related Articles -->
		<section class="cbd-related">
			<h2>{translations.relatedArticles}</h2>
			<div class="cbd-related-grid">
				<div class="cbd-related-card">
					<h3>{isEnglish ? 'CBD for Cats' : 'CBD для котів'}</h3>
					<p>
						{isEnglish
							? 'Detailed guide to using CBD for cats'
							: 'Детальний посібник з використання CBD для котів'}
					</p>
					<a href="/{lang}/cbd/cats/" class="cbd-link">{translations.learnMore} →</a>
				</div>
				<div class="cbd-related-card">
					<h3>{isEnglish ? 'CBD for Dogs' : 'CBD для собак'}</h3>
					<p>
						{isEnglish
							? 'Detailed guide to using CBD for dogs'
							: 'Детальний посібник з використання CBD для собак'}
					</p>
					<a href="/{lang}/cbd/dogs/" class="cbd-link">{translations.learnMore} →</a>
				</div>
				<div class="cbd-related-card">
					<h3>{isEnglish ? 'CBD Types' : 'Види CBD'}</h3>
					<p>
						{isEnglish
							? 'Difference between isolate, distillate and full spectrum'
							: 'Різниця між ізолятом, дистилятом та full spectrum'}
					</p>
					<a href="/{lang}/cbd/types/" class="cbd-link">{translations.learnMore} →</a>
				</div>
				<div class="cbd-related-card">
					<h3>{isEnglish ? 'CBD Dosage' : 'Дозування CBD'}</h3>
					<p>
						{isEnglish
							? 'How to calculate the right dose for your pet'
							: 'Як правильно розрахувати дозу для вашого улюбленця'}
					</p>
					<a href="/{lang}/cbd/dosage/" class="cbd-link">{translations.learnMore} →</a>
				</div>
			</div>
		</section>
	</div>
</main>

<style>
	.cbd-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.cbd-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	/* Article content from markdown */
	.cbd-article {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
		line-height: 1.6;
	}

	.cbd-article-content {
		line-height: 1.7;
	}

	.cbd-article-content :global(h1),
	.cbd-article-content :global(h2),
	.cbd-article-content :global(h3),
	.cbd-article-content :global(h4) {
		color: #1a1a1a;
		font-family: 'Nunito', sans-serif;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.cbd-article-content :global(h1) {
		font-size: 36px;
		font-weight: 700;
		border-bottom: 3px solid #4b766e;
		padding-bottom: 12px;
		margin-top: 0;
	}

	.cbd-article-content :global(h2) {
		font-size: 28px;
		font-weight: 600;
		border-bottom: 2px solid #4b766e;
		padding-bottom: 8px;
	}

	.cbd-article-content :global(h3) {
		font-size: 24px;
		font-weight: 600;
	}

	.cbd-article-content :global(p) {
		font-size: 16px;
		color: #333;
		margin: 0 0 16px 0;
		line-height: 1.7;
	}

	.cbd-article-content :global(ul),
	.cbd-article-content :global(ol) {
		margin: 16px 0;
		padding-left: 24px;
	}

	.cbd-article-content :global(li) {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.cbd-article-content :global(strong) {
		font-weight: 600;
		color: #1a1a1a;
	}

	.cbd-article-content :global(blockquote) {
		border-left: 4px solid #4b766e;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
	}

	/* Removed duplicate styles - now using :global() selectors in .cbd-article-content */

	.cbd-article-content :global(a) {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.cbd-article-content :global(a:hover) {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	.cbd-article blockquote {
		border-left: 4px solid #4b766e;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
	}

	/* FAQ Section */
	.cbd-faq {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
	}

	.cbd-faq h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.cbd-faq-list {
		display: grid;
		gap: 16px;
	}

	.cbd-faq-item {
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 20px;
		transition: box-shadow 0.2s ease;
	}

	.cbd-faq-item:hover {
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	}

	.cbd-faq-question {
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.cbd-faq-answer {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0;
	}

	/* Related Articles */
	.cbd-related {
		background: white;
		padding: 32px;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-top: 32px;
	}

	.cbd-related h2 {
		font-size: 28px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 24px 0;
		text-align: center;
	}

	.cbd-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.cbd-related-card {
		padding: 24px;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.cbd-related-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.cbd-related-card h3 {
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 12px 0;
	}

	.cbd-related-card p {
		font-size: 14px;
		color: #666;
		margin: 0 0 16px 0;
		line-height: 1.5;
	}

	.cbd-link {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	.cbd-link:hover {
		color: #3a5d56;
		text-decoration: underline;
	}

	@media (max-width: 768px) {
		.cbd-title {
			font-size: 36px;
		}

		.cbd-subtitle {
			font-size: 18px;
		}

		.cbd-article,
		.cbd-faq,
		.cbd-related {
			padding: 24px 20px;
		}

		.cbd-article h1 {
			font-size: 28px;
		}

		.cbd-article h2 {
			font-size: 24px;
		}

		.cbd-related-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.cbd-faq-list {
			grid-template-columns: 1fr;
		}
	}
</style>
