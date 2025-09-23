<script lang="ts">
	import { language, setLanguage, getLocalizedUrl } from '$lib/stores/language';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { SupportedLocale } from '$lib/i18n/types';

	const languages = {
		'uk-ua': { name: 'Українська', flag: '🇺🇦' },
		en: { name: 'English', flag: '🇺🇸' }
	};

	function switchLanguage(newLang: SupportedLocale) {
		if (newLang === $language) return;

		// Get current clean path
		let currentPath = $page.url.pathname;

		// Remove language prefix if exists
		if (currentPath.startsWith('/en/')) {
			currentPath = currentPath.slice(4);
		} else if (currentPath.startsWith('/en')) {
			currentPath = currentPath.slice(3) || '/';
		}

		// Generate new URL
		const newUrl = getLocalizedUrl(currentPath, newLang) as string;

		// Update language and navigate
		setLanguage(newLang);
		goto(newUrl, { replaceState: false });
	}
</script>

<div class="language-switcher">
	{#each Object.entries(languages) as [code, lang] (code)}
		<button
			class="lang-button {$language === code ? 'active' : ''}"
			onclick={() => switchLanguage(code as SupportedLocale)}
			aria-label="Switch to {lang.name}"
		>
			<span class="flag">{lang.flag}</span>
			<span class="name">{lang.name}</span>
		</button>
	{/each}
</div>

<style>
	.language-switcher {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.lang-button {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 0.5rem;
		background: white;
		color: #64748b;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lang-button:hover {
		border-color: rgb(75, 118, 110);
		color: rgb(75, 118, 110);
	}

	.lang-button.active {
		background: rgb(75, 118, 110);
		border-color: rgb(75, 118, 110);
		color: white;
	}

	.flag {
		font-size: 1rem;
		line-height: 1;
	}

	.name {
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (max-width: 640px) {
		.language-switcher {
			gap: 0.25rem;
		}

		.lang-button {
			padding: 0.375rem 0.5rem;
		}

		.name {
			display: none;
		}
	}
</style>
