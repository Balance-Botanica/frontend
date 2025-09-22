<script lang="ts">
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';
	import EmailSubscription from '$lib/components/EmailSubscription.svelte';
	import BlogPageItem from '$lib/components/BlogPageItem.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import type { SupportedLocale } from '$lib/i18n/types';

	// Get data from server
	const { data } = $props();
	const { articles } = data;

	// Detect language from optional route parameter
	const lang = $derived(($page.params?.lang as SupportedLocale) || 'uk-ua');

	// Create page translations
	const pageTranslations = createPageTranslations();
</script>

<SEO title={$pageTranslations?.t('blog.pageTitle')} description={$pageTranslations?.t('blog.pageDescription')} />

<main class="blog-main">
	<div class="blog-container">
		<!-- Blog header -->
		<header class="blog-header">
			<h1 class="blog-title">{$pageTranslations?.t('blog.blogTitle')}</h1>
			<p class="blog-subtitle">{$pageTranslations?.t('blog.blogSubtitle')}</p>
		</header>

		<!-- All articles grid -->
		<section class="blog-posts">
			<div class="posts-grid">
				{#each articles as article}
					<BlogPageItem {article} {lang} />
				{/each}
			</div>
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
	}

</style>
