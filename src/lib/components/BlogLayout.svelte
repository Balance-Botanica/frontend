<script lang="ts">
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	// Export data from page
	export let title: string;
	export let description: string;
	export let date: string;
	export let author: string;
	export let tags: string[] = [];
	export let slug: string;

	// Calculate reading time (rough estimate)
	$: readingTime = Math.ceil(title.length / 200 + (description?.length || 0) / 300);

	// Format date
	$: formattedDate = date ? new Date(date).toLocaleDateString('uk-UA', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}) : '';
</script>

<SEO
	title={title}
	description={description}
	locale={$page.data.locale}
/>

<main class="blog-post">
	<div class="blog-container">
		<!-- Back to blog link -->
		<div class="back-link">
			<a href="/blog" class="back-button">
				← Назад до блогу
			</a>
		</div>

		<!-- Article header -->
		<header class="post-header">
			<h1 class="post-title">{title}</h1>

			<div class="post-meta">
				{#if author}
					<span class="author">Автор: {author}</span>
				{/if}
				{#if formattedDate}
					<span class="date">📅 {formattedDate}</span>
				{/if}
				<span class="reading-time">📖 {readingTime} хв читання</span>
			</div>

			{#if tags && tags.length > 0}
				<div class="tags">
					{#each tags as tag}
						<span class="tag">#{tag}</span>
					{/each}
				</div>
			{/if}
		</header>

		<!-- Article content -->
		<article class="post-content">
			<slot />
		</article>

		<!-- Article footer -->
		<footer class="post-footer">
			<div class="share-section">
				<h3>Поділитися статтею:</h3>
				<div class="share-buttons">
					<button
						class="share-btn telegram"
						on:click={() => {
							const url = encodeURIComponent(window.location.href);
							const text = encodeURIComponent(`${title} - Balance Botanica`);
							window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
						}}
					>
						📱 Telegram
					</button>
				</div>
			</div>
		</footer>
	</div>
</main>

<style>
	.blog-post {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 32px 0;
	}

	.blog-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.back-link {
		margin-bottom: 24px;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #4B766E;
		text-decoration: none;
		font-weight: 500;
		font-size: 14px;
		transition: color 0.2s ease;
	}

	.back-button:hover {
		color: #3a5d56;
	}

	.post-header {
		background: white;
		border-radius: 16px;
		padding: 32px;
		margin-bottom: 32px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.post-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 20px 0;
		line-height: 1.3;
	}

	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-bottom: 16px;
		font-size: 14px;
		color: #666;
	}

	.author, .date, .reading-time {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		background: #f0f0f0;
		color: #4B766E;
		padding: 4px 12px;
		border-radius: 16px;
		font-size: 12px;
		font-weight: 500;
	}

	.post-content {
		background: white;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		margin-bottom: 32px;
		line-height: 1.7;
	}

	.post-content :global(h1), :global(h2), :global(h3), :global(h4), :global(h5), :global(h6) {
		font-family: 'Nunito', sans-serif;
		color: #1a1a1a;
		margin-top: 32px;
		margin-bottom: 16px;
		line-height: 1.3;
	}

	.post-content :global(h1) {
		font-size: 28px;
		font-weight: 700;
		border-bottom: 2px solid #f0f0f0;
		padding-bottom: 8px;
	}

	.post-content :global(h2) {
		font-size: 24px;
		font-weight: 600;
		color: #4B766E;
	}

	.post-content :global(h3) {
		font-size: 20px;
		font-weight: 600;
	}

	.post-content :global(p) {
		margin-bottom: 16px;
		font-size: 16px;
		color: #333;
	}

	.post-content :global(ul), :global(ol) {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.post-content :global(li) {
		margin-bottom: 8px;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid #4B766E;
		padding-left: 16px;
		margin: 24px 0;
		font-style: italic;
		color: #666;
	}

	.post-content :global(code) {
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 4px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 14px;
	}

	.post-content :global(pre) {
		background: #f5f5f5;
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
		margin: 16px 0;
	}

	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 16px 0;
	}

	.post-footer {
		background: white;
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.share-section h3 {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 16px 0;
	}

	.share-buttons {
		display: flex;
		gap: 12px;
	}

	.share-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.share-btn.telegram {
		background: #0088cc;
		color: white;
	}

	.share-btn.telegram:hover {
		background: #006699;
		transform: translateY(-1px);
	}

	@media (max-width: 768px) {
		.blog-container {
			padding: 0 16px;
		}

		.post-title {
			font-size: 28px;
		}

		.post-meta {
			flex-direction: column;
			gap: 8px;
		}

		.post-content, .post-header, .post-footer {
			padding: 24px;
		}

		.post-content :global(h1) {
			font-size: 24px;
		}
	}
</style>
