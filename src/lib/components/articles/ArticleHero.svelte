<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		title: string;
		description: string;
		author?: string;
		date?: string;
		readingTime?: number | string;
		lang?: string;
	}

	const {
		title,
		description,
		author = 'Balance Botanica',
		date,
		readingTime,
		lang = 'uk-ua'
	}: Props = $props();

	const isEnglish = $derived(lang === 'en');
	const formattedDate = $derived(
		date ? new Date(date).toLocaleDateString(lang === 'en' ? 'en-US' : 'uk-UA') : null
	);
	const formattedReadingTime = $derived(() => {
		if (!readingTime) return null;
		if (typeof readingTime === 'number') {
			return `${readingTime} ${lang === 'en' ? 'min' : 'хв'}`;
		}
		return readingTime;
	});
</script>

<header class="article-hero">
	<h1 class="article-hero-title">{title}</h1>
	<p class="article-hero-subtitle">{description}</p>
	<div class="article-hero-meta">
		<span class="article-hero-author">
			{isEnglish ? 'By' : 'Автор'}: {author}
		</span>
		{#if formattedDate}
			<span class="article-hero-date">{formattedDate}</span>
		{/if}
		{#if formattedReadingTime}
			<span class="article-hero-reading-time">{formattedReadingTime}</span>
		{/if}
	</div>
</header>

<style>
	.article-hero {
		text-align: center;
		margin-bottom: 3rem;
		padding: 3rem;
		background: linear-gradient(135deg, rgb(75, 118, 110) 0%, rgb(65, 105, 100) 100%);
		color: white;
		border-radius: 20px;
		box-shadow: 0 10px 30px rgba(75, 118, 110, 0.3);
		position: relative;
		overflow: hidden;
	}

	.article-hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="50" cy="10" r="0.8" fill="rgba(255,255,255,0.08)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
		opacity: 0.1;
	}

	.article-hero-title {
		font-size: 3rem;
		font-weight: 800;
		margin-bottom: 1rem;
		line-height: 1.2;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}

	.article-hero-subtitle {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		line-height: 1.6;
		opacity: 0.95;
		position: relative;
		z-index: 1;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
	}

	.article-hero-meta {
		display: flex;
		justify-content: center;
		gap: 2rem;
		font-size: 0.875rem;
		opacity: 0.9;
		position: relative;
		z-index: 1;
		flex-wrap: wrap;
	}

	.article-hero-author,
	.article-hero-date,
	.article-hero-reading-time {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 768px) {
		.article-hero {
			padding: 2rem 1.5rem;
			margin-bottom: 2rem;
		}

		.article-hero-title {
			font-size: 2.5rem;
		}

		.article-hero-subtitle {
			font-size: 1.125rem;
		}

		.article-hero-meta {
			flex-direction: column;
			gap: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.article-hero-title {
			font-size: 2rem;
		}

		.article-hero-subtitle {
			font-size: 1rem;
		}

		.article-hero-meta {
			font-size: 0.75rem;
		}
	}
</style>
