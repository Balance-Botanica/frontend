<script lang="ts">
	interface Props {
		keyPoints: string[];
		lang?: string;
	}

	const { keyPoints, lang = 'uk-ua' }: Props = $props();

	const isEnglish = $derived(lang === 'en');
</script>

<div class="article-key-points">
	<h3>{isEnglish ? 'Key Points' : 'Ключові моменти'}</h3>
	<ul>
		{#each keyPoints as point}
			<li>{point}</li>
		{/each}
	</ul>
</div>

<style>
	.article-key-points {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.article-key-points h3 {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		margin-top: 0;
	}

	.article-key-points ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.article-key-points li {
		color: #64748b;
		font-size: 0.875rem;
		margin-bottom: 0.75rem;
		padding-left: 1.5rem;
		position: relative;
		line-height: 1.5;
	}

	.article-key-points li::before {
		content: '✓';
		color: rgb(75, 118, 110);
		font-weight: bold;
		position: absolute;
		left: 0;
		font-size: 0.875rem;
	}

	.article-key-points li:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.article-key-points {
			padding: 1.5rem;
		}

		.article-key-points h3 {
			font-size: 1rem;
		}

		.article-key-points li {
			font-size: 0.8125rem;
		}
	}
</style>
