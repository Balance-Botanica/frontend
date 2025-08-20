import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { changeLanguage } from '../i18n';

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
			const savedLanguage = localStorage.getItem('I18NEXT_LOCALE') as Language;
			if (savedLanguage && (savedLanguage === 'uk-ua' || savedLanguage === 'en')) {
				currentLanguage = savedLanguage;
				set(currentLanguage);
			} else {
				// Set Ukrainian as default if no preference saved
				localStorage.setItem('I18NEXT_LOCALE', 'uk-ua');
			}
		} catch (error) {
			console.error('Error initializing locale:', error);
			// Fallback to Ukrainian
			localStorage.setItem('I18NEXT_LOCALE', 'uk-ua');
		}
	}

	return {
		subscribe,
		set: async (lang: Language) => {
			currentLanguage = lang;
			set(lang);
			if (browser) {
				localStorage.setItem('I18NEXT_LOCALE', lang);
				// Set cookie for i18next
				document.cookie = `I18NEXT_LOCALE=${lang}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days

				// Update the HTML lang attribute
				document.documentElement.lang = lang === 'uk-ua' ? 'uk' : 'en';

				// Update i18next language
				try {
					await changeLanguage(lang);
				} catch (error) {
					console.error('Error changing i18next language:', error);
				}
			}
		},
		toggle: async () => {
			const newLang: Language = currentLanguage === 'uk-ua' ? 'en' : 'uk-ua';
			currentLanguage = newLang;
			set(newLang);
			if (browser) {
				localStorage.setItem('I18NEXT_LOCALE', newLang);
				// Set cookie for i18next
				document.cookie = `I18NEXT_LOCALE=${newLang}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days

				// Update the HTML lang attribute
				document.documentElement.lang = newLang === 'uk-ua' ? 'uk' : 'en';

				// Update i18next language
				try {
					await changeLanguage(newLang);
				} catch (error) {
					console.error('Error changing i18next language:', error);
				}
			}
		}
	};
}

export const localeStore = createLocaleStore();
