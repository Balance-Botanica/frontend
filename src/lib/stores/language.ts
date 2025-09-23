import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { SupportedLocale } from '$lib/i18n/types';
import { DEFAULT_LOCALE } from '$lib/i18n/types';

const LANGUAGE_STORAGE_KEY = 'balance-botanica-language';

// Get initial language from localStorage or detect from browser
function getInitialLanguage(): SupportedLocale {
	if (!browser) return DEFAULT_LOCALE;

	const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
	if (stored === 'en' || stored === 'uk-ua') {
		return stored;
	}

	// Detect from browser language
	const browserLang = navigator.language.toLowerCase();
	if (browserLang.startsWith('en')) {
		return 'en';
	}

	// Default to Ukrainian for Ukrainian-speaking regions
	return DEFAULT_LOCALE;
}

// Create the language store
export const language = writable<SupportedLocale>(getInitialLanguage());

// Subscribe to changes and save to localStorage
if (browser) {
	language.subscribe((value) => {
		localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
	});
}

// Helper functions
export function setLanguage(lang: SupportedLocale) {
	language.set(lang);
}

export function getCurrentLanguage(): SupportedLocale {
	let currentLang: SupportedLocale = DEFAULT_LOCALE;
	language.subscribe((lang) => {
		currentLang = lang;
	})();
	return currentLang;
}

// Generate URL for current language
export function getLocalizedUrl(path: string, targetLang?: SupportedLocale): string {
	const lang = targetLang || getCurrentLanguage();
	const cleanPath = path.startsWith('/') ? path.slice(1) : path;

	if (lang === 'uk-ua') {
		return cleanPath ? `/${cleanPath}` : '/';
	}

	return cleanPath ? `/${lang}/${cleanPath}` : `/${lang}`;
}

// Parse language from URL
export function parseLanguageFromUrl(url: string): SupportedLocale {
	if (url.startsWith('/en/') || url === '/en') {
		return 'en';
	}
	return 'uk-ua';
}

