<script lang="ts">
	import type { SupportedLocale } from '$lib/i18n/types';
	import { SUPPORTED_LOCALES } from '$lib/i18n/types';

	// Props
	export let title: string;
	export let description: string;
	export let keywords: string = '';
	export let image: string = '';
	export let locale: SupportedLocale = 'en';
	export let baseUrl: string = 'https://balance-botanica.com';
	
	// Generate meta data
	$: fullTitle = title ? `${title} | Balance Botanica` : 'Balance Botanica';
	$: ogImage = image || `${baseUrl}/images/og-image.jpg`;
	
	// Create JSON-LD structured data
	$: jsonLd = JSON.stringify({
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
	<link rel="alternate" hreflang="en" href={baseUrl} />
	<link rel="alternate" hreflang="uk-ua" href={baseUrl} />
	<link rel="alternate" hreflang="x-default" href={baseUrl} />
	
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
