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
		return new Date(date).toLocaleDateString(localeMap[lang as SupportedLocale], {
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
		border-radius: 20px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.06);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		border: 1px solid rgba(0, 0, 0, 0.06);
		position: relative;
	}

	.post-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg,
			rgb(75, 118, 110) 0%,
			rgb(85, 128, 120) 50%,
			rgb(75, 118, 110) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.post-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06);
		border-color: rgba(75, 118, 110, 0.1);
	}

	.post-card:hover::before {
		opacity: 1;
	}

	.post-content {
		padding: 28px;
		position: relative;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		color: #64748b;
		margin-bottom: 20px;
		font-weight: 400;
		line-height: 1.4;
	}

	.article-type {
		display: inline-flex;
		align-items: center;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		margin-left: 12px;
		border: 1px solid;
		transition: all 0.2s ease;
	}

	.pillar-type {
		background: rgba(75, 118, 110, 0.08);
		color: rgb(75, 118, 110);
		border-color: rgba(75, 118, 110, 0.2);
	}

	.blog-type {
		background: rgba(75, 118, 110, 0.06);
		color: rgb(65, 105, 100);
		border-color: rgba(75, 118, 110, 0.15);
	}

	.post-title {
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.post-link {
		font-family: 'Nunito', sans-serif;
		font-size: 22px;
		font-weight: 600;
		color: #1a202c;
		text-decoration: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-block;
		position: relative;
	}

	.post-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, rgb(75, 118, 110), rgb(85, 128, 120));
		transition: width 0.3s ease;
		border-radius: 1px;
	}

	.post-link:hover {
		color: rgb(75, 118, 110);
		transform: translateX(2px);
	}

	.post-link:hover::after {
		width: 100%;
	}

	.post-description {
		font-size: 15px;
		color: #4a5568;
		line-height: 1.65;
		margin: 0 0 20px 0;
		font-weight: 400;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}

	.tag {
		background: rgba(75, 118, 110, 0.08);
		color: rgb(65, 105, 100);
		padding: 6px 12px;
		border-radius: 16px;
		font-size: 12px;
		font-weight: 500;
		border: 1px solid rgba(75, 118, 110, 0.1);
		transition: all 0.2s ease;
	}

	.tag:hover {
		background: rgba(75, 118, 110, 0.12);
		border-color: rgba(75, 118, 110, 0.2);
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20px;
		border-top: 1px solid rgba(0, 0, 0, 0.06);
		margin-top: 24px;
	}

	.author {
		font-size: 13px;
		color: #64748b;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.read-more {
		color: rgb(75, 118, 110);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		padding: 8px 16px;
		border-radius: 20px;
		border: 1px solid rgba(75, 118, 110, 0.2);
		background: transparent;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.read-more:hover {
		background: rgba(75, 118, 110, 0.05);
		border-color: rgb(75, 118, 110);
		transform: translateX(4px);
	}

	/* Subtle visual differentiation for article types */
	.pillar-article::before {
		background: linear-gradient(90deg,
			rgb(75, 118, 110) 0%,
			rgb(65, 105, 100) 50%,
			rgb(75, 118, 110) 100%);
	}

	.blog-article::before {
		background: linear-gradient(90deg,
			rgb(85, 128, 120) 0%,
			rgb(75, 118, 110) 50%,
			rgb(85, 128, 120) 100%);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.post-content {
			padding: 24px;
		}

		.post-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		.article-type {
			margin-left: 0;
			margin-top: 8px;
		}

		.post-link {
			font-size: 20px;
		}

		.post-description {
			font-size: 14px;
		}
	}
</style>
