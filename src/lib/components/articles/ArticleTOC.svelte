<script lang="ts">
	interface Props {
		toc: Array<{ href: string; text: string }>;
		lang?: string;
	}

	let { toc, lang = 'uk-ua' }: Props = $props();

	const isEnglish = $derived(lang === 'en');
</script>

<div class="article-toc">
	<h3>{isEnglish ? 'Table of Contents' : 'Зміст'}</h3>
	<nav>
		<ul>
			{#each toc as item}
				<li data-level={item.level || 2}>
					<a href={item.href}>{item.text}</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>

<style>
	.article-toc {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.article-toc h3 {
		color: #1e293b;
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		margin-top: 0;
	}

	.article-toc nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.article-toc nav li {
		margin-bottom: 0.5rem;
	}

	.article-toc nav li[data-level="3"] {
		margin-left: 1rem;
		font-size: 0.8125rem;
	}

	.article-toc nav li[data-level="3"] a {
		padding-left: 1rem;
		border-left: 2px solid rgba(75, 118, 110, 0.3);
	}

	.article-toc nav a {
		color: #64748b;
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.3s ease;
		display: block;
		padding: 0.25rem 0;
		border-radius: 4px;
		padding-left: 0.5rem;
		border-left: 3px solid transparent;
		cursor: pointer;
	}

	.article-toc nav a:hover {
		color: rgb(75, 118, 110);
		background: rgba(75, 118, 110, 0.05);
		border-left-color: rgb(75, 118, 110);
		transform: translateX(2px);
	}

	.article-toc nav a:active {
		background: rgba(75, 118, 110, 0.1);
	}

	@media (max-width: 768px) {
		.article-toc {
			padding: 1.5rem;
		}

		.article-toc h3 {
			font-size: 1rem;
		}
	}
</style>
