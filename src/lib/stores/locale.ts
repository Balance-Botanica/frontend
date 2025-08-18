import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { setLocale } from '$lib/paraglide/runtime.js';

// Supported languages
export const SUPPORTED_LANGUAGES = [
	{ code: 'uk-ua', name: 'Українська', flag: '🇺🇦', locale: 'uk-UA' },
	{ code: 'en', name: 'English', flag: '🇬🇧', locale: 'en-GB' }
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// Default language (Ukrainian)
const DEFAULT_LANGUAGE: LanguageCode = 'uk-ua';

// Get initial language from localStorage or browser preference
function getInitialLanguage(): LanguageCode {
	if (!browser) {
		console.log('🔍 [DEBUG] Not in browser, returning default:', DEFAULT_LANGUAGE);
		return DEFAULT_LANGUAGE;
	}

	// Try to get from localStorage first
	const stored = localStorage.getItem('balance-botanica-locale');
	console.log('🔍 [DEBUG] localStorage value:', stored);

	if (stored && SUPPORTED_LANGUAGES.some((lang) => lang.code === stored)) {
		console.log('🔍 [DEBUG] Using stored language:', stored);
		return stored as LanguageCode;
	}

	// Fallback to browser language
	const browserLang = navigator.language.split('-')[0];
	console.log('🔍 [DEBUG] Browser language:', browserLang);

	if (browserLang === 'uk') {
		console.log('🔍 [DEBUG] Using browser language: uk-ua');
		return 'uk-ua';
	}
	if (browserLang === 'en') {
		console.log('🔍 [DEBUG] Using browser language: en');
		return 'en';
	}

	console.log('🔍 [DEBUG] Using default language:', DEFAULT_LANGUAGE);
	return DEFAULT_LANGUAGE;
}

// Create the locale store
function createLocaleStore() {
	// Only create the store in the browser
	if (!browser) {
		// Return a dummy store for SSR
		return {
			subscribe: () => () => {},
			set: () => {},
			toggle: () => {},
			getCurrentLanguageInfo: () => SUPPORTED_LANGUAGES[0],
			getSupportedLanguages: () => SUPPORTED_LANGUAGES,
			isActive: () => true,
			getNextLanguage: () => SUPPORTED_LANGUAGES[0]
		};
	}

	const { subscribe, set, update } = writable<LanguageCode>(getInitialLanguage());

	// Initialize Paraglide with the current language
	const initialLanguage = getInitialLanguage();

	// Ensure Paraglide is initialized with the correct language
	try {
		setLocale(initialLanguage, { reload: false });
		console.log('✅ [DEBUG] Paraglide initialized with:', initialLanguage);
	} catch (error) {
		console.warn('❌ [DEBUG] Failed to initialize Paraglide locale:', error);
	}

	return {
		subscribe,

		// Set language and persist to localStorage
		set: (language: LanguageCode) => {
			console.log('🔍 [DEBUG] set() called with language:', language);

			if (!SUPPORTED_LANGUAGES.some((lang) => lang.code === language)) {
				console.warn(`❌ [DEBUG] Unsupported language: ${language}`);
				return;
			}

			console.log('🔍 [DEBUG] Language is supported, proceeding...');

			// Update Paraglide locale WITHOUT page reload
			console.log('🔍 [DEBUG] In browser, calling setLocale...');
			try {
				setLocale(language, { reload: false });
				console.log('✅ [DEBUG] setLocale() called successfully with:', language);
			} catch (error) {
				console.error('❌ [DEBUG] Failed to set Paraglide locale:', error);
			}

			localStorage.setItem('balance-botanica-locale', language);
			console.log('✅ [DEBUG] Saved to localStorage:', language);

			// Update document lang attribute for accessibility
			document.documentElement.lang = language.split('-')[0];
			document.documentElement.setAttribute('xml:lang', language.split('-')[0]);
			console.log('✅ [DEBUG] Updated document lang attributes');

			console.log('🔍 [DEBUG] Calling store set() with:', language);
			set(language);
			console.log('✅ [DEBUG] set() completed successfully');
		},

		// Toggle between languages
		toggle: () => {
			console.log('🔍 [DEBUG] toggle() called');

			// Use update to get current value and set new value
			update((currentLanguage) => {
				console.log('🔍 [DEBUG] Current language before toggle:', currentLanguage);

				const newLang = currentLanguage === 'uk-ua' ? 'en' : 'uk-ua';
				console.log('🔍 [DEBUG] Toggling to new language:', newLang);

				// Update Paraglide locale WITHOUT page reload
				try {
					setLocale(newLang, { reload: false });
					console.log('✅ [DEBUG] setLocale() called successfully with:', newLang);
				} catch (error) {
					console.error('❌ [DEBUG] Failed to set Paraglide locale:', error);
				}

				localStorage.setItem('balance-botanica-locale', newLang);
				console.log('✅ [DEBUG] Saved to localStorage:', newLang);

				// Update document lang attribute for accessibility
				document.documentElement.lang = newLang.split('-')[0];
				document.documentElement.setAttribute('xml:lang', newLang.split('-')[0]);
				console.log('✅ [DEBUG] Updated document lang attributes');

				console.log('✅ [DEBUG] toggle() completed');
				return newLang;
			});
		},

		// Get current language info
		getCurrentLanguageInfo: () => {
			let currentValue: LanguageCode = initialLanguage;
			update((value) => {
				currentValue = value;
				return value;
			});
			return SUPPORTED_LANGUAGES.find((lang) => lang.code === currentValue);
		},

		// Get all supported languages
		getSupportedLanguages: () => SUPPORTED_LANGUAGES,

		// Check if a language is currently active
		isActive: (language: LanguageCode) => {
			let currentValue: LanguageCode = initialLanguage;
			update((value) => {
				currentValue = value;
				return value;
			});
			return currentValue === language;
		},

		// Get next language in sequence
		getNextLanguage: () => {
			let currentValue: LanguageCode = initialLanguage;
			update((value) => {
				currentValue = value;
				return value;
			});
			const currentIndex = SUPPORTED_LANGUAGES.findIndex((lang) => lang.code === currentValue);
			const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
			return SUPPORTED_LANGUAGES[nextIndex];
		}
	};
}

export const localeStore = createLocaleStore();

// Store subscription is now handled within the store creation (browser-only)
