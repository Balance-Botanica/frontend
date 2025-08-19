import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Language = 'uk-ua' | 'en';

// Set Ukrainian as default language
const initialLanguage: Language = 'uk-ua';

// Create the locale store
function createLocaleStore() {
	const { subscribe, set, update } = writable<Language>(initialLanguage);

	// Initialize with Ukrainian as default
	let currentLanguage = initialLanguage;

	// Initialize locale on first load
	if (browser) {
		try {
			// Check localStorage for saved preference
			const savedLanguage = localStorage.getItem('PARAGLIDE_LOCALE') as Language;
			if (savedLanguage && (savedLanguage === 'uk-ua' || savedLanguage === 'en')) {
				currentLanguage = savedLanguage;
				set(currentLanguage);
			} else {
				// Set Ukrainian as default if no preference saved
				localStorage.setItem('PARAGLIDE_LOCALE', 'uk-ua');
			}
		} catch (error) {
			console.error('Error initializing locale:', error);
			// Fallback to Ukrainian
			localStorage.setItem('PARAGLIDE_LOCALE', 'uk-ua');
		}
	}

	return {
		subscribe,
		set: (lang: Language) => {
			currentLanguage = lang;
			set(lang);
			if (browser) {
				localStorage.setItem('PARAGLIDE_LOCALE', lang);
				// Reload page to apply new locale
				window.location.reload();
			}
		},
		toggle: () => {
			const newLang: Language = currentLanguage === 'uk-ua' ? 'en' : 'uk-ua';
			currentLanguage = newLang;
			set(newLang);
			if (browser) {
				localStorage.setItem('PARAGLIDE_LOCALE', newLang);
				// Reload page to apply new locale
				window.location.reload();
			}
		}
	};
}

export const localeStore = createLocaleStore();
