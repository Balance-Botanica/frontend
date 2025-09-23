<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { ArticleHero, ArticleLayout } from '$lib/components/articles';
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';
	import type { SupportedLocale } from '$lib/i18n/types';

	const { data } = $props();
	const lang = $derived(($page.params?.lang as SupportedLocale) || 'uk-ua');
	const isEnglish = $derived(lang === 'en');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// TOC will be auto-generated from content headings
	const tocItems = $derived([]);

	const keyPoints = $derived(data.keyPoints || []);

	// Use translation system for dynamic language switching
	const translations = $derived({
		learnMore:
			$pageTranslations?.t('veterinaryCbd.learnMore') ||
			(isEnglish ? 'Learn More' : 'Дізнатися більше'),
		relatedArticles:
			$pageTranslations?.t('veterinaryCbd.relatedArticles') ||
			(isEnglish ? 'Related Articles' : "Пов'язані статті"),
		tableOfContents:
			$pageTranslations?.t('veterinaryCbd.tableOfContents') ||
			(isEnglish ? 'Table of Contents' : 'Зміст'),
		clinicalEvidence:
			$pageTranslations?.t('veterinaryCbd.clinicalEvidence') ||
			(isEnglish ? 'Clinical Evidence' : 'Клінічні докази'),
		veterinaryProtocols:
			$pageTranslations?.t('veterinaryCbd.veterinaryProtocols') ||
			(isEnglish ? 'Veterinary Protocols' : 'Ветеринарні протоколи'),
		safetyData:
			$pageTranslations?.t('veterinaryCbd.safetyData') ||
			(isEnglish ? 'Safety Data' : 'Дані безпеки'),
		professionalGuide:
			$pageTranslations?.t('veterinaryCbd.professionalGuide') ||
			(isEnglish ? 'Professional Guide' : 'Професійний посібник')
	});
</script>

<SEO title={data.title} description={data.description} />

<main class="veterinary-cbd-main">
	<div class="veterinary-cbd-container">
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

		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="veterinary-cbd-faq">
				<h2>
					{$pageTranslations?.t('veterinaryCbd.faq') ||
						(isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання')}
				</h2>
				<div class="veterinary-cbd-faq-list">
					{#each data.seoData.faq as faq, index (index)}
						<div class="veterinary-cbd-faq-item">
							<h3 class="veterinary-cbd-faq-question">{faq.question}</h3>
							<p class="veterinary-cbd-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="veterinary-cbd-related" id="related-articles">
			<h2>{translations.relatedArticles}</h2>
			<div class="veterinary-cbd-related-grid">
				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/knowledgebase/cbd/safety`}
					class="veterinary-cbd-related-card"
				>
					<h3>{isEnglish ? 'CBD Safety & Research' : 'Безпека CBD та дослідження'}</h3>
					<p>
						{isEnglish
							? 'Safety studies and scientific research on CBD'
							: 'Дослідження безпеки та наукові дані про CBD'}
					</p>
					<span class="card-tag">{isEnglish ? 'Evidence-Based' : 'Науково обґрунтовано'}</span>
				</a>

				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/knowledgebase/cbd/dogs`}
					class="veterinary-cbd-related-card"
				>
					<h3>{isEnglish ? 'CBD for Dogs: Complete Guide' : 'CBD для собак: повний посібник'}</h3>
					<p>
						{isEnglish
							? 'Scientific guide to CBD therapy for dogs'
							: 'Науковий посібник з CBD терапії для собак'}
					</p>
					<span class="card-tag">{isEnglish ? 'Clinical Studies' : 'Клінічні дослідження'}</span>
				</a>

				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/knowledgebase/cbd/cats`}
					class="veterinary-cbd-related-card"
				>
					<h3>{isEnglish ? 'CBD for Cats: Complete Guide' : 'CBD для котів: повний посібник'}</h3>
					<p>
						{isEnglish
							? 'Scientific guide to CBD therapy for cats'
							: 'Науковий посібник з CBD терапії для котів'}
					</p>
					<span class="card-tag">{isEnglish ? 'Feline Health' : "Здоров'я котів"}</span>
				</a>

				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/pets/thc-toxicity`}
					class="veterinary-cbd-related-card"
				>
					<h3>{isEnglish ? 'THC Toxicity in Pets' : 'THC токсичність у тварин'}</h3>
					<p>
						{isEnglish
							? 'Important safety information about THC'
							: 'Важлива інформація про безпеку THC'}
					</p>
					<span class="card-tag">{isEnglish ? 'Safety Alert' : 'Попередження безпеки'}</span>
				</a>

				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/knowledgebase/cbd`}
					class="veterinary-cbd-related-card"
				>
					<h3>{isEnglish ? 'CBD for Pets Overview' : 'CBD для домашніх тварин'}</h3>
					<p>
						{isEnglish
							? 'Complete guide to CBD therapy for all pets'
							: 'Повний посібник з CBD терапії для всіх тварин'}
					</p>
					<span class="card-tag">{isEnglish ? 'Comprehensive' : 'Комплексний'}</span>
				</a>

				<a
					href={`${lang === 'uk-ua' ? '' : `/${lang}`}/dog-health`}
					class="veterinary-cbd-related-card"
				>
					<h3>
						{isEnglish ? 'Dog Health: Comprehensive Guide' : "Здоров'я собак: повний посібник"}
					</h3>
					<p>
						{isEnglish
							? 'Complete natural health guide for dogs'
							: "Повний посібник натурального здоров'я собак"}
					</p>
					<span class="card-tag">{isEnglish ? 'Canine Health' : "Здоров'я собак"}</span>
				</a>
			</div>
		</section>
	</div>
</main>

<style>
	.veterinary-cbd-main {
		background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 25%, #f1f8f5 50%, #fefefe 100%);
		padding: 2rem 0;
		min-height: calc(100vh - 160px);
	}

	.veterinary-cbd-container {
		max-width: 1300px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.veterinary-cbd-hero {
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

	.veterinary-cbd-hero::before {
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

	.veterinary-cbd-badge {
		position: absolute;
		top: 2rem;
		right: 2rem;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50px;
		padding: 0.75rem 1.5rem;
	}

	.badge-text {
		color: white;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.veterinary-cbd-title {
		font-size: 3.5rem;
		font-weight: 900;
		margin-bottom: 1.5rem;
		line-height: 1.1;
		text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 2;
	}

	.veterinary-cbd-subtitle {
		font-size: 1.375rem;
		margin-bottom: 2rem;
		line-height: 1.6;
		opacity: 0.95;
		max-width: 700px;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		z-index: 2;
	}

	.veterinary-cbd-meta {
		display: flex;
		justify-content: center;
		gap: 3rem;
		font-size: 0.875rem;
		opacity: 0.9;
		position: relative;
		z-index: 2;
	}

	.veterinary-cbd-content-grid {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 4rem;
		margin-bottom: 4rem;
	}

	.veterinary-cbd-sidebar {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.veterinary-cbd-toc {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.veterinary-cbd-toc h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.veterinary-cbd-toc nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.veterinary-cbd-toc nav li {
		margin-bottom: 0.75rem;
	}

	.veterinary-cbd-toc nav a {
		color: #64748b;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.3s ease;
		display: block;
		padding: 0.5rem 1rem;
		border-radius: 8px;
	}

	.veterinary-cbd-toc nav a:hover {
		color: #3b82f6;
		background: #eff6ff;
		transform: translateX(4px);
	}

	.veterinary-cbd-key-insights {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.1);
	}

	.veterinary-cbd-key-insights h3 {
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

	.veterinary-cbd-study-highlights {
		background: white;
		border-radius: 20px;
		padding: 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(168, 85, 247, 0.1);
	}

	.veterinary-cbd-study-highlights h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.veterinary-cbd-study-highlights ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.veterinary-cbd-study-highlights li {
		color: #374151;
		font-size: 0.875rem;
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		background: #f8fafc;
		border-radius: 8px;
		border-left: 4px solid #8b5cf6;
		line-height: 1.5;
	}

	.veterinary-cbd-study-highlights li strong {
		color: #1e293b;
		font-weight: 600;
	}

	.veterinary-cbd-article {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.veterinary-cbd-content {
		padding: 4rem;
		line-height: 1.8;
	}

	.veterinary-cbd-content :global(h2) {
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

	.veterinary-cbd-content :global(h3) {
		color: #374151;
		font-size: 1.75rem;
		font-weight: 700;
		margin: 3rem 0 1.5rem 0;
		scroll-margin-top: 2rem;
		border-left: 4px solid #10b981;
		padding-left: 1rem;
	}

	.veterinary-cbd-content :global(h4) {
		color: #4b5563;
		font-size: 1.375rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 0.5rem;
	}

	.veterinary-cbd-content :global(p) {
		margin-bottom: 1.75rem;
		color: #475569;
		font-size: 1.0625rem;
		line-height: 1.7;
	}

	.veterinary-cbd-content :global(ul) {
		margin: 2rem 0;
		padding-left: 2.5rem;
	}

	.veterinary-cbd-content :global(li) {
		margin-bottom: 0.875rem;
		color: #475569;
		font-size: 1.0625rem;
		position: relative;
	}

	.veterinary-cbd-content :global(li::marker) {
		color: #3b82f6;
		font-weight: bold;
	}

	.veterinary-cbd-content :global(blockquote) {
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

	.veterinary-cbd-content :global(blockquote::before) {
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
	.veterinary-cbd-article-content :global(a) {
		color: #4b766e;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.veterinary-cbd-article-content :global(a:hover) {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	.veterinary-cbd-faq {
		background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
		border-radius: 20px;
		padding: 4rem;
		margin-bottom: 4rem;
		border: 1px solid #e2e8f0;
	}

	.veterinary-cbd-faq h2 {
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

	.veterinary-cbd-faq-list {
		display: grid;
		gap: 2rem;
	}

	.veterinary-cbd-faq-item {
		border: 1px solid #e2e8f0;
		border-radius: 16px;
		padding: 2.5rem;
		transition: all 0.3s ease;
		background: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.veterinary-cbd-faq-item:hover {
		border-color: #3b82f6;
		box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
		transform: translateY(-2px);
	}

	.veterinary-cbd-faq-question {
		color: #1e293b;
		font-size: 1.375rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		line-height: 1.4;
	}

	.veterinary-cbd-faq-answer {
		color: #64748b;
		line-height: 1.7;
		font-size: 1.0625rem;
		margin: 0;
	}

	.veterinary-cbd-related {
		background: white;
		border-radius: 20px;
		padding: 4rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.1);
	}

	.veterinary-cbd-related h2 {
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

	.veterinary-cbd-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 2.5rem;
	}

	.veterinary-cbd-related-card {
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

	.veterinary-cbd-related-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.veterinary-cbd-related-card:hover {
		border-color: #3b82f6;
		background: white;
		transform: translateY(-6px);
		box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
	}

	.veterinary-cbd-related-card:hover::before {
		opacity: 1;
	}

	.veterinary-cbd-related-card h3 {
		color: #1e293b;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
		line-height: 1.4;
		position: relative;
		z-index: 2;
	}

	.veterinary-cbd-related-card p {
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
		.veterinary-cbd-content-grid {
			grid-template-columns: 300px 1fr;
			gap: 3rem;
		}
	}

	@media (max-width: 1024px) {
		.veterinary-cbd-title {
			font-size: 2.75rem;
		}

		.veterinary-cbd-subtitle {
			font-size: 1.25rem;
		}

		.veterinary-cbd-meta {
			flex-direction: column;
			gap: 1rem;
		}

		.veterinary-cbd-content {
			padding: 3rem 2rem;
		}

		.veterinary-cbd-faq {
			padding: 3rem 2rem;
		}

		.veterinary-cbd-related {
			padding: 3rem 2rem;
		}
	}

	@media (max-width: 768px) {
		.veterinary-cbd-content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.veterinary-cbd-sidebar {
			position: static;
		}

		.veterinary-cbd-title {
			font-size: 2.25rem;
		}

		.veterinary-cbd-hero {
			padding: 3rem 1.5rem;
		}

		.veterinary-cbd-meta {
			gap: 1.5rem;
		}

		.veterinary-cbd-related-grid {
			grid-template-columns: 1fr;
		}

		.veterinary-cbd-toc {
			padding: 2rem;
		}

		.veterinary-cbd-key-insights {
			padding: 2rem;
		}

		.veterinary-cbd-study-highlights {
			padding: 2rem;
		}

		.veterinary-cbd-article {
			border-radius: 16px;
		}

		.veterinary-cbd-content {
			padding: 2rem 1.5rem;
		}

		.veterinary-cbd-faq {
			padding: 2rem 1.5rem;
		}

		.veterinary-cbd-related {
			padding: 2rem 1.5rem;
		}
	}
</style>
