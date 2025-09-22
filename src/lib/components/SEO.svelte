<script lang="ts">
	import type { SupportedLocale } from '$lib/i18n/types';
	import { SUPPORTED_LOCALES } from '$lib/i18n/types';

	import { page } from '$app/stores';
	import { language } from '$lib/stores/language';

	// Props
	const {
		title,
		description,
		keywords = '',
		image = '',
		locale,
		baseUrl = 'https://balance-botanica.com',
		currentPath = ''
	}: {
		title?: string;
		description?: string;
		keywords?: string;
		image?: string;
		locale?: SupportedLocale;
		baseUrl?: string;
		currentPath?: string;
	} = $props();

	// Get locale from store or prop or default
	const currentLocale = $derived(locale || $language);
	
	// Generate meta data
	const safeTitle = $derived(title || 'Balance Botanica');
	const safeDescription = $derived(description || 'Natural CBD products for pets and health');
	const fullTitle = $derived(safeTitle ? `${safeTitle} | Balance Botanica` : 'Balance Botanica');
	const ogImage = $derived(image || `${baseUrl}/images/og-image.jpg`);

	// Generate hreflang URLs
	const currentPagePath = $derived(currentPath || $page.url.pathname);
	const basePath = $derived(currentPagePath.replace(/^\/en/, '').replace(/^\/uk-ua/, '') || '/');
	const ukUrl = $derived(basePath === '/' ? baseUrl : `${baseUrl}${basePath}`);
	const enUrl = $derived(basePath === '/' ? `${baseUrl}/en/` : `${baseUrl}/en${basePath}`);

	// Create JSON-LD structured data
	let jsonLd = '';
	$effect(() => {
		jsonLd = JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Balance Botanica",
			"url": baseUrl,
			"logo": `${baseUrl}/images/logo.png`,
			"description": safeDescription,
			"contactPoint": {
				"@type": "ContactPoint",
				"contactType": "customer service",
				"availableLanguage": ["English", "Ukrainian"]
			},
			"sameAs": [
				"https://www.facebook.com/balancebotanica",
				"https://www.instagram.com/balancebotanica"
			]
		});
	});
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="description" content={safeDescription} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	
	<!-- Language & Locale -->
	<meta name="language" content={SUPPORTED_LOCALES[currentLocale].name} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={baseUrl} />
	
	<!-- Hreflang для SEO (важно для украинского рынка) -->
	<link rel="alternate" hreflang="uk" href={ukUrl} />
	<link rel="alternate" hreflang="en" href={enUrl} />
	<link rel="alternate" hreflang="x-default" href={ukUrl} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={safeDescription} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={baseUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={currentLocale === 'uk-ua' ? 'uk_UA' : 'en_US'} />
	<meta property="og:site_name" content="Balance Botanica" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={safeDescription} />
	<meta name="twitter:image" content={ogImage} />
	
	<!-- Robots -->
	<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
	
	<!-- Schema.org structured data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Balance Botanica",
			"url": baseUrl,
			"logo": `${baseUrl}/images/logo.png`,
			"description": safeDescription,
			"contactPoint": {
				"@type": "ContactPoint",
				"contactType": "customer service",
				"availableLanguage": ["English", "Ukrainian"]
			},
			"sameAs": [
				"https://www.facebook.com/balancebotanica",
				"https://www.instagram.com/balancebotanica"
			]
		})}
	</script>
</svelte:head>
