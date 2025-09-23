<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';

	const { data } = $props();
	const lang = $derived($page.params?.lang || 'uk-ua');
	const isEnglish = $derived(lang === 'en');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived($pageTranslations?.pillarArticles.cbdCats.keyPoints || []);

	const translations = $derived(() => ({
		learnMore: isEnglish ? 'Learn More' : 'Дізнатися більше',
		relatedArticles: isEnglish ? 'Related Articles' : "Пов'язані статті"
	}));
</script>

<SEO title={data.title} description={data.description} />

<main class="cbd-cats-main">
	<div class="cbd-cats-container">
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
			<section class="cbd-cats-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="cbd-cats-faq-list">
					{#each data.seoData.faq as faq}
						<div class="cbd-cats-faq-item">
							<h3 class="cbd-cats-faq-question">{faq.question}</h3>
							<p class="cbd-cats-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="cbd-cats-related" id="related-articles">
			<h2>{translations().relatedArticles}</h2>
			<div class="cbd-cats-related-grid">
				<a href={`${lang}/cats-health`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'Cat Health: Complete Guide' : "Здоров'я котів: повний посібник"}</h3>
					<p>
						{isEnglish
							? 'Comprehensive natural health guide for cats'
							: "Комплексний посібник натурального здоров'я котів"}
					</p>
				</a>

				<a href={`${lang}/cbd/safety`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'CBD Safety & Research' : 'Безпека CBD та дослідження'}</h3>
					<p>
						{isEnglish
							? 'Safety studies and scientific research on CBD'
							: 'Дослідження безпеки та наукові дані про CBD'}
					</p>
				</a>

				<a href={`${lang}/cbd/dosage`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'CBD Dosage Calculator' : 'Калькулятор дозування CBD'}</h3>
					<p>
						{isEnglish
							? 'Calculate the right CBD dosage for your cat'
							: 'Розрахуйте правильну дозу CBD для вашого кота'}
					</p>
				</a>

				<a href={`${lang}/cbd`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'CBD for Pets Overview' : 'CBD для домашніх тварин'}</h3>
					<p>
						{isEnglish
							? 'Complete guide to CBD therapy for all pets'
							: 'Повний посібник з CBD терапії для всіх тварин'}
					</p>
				</a>

				<a href={`${lang}/cbd/dogs`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'CBD for Dogs: Complete Guide' : 'CBD для собак: повний посібник'}</h3>
					<p>
						{isEnglish
							? 'Scientific guide to CBD therapy for dogs'
							: 'Науковий посібник з CBD терапії для собак'}
					</p>
				</a>

				<a href={`${lang}/pets/thc-toxicity`} class="cbd-cats-related-card">
					<h3>{isEnglish ? 'THC Toxicity in Pets' : 'THC токсичність у тварин'}</h3>
					<p>
						{isEnglish
							? 'Important safety information about THC'
							: 'Важлива інформація про безпеку THC'}
					</p>
				</a>
			</div>
		</section>
	</div>
</main>

<style>
	.cbd-cats-main {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
		padding: 2rem 0;
	}

	.cbd-cats-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.cbd-cats-content :global(h2) {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin: 3rem 0 1.5rem 0;
		border-bottom: 3px solid #3b82f6;
		padding-bottom: 0.5rem;
		scroll-margin-top: 2rem;
	}

	.cbd-cats-content :global(h3) {
		color: #374151;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		scroll-margin-top: 2rem;
	}

	.cbd-cats-content :global(h4) {
		color: #4b5563;
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
	}

	.cbd-cats-content :global(p) {
		margin-bottom: 1.5rem;
		color: #475569;
	}

	.cbd-cats-content :global(ul) {
		margin: 1.5rem 0;
		padding-left: 2rem;
	}

	.cbd-cats-content :global(li) {
		margin-bottom: 0.75rem;
		color: #475569;
	}

	.cbd-cats-content :global(blockquote) {
		border-left: 4px solid #3b82f6;
		padding: 1.5rem 2rem;
		margin: 2rem 0;
		background: #f8fafc;
		font-style: italic;
		color: #374151;
	}

	/* Links styling */
	.cbd-cats-article-content :global(a) {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.cbd-cats-article-content :global(a:hover) {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	.cbd-cats-faq {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		margin-bottom: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cbd-cats-faq h2 {
		color: #1e293b;
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cbd-cats-faq-list {
		display: grid;
		gap: 1.5rem;
	}

	.cbd-cats-faq-item {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.cbd-cats-faq-item:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
	}

	.cbd-cats-faq-question {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.cbd-cats-faq-answer {
		color: #64748b;
		line-height: 1.6;
	}

	.cbd-cats-related {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cbd-cats-related h2 {
		color: #1e293b;
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cbd-cats-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.cbd-cats-related-card {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 2rem;
		text-decoration: none;
		transition: all 0.3s ease;
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
	}

	.cbd-cats-related-card:hover {
		border-color: #3b82f6;
		background: white;
		transform: translateY(-4px);
		box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
	}

	.cbd-cats-related-card h3 {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		line-height: 1.4;
	}

	.cbd-cats-related-card p {
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0;
	}

	@media (max-width: 1024px) {
		.cbd-cats-content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.cbd-cats-sidebar {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.cbd-cats-title {
			font-size: 2.5rem;
		}

		.cbd-cats-subtitle {
			font-size: 1.125rem;
		}

		.cbd-cats-meta {
			flex-direction: column;
			gap: 0.5rem;
		}

		.cbd-cats-content {
			padding: 2rem 1.5rem;
		}

		.cbd-cats-faq {
			padding: 2rem 1.5rem;
		}

		.cbd-cats-related {
			padding: 2rem 1.5rem;
		}

		.cbd-cats-related-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
