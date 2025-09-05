<script lang="ts">
	import type { SupportedLocale } from '$lib/i18n/types';
	import { SUPPORTED_LOCALES } from '$lib/i18n/types';

	import { page } from '$app/stores';

	// Props
	const {
		title,
		description,
		keywords = '',
		image = '',
		locale = 'en' as SupportedLocale,
		baseUrl = 'https://balance-botanica.com',
		currentPath = ''
	}: {
		title: string;
		description: string;
		keywords?: string;
		image?: string;
		locale?: SupportedLocale;
		baseUrl?: string;
		currentPath?: string;
	} = $props();
	
	// Generate meta data
	let fullTitle = $derived(title ? `${title} | Balance Botanica` : 'Balance Botanica');
	let ogImage = $derived(image || `${baseUrl}/images/og-image.jpg`);

	// Generate hreflang URLs
	let currentPagePath = $derived(currentPath || $page.url.pathname);
	let basePath = $derived(currentPagePath.replace(/^\/en/, '') || '/');
	let ukUrl = $derived(basePath === '/' ? baseUrl : `${baseUrl}${basePath}`);
	let enUrl = $derived(basePath === '/' ? `${baseUrl}/en/` : `${baseUrl}/en${basePath}`);

	// Create JSON-LD structured data
	let jsonLd = '';
	$effect(() => {
		jsonLd = JSON.stringify({
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "Balance Botanica",
			"url": baseUrl,
			"logo": `${baseUrl}/images/logo.png`,
			"description": description,
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
	<meta name="description" content={description} />
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	
	<!-- Language & Locale -->
	<meta name="language" content={SUPPORTED_LOCALES[locale].name} />
	
	<!-- Canonical URL -->
	<link rel="canonical" href={baseUrl} />
	
	<!-- Hreflang для SEO (важно для украинского рынка) -->
	<link rel="alternate" hreflang="uk" href={ukUrl} />
	<link rel="alternate" hreflang="en" href={enUrl} />
	<link rel="alternate" hreflang="x-default" href={ukUrl} />
	
	<!-- Open Graph -->
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:url" content={baseUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={locale === 'uk-ua' ? 'uk_UA' : 'en_US'} />
	<meta property="og:site_name" content="Balance Botanica" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
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
			"description": description,
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
