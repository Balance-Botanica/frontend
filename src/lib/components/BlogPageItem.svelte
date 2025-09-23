<script lang="ts">
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';
	import type { SupportedLocale } from '$lib/i18n/types';

	const { article, lang } = $props<{
		article: {
			title: string;
			description: string;
			date: string;
			author: string;
			tags: string[];
			slug: string;
			readingTime: number;
			type: 'pillar' | 'blog';
		};
		lang: SupportedLocale;
	}>();

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Format date based on detected language
	const formattedDate = (date: string) => {
		const localeMap: Record<SupportedLocale, string> = {
			'uk-ua': 'uk-UA',
			en: 'en-US'
		};
		return new Date(date).toLocaleDateString(localeMap[lang], {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<article class="post-card" class:pillar-article={article.type === 'pillar'} class:blog-article={article.type === 'blog'}>
	<div class="post-content">
		<div class="post-meta">
			<span class="date">📅 {formattedDate(article.date)}</span>
			<span class="reading-time">📖 {article.readingTime} {$pageTranslations?.t('blog.readingTimeLabel')}</span>
			{#if article.type === 'pillar'}
				<span class="article-type pillar-type">{$pageTranslations?.t('blog.guide')}</span>
			{:else}
				<span class="article-type blog-type">{$pageTranslations?.t('blog.article')}</span>
			{/if}
		</div>

		<h2 class="post-title">
			<a href="{lang === 'uk-ua' ? '' : `/${lang}`}/{article.type === 'pillar' ? article.slug : `blog/${article.slug}`}" class="post-link">
				{article.title}
			</a>
		</h2>

		<p class="post-description">{article.description}</p>

		{#if article.tags && article.tags.length > 0}
			<div class="post-tags">
				{#each article.tags as tag}
					<span class="tag">#{tag}</span>
				{/each}
			</div>
		{/if}

		<div class="post-footer">
			<span class="author">✍️ {article.author}</span>
			<a href="{lang === 'uk-ua' ? '' : `/${lang}`}/{article.type === 'pillar' ? article.slug : `blog/${article.slug}`}" class="read-more">
				{$pageTranslations?.t('blog.readMore')} →
			</a>
		</div>
	</div>
</article>

<style>
	.post-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		overflow: hidden;
	}

	.post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.post-content {
		padding: 24px;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: #666;
		margin-bottom: 16px;
		font-weight: 500;
	}

	.article-type {
		display: inline-block;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-left: 8px;
	}

	.pillar-type {
		background: linear-gradient(135deg, #3b82f6, #1d4ed8);
		color: white;
		box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
	}

	.blog-type {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
	}

	.post-title {
		margin: 0 0 12px 0;
		line-height: 1.3;
	}

	.post-link {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.post-link:hover {
		color: #4b766e;
	}

	.post-description {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0 0 16px 0;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 16px;
	}

	.tag {
		background: #f0f0f0;
		color: #4b766e;
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 500;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 16px;
		border-top: 1px solid #f0f0f0;
	}

	.author {
		font-size: 12px;
		color: #666;
		font-weight: 500;
	}

	.read-more {
		color: #4b766e;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.read-more:hover {
		color: #3a5d56;
	}

	/* Different styles for pillar articles */
	.pillar-article {
		border-left: 4px solid #3b82f6;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.02));
	}

	.pillar-article .post-link {
		color: #1e40af;
	}

	.pillar-article .post-link:hover {
		color: #1d4ed8;
	}

	/* Different styles for blog articles */
	.blog-article {
		border-left: 4px solid #10b981;
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
	}

	.blog-article .post-link {
		color: #065f46;
	}

	.blog-article .post-link:hover {
		color: #047857;
	}
</style>
