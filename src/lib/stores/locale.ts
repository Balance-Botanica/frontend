import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { setLanguageTag } from '$lib/paraglide/runtime.js';

// Supported languages
export const SUPPORTED_LANGUAGES = [
	{ code: 'uk', name: 'Українська', flag: '🇺🇦', locale: 'uk-UA' },
	{ code: 'en', name: 'English', flag: '🇬🇧', locale: 'en-GB' }
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// Default language (Ukrainian)
const DEFAULT_LANGUAGE: LanguageCode = 'uk';

// Get initial language from localStorage or browser preference
function getInitialLanguage(): LanguageCode {
	if (!browser) return DEFAULT_LANGUAGE;

	// Try to get from localStorage first
	const stored = localStorage.getItem('balance-botanica-locale');
	if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
		return stored as LanguageCode;
	}

	// Fallback to browser language
	const browserLang = navigator.language.split('-')[0];
	if (browserLang === 'uk') return 'uk';
	if (browserLang === 'en') return 'en';

	return DEFAULT_LANGUAGE;
}

// Create the locale store
function createLocaleStore() {
	const { subscribe, set, update } = writable<LanguageCode>(getInitialLanguage());

	// Initialize Paraglide with the current language
	let currentLanguage = getInitialLanguage();
	setLanguageTag(currentLanguage);

	return {
		subscribe,

		// Set language and persist to localStorage
		set: (language: LanguageCode) => {
			if (!SUPPORTED_LANGUAGES.some((lang) => lang.code === language)) {
				console.warn(`Unsupported language: ${language}`);
				return;
			}

			currentLanguage = language;
			setLanguageTag(language);

			if (browser) {
				localStorage.setItem('balance-botanica-locale', language);
				// Update document lang attribute for accessibility
				document.documentElement.lang = language;
				// Update document title language if needed
				document.documentElement.setAttribute('xml:lang', language);
			}

			set(language);
		},

		// Toggle between languages
		toggle: () => {
			const newLang = currentLanguage === 'uk' ? 'en' : 'uk';
			return this.set(newLang);
		},

		// Get current language info
		getCurrentLanguageInfo: () => {
			return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage);
		},

		// Get all supported languages
		getSupportedLanguages: () => SUPPORTED_LANGUAGES,

		// Check if a language is currently active
		isActive: (language: LanguageCode) => currentLanguage === language,

		// Get next language in sequence
		getNextLanguage: () => {
			const currentIndex = SUPPORTED_LANGUAGES.findIndex((lang) => lang.code === currentLanguage);
			const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
			return SUPPORTED_LANGUAGES[nextIndex];
		}
	};
}

export const localeStore = createLocaleStore();

// Subscribe to store changes to update Paraglide
if (browser) {
	localeStore.subscribe((language) => {
		setLanguageTag(language);
	});
}
