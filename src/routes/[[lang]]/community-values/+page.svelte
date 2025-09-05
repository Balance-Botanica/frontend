<script lang="ts">
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';

	// Detect language from optional route parameter
	let lang = $derived($page.params?.lang || 'uk-ua');

	// Create page translations
	const pageTranslations = createPageTranslations();
</script>

{#if $pageTranslations}
<SEO
	title={$pageTranslations.t('community_values.meta.title')}
	description={$pageTranslations.t('community_values.meta.description')}
	locale={$pageTranslations.locale}
/>

<main class="community-page">
	<div class="container">
		<h1 class="page-title">{$pageTranslations.t('community_values.title')}</h1>

		<section class="value-section">
			<h2>{$pageTranslations.t('community_values.garden.title')}</h2>
			<p>
				{$pageTranslations.t('community_values.garden.paragraph1')}
			</p>
			<p>
				{$pageTranslations.t('community_values.garden.paragraph2')}
			</p>
		</section>

		<section class="value-section">
			<h2>{$pageTranslations.t('community_values.discourse.title')}</h2>
			<p>
				{$pageTranslations.t('community_values.discourse.paragraph1')}
			</p>
			<p>
				{$pageTranslations.t('community_values.discourse.paragraph2')}
			</p>
			<p>
				{$pageTranslations.t('community_values.discourse.paragraph3')}
			</p>
		</section>

		<section class="value-section">
			<h2>{$pageTranslations.t('community_values.disagreement.title')}</h2>
			<p>
				{$pageTranslations.t('community_values.disagreement.paragraph1')}
			</p>
			<ul class="avoid-list">
				{#each [...Array(5).keys()] as i}
					<li>{$pageTranslations.t(`community_values.disagreement.avoid_list.${i}`)}</li>
				{/each}
			</ul>
			<p>
				{$pageTranslations.t('community_values.disagreement.paragraph2')}
			</p>
		</section>

		<section class="value-section">
			<h2>{$pageTranslations.t('community_values.journey.title')}</h2>
			<p>
				{$pageTranslations.t('community_values.journey.paragraph1')}
			</p>
			<p>
				{$pageTranslations.t('community_values.journey.paragraph2')}
			</p>
		</section>

		<section class="value-section">
			<h2>{$pageTranslations.t('community_values.trust.title')}</h2>
			<p>
				{$pageTranslations.t('community_values.trust.paragraph1')}
			</p>
			<p>
				{$pageTranslations.t('community_values.trust.paragraph2')}
			</p>
		</section>

		<div class="closing-section">
			<p>
				{$pageTranslations.t('community_values.closing.paragraph')}
			</p>
			<div class="signature">
				<span>{$pageTranslations.t('community_values.closing.signature')}</span>
				<span>{$pageTranslations.t('community_values.closing.team')}</span>
			</div>
		</div>
	</div>
</main>
{:else}
<!-- Fallback while translations are loading -->
<main class="community-page">
	<div class="container">
		<h1 class="page-title">Loading...</h1>
	</div>
</main>
{/if}

<style>
	.community-page {
		background-color: #f8f7f6;
		padding: 60px 0;
		min-height: calc(100vh - 160px);
		font-family: 'Nunito', sans-serif;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.page-title {
		color: #4B766E;
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 40px;
		position: relative;
		padding-bottom: 15px;
	}

	.page-title:after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 3px;
		background-color: #4B766E;
	}

	.value-section {
		background-color: white;
		border-radius: 16px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	}

	h2 {
		color: #4B766E;
		font-size: 1.8rem;
		margin-top: 0;
		margin-bottom: 20px;
		font-weight: 600;
	}

	p {
		color: #333;
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 20px;
	}

	.avoid-list {
		padding-left: 25px;
		margin-bottom: 25px;
	}

	.avoid-list li {
		margin-bottom: 10px;
		color: #333;
		font-size: 1.1rem;
		line-height: 1.5;
		position: relative;
	}

	.avoid-list li:before {
		content: "•";
		color: #4B766E;
		font-weight: bold;
		display: inline-block;
		width: 1em;
		margin-left: -1em;
	}

	.closing-section {
		text-align: center;
		margin-top: 40px;
		padding: 30px;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	}

	.signature {
		margin-top: 30px;
		font-style: italic;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	em {
		font-style: italic;
		color: #4B766E;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.community-page {
			padding: 40px 0;
		}

		.page-title {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.value-section {
			padding: 20px;
		}
	}
</style>