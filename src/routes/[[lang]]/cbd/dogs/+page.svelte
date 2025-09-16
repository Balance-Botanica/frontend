<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import type { SupportedLocale } from '$lib/i18n/types';
	import { page } from '$app/stores';

	const { data } = $props();
	const lang = $derived(($page.params?.lang || 'uk-ua') as SupportedLocale);
	const isEnglish = $derived(lang === 'en');

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived([
		isEnglish ? 'Clinically proven effective for dogs' : 'Клінічно доведена ефективність для собак',
		isEnglish ? 'Well tolerated by canine patients' : 'Добре переноситься собаками',
		isEnglish
			? 'Natural pain relief and mobility support'
			: 'Натуральне знеболення та підтримка рухливості',
		isEnglish ? 'Evidence-based veterinary recommendations' : 'Доказові ветеринарні рекомендації'
	]);

	const translations = $derived({
		learnMore: isEnglish ? 'Learn More' : 'Дізнатися більше',
		relatedArticles: isEnglish ? 'Related Articles' : "Пов'язані статті"
	});
</script>

<SEO title={data.title} description={data.description} locale={lang} />

<main class="cbd-dogs-main">
	<div class="cbd-dogs-container">
		<ArticleHero
			title={data.title}
			description={data.description}
			author={data.author}
			date={data.date}
			readingTime={data.readingTime}
			{lang}
		/>

		{#if data.content}
			<ArticleLayout toc={tocItems} {keyPoints} {lang} content={data.content} />
		{/if}

		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="cbd-dogs-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="cbd-dogs-faq-list">
					{#each data.seoData.faq as faq}
						<div class="cbd-dogs-faq-item">
							<h3 class="cbd-dogs-faq-question">{faq.question}</h3>
							<p class="cbd-dogs-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="cbd-dogs-related" id="related-articles">
			<h2>{translations.relatedArticles}</h2>
			<div class="cbd-dogs-related-grid">
				<a href={`${lang}/knowledgebase/cbd`} class="cbd-dogs-related-card">
					<h3>{isEnglish ? 'CBD for Pets' : 'CBD для тварин'}</h3>
					<p>{isEnglish ? 'Complete scientific guide' : 'Повний науковий посібник'}</p>
				</a>

				<a href={`${lang}/knowledgebase/cbd/types`} class="cbd-dogs-related-card">
					<h3>{isEnglish ? 'CBD Types' : 'Види CBD'}</h3>
					<p>{isEnglish ? 'Isolate vs Full Spectrum' : 'Ізолят чи повний спектр'}</p>
				</a>

				<a href={`${lang}/dog-health`} class="cbd-dogs-related-card">
					<h3>{isEnglish ? 'Dog Health Guide' : "Посібник з здоров'я собак"}</h3>
					<p>{isEnglish ? 'Comprehensive care tips' : 'Комплексні поради з догляду'}</p>
				</a>
			</div>
		</section>
	</div>
</main>

<style>
	.cbd-dogs-main {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
		padding: 2rem 0;
	}

	.cbd-dogs-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.cbd-dogs-faq {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		margin-bottom: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cbd-dogs-faq h2 {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cbd-dogs-faq-list {
		display: grid;
		gap: 1.5rem;
	}

	.cbd-dogs-faq-item {
		background: #f8fafc;
		padding: 1.5rem;
		border-radius: 12px;
		border-left: 4px solid rgb(75, 118, 110);
	}

	.cbd-dogs-faq-question {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.cbd-dogs-faq-answer {
		color: #64748b;
		line-height: 1.6;
		margin: 0;
	}

	.cbd-dogs-related {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.cbd-dogs-related h2 {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
	}

	.cbd-dogs-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.cbd-dogs-related-card {
		display: block;
		background: #f8fafc;
		padding: 2rem;
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.3s ease;
		border: 1px solid transparent;
	}

	.cbd-dogs-related-card:hover {
		background: white;
		border-color: rgb(75, 118, 110);
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(75, 118, 110, 0.15);
	}

	.cbd-dogs-related-card h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
		transition: color 0.3s ease;
	}

	.cbd-dogs-related-card:hover h3 {
		color: rgb(75, 118, 110);
	}

	.cbd-dogs-related-card p {
		color: #64748b;
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.cbd-dogs-main {
			padding: 1rem 0;
		}

		.cbd-dogs-container {
			padding: 0 0.5rem;
		}

		.cbd-dogs-faq,
		.cbd-dogs-related {
			padding: 2rem;
		}

		.cbd-dogs-faq h2,
		.cbd-dogs-related h2 {
			font-size: 1.75rem;
		}
	}
</style>
