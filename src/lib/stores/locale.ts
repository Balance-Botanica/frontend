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
				// Set cookie for Paraglide
				document.cookie = `PARAGLIDE_LOCALE=${lang}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
				
				// Force a page refresh to apply the new locale
				// This is necessary because Paraglide needs to reload to pick up the new locale
				window.location.reload();
			}
		},
		toggle: () => {
			const newLang: Language = currentLanguage === 'uk-ua' ? 'en' : 'uk-ua';
			currentLanguage = newLang;
			set(newLang);
			if (browser) {
				localStorage.setItem('PARAGLIDE_LOCALE', newLang);
				// Set cookie for Paraglide
				document.cookie = `PARAGLIDE_LOCALE=${newLang}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
				
				// Force a page refresh to apply the new locale
				// This is necessary because Paraglide needs to reload to pick up the new locale
				window.location.reload();
			}
		}
	};
}

export const localeStore = createLocaleStore();
