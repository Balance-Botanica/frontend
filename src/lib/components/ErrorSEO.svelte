<script lang="ts">
    import { t } from '$lib/i18n';
    import { i18nReady } from '$lib/i18n/store';
    import type { SupportedLocale } from '$lib/i18n/types';
    
    export let title: string;
    export let description: string = '';
    export let locale: SupportedLocale = 'uk-ua';
    export let noindex: boolean = true; // Error pages should be noindex by default
</script>

<svelte:head>
    <title>{title} | Balance Botanica</title>
    <meta name="description" content={description} />
    
    {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
    {/if}
    
    <!-- Language metadata -->
    <link rel="alternate" hreflang="en" href="https://balance-botanica.com/en/error" />
    <link rel="alternate" hreflang="uk-ua" href="https://balance-botanica.com/error" />
    <link rel="alternate" hreflang="x-default" href="https://balance-botanica.com/error" />
    <meta property="og:locale" content={locale === 'uk-ua' ? 'uk_UA' : 'en_US'} />
</svelte:head>