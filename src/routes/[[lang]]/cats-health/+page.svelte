<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { page } from '$app/stores';

	const { data } = $props();
	const lang = $derived($page.params?.lang || 'uk-ua');
	const isEnglish = $derived(lang === 'en');
	const translations = $derived(() => ({
		learnMore: isEnglish ? 'Learn More' : 'Дізнатися більше',
		relatedArticles: isEnglish ? 'Related Articles' : 'Пов\'язані статті',
		tableOfContents: isEnglish ? 'Table of Contents' : 'Зміст'
	}));
</script>

<SEO
	title={data.title}
	description={data.description}
	locale={lang as 'en' | 'uk-ua'}
/>

<main class="cats-health-main">
	<div class="cats-health-container">
		<header class="cats-health-hero">
			<h1 class="cats-health-title">{data.title}</h1>
			<p class="cats-health-subtitle">{data.description}</p>
		</header>

		{#if data.content}
			<div class="cats-health-article-content">
				{@html data.content}
			</div>
		{/if}

		{#if data.seoData?.faq && data.seoData.faq.length > 0}
			<section class="cats-health-faq">
				<h2>{isEnglish ? 'Frequently Asked Questions' : 'Поширені запитання'}</h2>
				<div class="cats-health-faq-list">
					{#each data.seoData.faq as faq}
						<div class="cats-health-faq-item">
							<h3 class="cats-health-faq-question">{faq.question}</h3>
							<p class="cats-health-faq-answer">{faq.answer}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<section class="cats-health-related">
			<h2>{translations().relatedArticles}</h2>
			<div class="cats-health-related-grid">
				<a href={`${lang}/cbd/cats/`} class="cats-health-related-card">
					<h3>{isEnglish ? 'CBD for Cats: Complete Guide' : 'CBD для котів: повний посібник'}</h3>
					<p>{isEnglish ? 'Learn about CBD benefits, dosage, and safety for cats' : 'Дізнайтеся про переваги CBD, дозування та безпеку для котів'}</p>
				</a>

				<a href={`${lang}/cbd/safety/`} class="cats-health-related-card">
					<h3>{isEnglish ? 'CBD Safety Guide' : 'Посібник з безпеки CBD'}</h3>
					<p>{isEnglish ? 'Important safety information and research' : 'Важлива інформація про безпеку та дослідження'}</p>
				</a>

				<a href={`${lang}/cbd/dosage/`} class="cats-health-related-card">
					<h3>{isEnglish ? 'CBD Dosage Calculator' : 'Калькулятор дозування CBD'}</h3>
					<p>{isEnglish ? 'Calculate the right CBD dosage for your cat' : 'Розрахуйте правильну дозу CBD для вашого кота'}</p>
				</a>

				<a href={`${lang}/cbd/`} class="cats-health-related-card">
					<h3>{isEnglish ? 'CBD for Pets Overview' : 'CBD для домашніх тварин'}</h3>
					<p>{isEnglish ? 'Complete guide to CBD therapy for animals' : 'Повний посібник з CBD терапії для тварин'}</p>
				</a>
			</div>
		</section>
	</div>
</main>

<style>
	.cats-health-main {
		min-height: 100vh;
		background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
		padding: 2rem 0;
	}

	.cats-health-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.cats-health-hero {
		text-align: center;
		margin-bottom: 3rem;
		padding: 2rem;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cats-health-title {
		font-size: 2.5rem;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	.cats-health-subtitle {
		font-size: 1.25rem;
		color: #64748b;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.cats-health-article {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		line-height: 1.7;
	}

	.cats-health-article :global(h2) {
		color: #1e293b;
		font-size: 1.875rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.cats-health-article :global(h3) {
		color: #374151;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
	}

	.cats-health-article :global(p) {
		margin-bottom: 1rem;
		color: #475569;
	}

	.cats-health-article :global(ul) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.cats-health-article :global(li) {
		margin-bottom: 0.5rem;
		color: #475569;
	}

	/* Links styling */
	.cats-health-article-content :global(a) {
		color: #4B766E;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.cats-health-article-content :global(a:hover) {
		color: #3d5f58;
		text-decoration: underline;
		border-bottom-color: #3d5f58;
	}

	.cats-health-faq {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cats-health-faq h2 {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cats-health-faq-list {
		display: grid;
		gap: 1.5rem;
	}

	.cats-health-faq-item {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.cats-health-faq-item:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
	}

	.cats-health-faq-question {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.cats-health-faq-answer {
		color: #64748b;
		line-height: 1.6;
	}

	.cats-health-related {
		background: white;
		border-radius: 16px;
		padding: 3rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.cats-health-related h2 {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
	}

	.cats-health-related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.cats-health-related-card {
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		text-decoration: none;
		transition: all 0.3s ease;
		background: #f8fafc;
	}

	.cats-health-related-card:hover {
		border-color: #3b82f6;
		background: white;
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
	}

	.cats-health-related-card h3 {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.cats-health-related-card p {
		color: #64748b;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.cats-health-title {
			font-size: 2rem;
		}

		.cats-health-subtitle {
			font-size: 1.125rem;
		}

		.cats-health-article {
			padding: 2rem 1.5rem;
		}

		.cats-health-faq {
			padding: 2rem 1.5rem;
		}

		.cats-health-related {
			padding: 2rem 1.5rem;
		}

		.cats-health-related-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
