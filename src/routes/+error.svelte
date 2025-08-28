<script>
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { t } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { i18nReady } from '$lib/i18n/store';
	import { getCurrentLanguage } from '$lib/i18n';
	import ErrorSEO from '$lib/components/ErrorSEO.svelte';

	// Map status code to translation key
	function getErrorKey() {
		if ($page.status === 404) return 'not_found';
		if ($page.status >= 500) return 'server_error';
		return 'default';
	}

	// SEO metadata
	$: errorKey = getErrorKey();
	$: title = $i18nReady ? t(`error.${errorKey}.title`) : 'Error';
	$: description = $i18nReady ? t(`error.meta.description`) : 'An error has occurred';
	$: locale = getCurrentLanguage();
</script>

<ErrorSEO 
	title={title} 
	description={description} 
	locale={locale} 
	noindex={true} 
/>

<div class="error-container" in:fade={{ duration: 300 }}>
	{#if $i18nReady}
	<div class="error-content">
		<div class="error-icon">
			{#if $page.status === 404}
				<!-- 404 Icon - Page not found -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather">
					<circle cx="12" cy="12" r="10"></circle>
					<path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
					<line x1="9" y1="9" x2="9.01" y2="9"></line>
					<line x1="15" y1="9" x2="15.01" y2="9"></line>
				</svg>
			{:else if $page.status === 500}
				<!-- 500 Icon - Server error -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather">
					<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
					<line x1="12" y1="9" x2="12" y2="13"></line>
					<line x1="12" y1="17" x2="12.01" y2="17"></line>
				</svg>
			{:else}
				<!-- Default error icon -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather">
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
			{/if}
		</div>
		
		<h1 class="error-code">{$page.status || 'Error'}</h1>
		
		<h2 class="error-title">{t(`error.${getErrorKey()}.title`)}</h2>
		<p class="error-message">{t(`error.${getErrorKey()}.message`)}</p>
		
		<a href="/" class="home-button">{t('error.return_home')}</a>
	</div>
	{:else}
	<div class="error-content">
		<div class="error-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="8" x2="12" y2="12"></line>
				<line x1="12" y1="16" x2="12.01" y2="16"></line>
			</svg>
		</div>
		
		<h1 class="error-code">{$page.status || 'Error'}</h1>
		
		<h2 class="error-title">Error</h2>
		<p class="error-message">Something went wrong. Please try again later.</p>
		
		<a href="/" class="home-button">Return to Homepage</a>
	</div>
	{/if}
</div>

<style>
	.error-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100%;
		background-color: #f9f9f9;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}

	.error-content {
		text-align: center;
		max-width: 600px;
		padding: 4rem 3rem;
		background: white;
		border-radius: 1.5rem;
		box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		animation: float 6s ease-in-out infinite;
	}

	.error-icon {
		margin: 0 auto 2.5rem;
		width: 100px;
		height: 100px;
		color: #4b766e; /* Balance Botanica green */
	}

	.feather {
		width: 100%;
		height: 100%;
	}

	.error-code {
		font-size: 6rem;
		margin: 0;
		font-weight: 800;
		color: #4b766e;
		line-height: 1;
		text-shadow: 3px 3px 0 rgba(75, 118, 110, 0.1);
	}

	.error-title {
		font-size: 2rem;
		margin: 1.5rem 0 2rem;
		font-weight: 600;
		color: #333;
	}

	.error-message {
		font-size: 1.25rem;
		margin-bottom: 2.5rem;
		color: #666;
		line-height: 1.6;
	}

	.home-button {
		display: inline-block;
		background-color: #4b766e;
		color: white;
		padding: 1rem 2.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1.1rem;
		text-decoration: none;
		transition: all 0.3s ease;
		box-shadow: 0 5px 15px rgba(75, 118, 110, 0.3);
	}

	.home-button:hover {
		background-color: #3d5f58;
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(75, 118, 110, 0.4);
	}

	.home-button:active {
		transform: translateY(-1px);
	}

	@keyframes float {
		0% {
			transform: translateY(0px);
			box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		}
		50% {
			transform: translateY(-10px);
			box-shadow: 0 25px 45px rgba(0, 0, 0, 0.08);
		}
		100% {
			transform: translateY(0px);
			box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.error-content {
			padding: 3rem 2rem;
			margin: 0 1.5rem;
		}

		.error-code {
			font-size: 5rem;
		}

		.error-title {
			font-size: 1.75rem;
		}

		.error-message {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 480px) {
		.error-icon {
			width: 80px;
			height: 80px;
			margin-bottom: 2rem;
		}

		.error-code {
			font-size: 4rem;
		}

		.error-title {
			font-size: 1.5rem;
			margin: 1rem 0 1.5rem;
		}

		.error-content {
			padding: 2.5rem 1.5rem;
		}
	}
</style>