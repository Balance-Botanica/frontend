<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import EmailSubscription from '$lib/components/EmailSubscription.svelte';
	import BlogPageItem from '$lib/components/BlogPageItem.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import type { SupportedLocale } from '$lib/i18n/types';

	// Get data from server (empty array)
	const { data } = $props();
	let { lang } = data;

	// Detect language from optional route parameter
	const currentLang = $derived(($page.params?.lang as SupportedLocale) || 'uk-ua');

	// Reactive articles data
	let articles: any[] = $state([]);
	let loading = $state(true);

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Function to load articles for current language
	async function loadArticles(language: string) {
		try {
			loading = true;
			const response = await fetch(`/api/blog/articles?lang=${language}`);
			if (response.ok) {
				const data = await response.json();
				articles = data.articles;
			} else {
				console.error('Failed to load articles');
				articles = [];
			}
		} catch (error) {
			console.error('Error loading articles:', error);
			articles = [];
		} finally {
			loading = false;
		}
	}

	// Load articles when component mounts or language changes
	onMount(() => {
		loadArticles(currentLang);
	});

	// Watch for language changes
	$effect(() => {
		const newLang = currentLang;
		if (newLang !== lang) {
			lang = newLang;
			loadArticles(newLang);
		}
	});
</script>

<SEO
	title={$pageTranslations?.t('blog.pageTitle')}
	description={$pageTranslations?.t('blog.pageDescription')}
/>

<main class="blog-main">
	<div class="blog-container">
		<!-- Blog header -->
		<header class="blog-header">
			<h1 class="blog-title">{$pageTranslations?.t('blog.blogTitle')}</h1>
			<p class="blog-subtitle">{$pageTranslations?.t('blog.blogSubtitle')}</p>
		</header>

		<!-- All articles grid -->
		<section class="blog-posts">
			{#if loading}
				<div class="loading-container">
					<div class="loading-spinner"></div>
					<p>{$pageTranslations?.t('blog.loading')}</p>
				</div>
			{:else if articles.length > 0}
				<div class="posts-grid">
					{#each articles as article (article.slug + currentLang)}
						<BlogPageItem {article} lang={currentLang} />
					{/each}
				</div>
			{:else}
				<div class="no-articles">
					<p>{$pageTranslations?.t('blog.noArticles')}</p>
				</div>
			{/if}
		</section>

		<!-- Newsletter section -->
		<section class="newsletter-section">
			<EmailSubscription compact={true} />
		</section>
	</div>
</main>

<style>
	.blog-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.blog-container {
		/* Container now allows full width for newsletter */
	}

	.blog-header {
		max-width: 1200px;
		margin: 0 auto 48px auto;
		padding: 0 20px;
		text-align: center;
	}

	.blog-title {
		font-family: 'Nunito', sans-serif;
		font-size: 48px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.blog-subtitle {
		font-size: 20px;
		color: #666;
		margin: 0;
		font-weight: 400;
	}

	.blog-posts {
		max-width: 1200px;
		margin: 0 auto 64px auto;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 32px;
	}

	.newsletter-section {
		margin-top: 64px;
	}

	/* Loading and error states */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		text-align: center;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e2e8f0;
		border-top: 4px solid rgb(75, 118, 110);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.no-articles {
		text-align: center;
		padding: 60px 20px;
		color: #64748b;
		font-size: 18px;
	}

	@media (max-width: 768px) {
		.blog-header {
			padding: 0 16px;
		}

		.blog-title {
			font-size: 36px;
		}

		.blog-subtitle {
			font-size: 18px;
		}

		.posts-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.post-content {
			padding: 20px;
		}

		.post-link {
			font-size: 20px;
		}

		.post-description {
			font-size: 15px;
		}

		.newsletter-section {
			margin-top: 48px;
		}

		.loading-container {
			padding: 40px 16px;
		}

		.loading-spinner {
			width: 32px;
			height: 32px;
			border-width: 3px;
		}

		.no-articles {
			padding: 40px 16px;
			font-size: 16px;
		}
	}
</style>
