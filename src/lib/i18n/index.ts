import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { browser } from '$app/environment';
import type { SupportedLocale, TranslationKeys } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';

// Import actual message files
import enMessages from '../../messages/en.json';
import ukMessages from '../../messages/uk-ua.json';

// Extract translations without schema
const en = enMessages as any;
const uk = ukMessages as any;

const defaultNS = 'translation';

const resources = {
	en: {
		[defaultNS]: en
	},
	uk: {
		[defaultNS]: uk
	}
};

let isInitialized = false;

// Инициализация i18next
export async function initI18n(initialLocale?: SupportedLocale): Promise<void> {
	console.log('🔧 Initializing i18n with locale:', initialLocale);
	console.log('🔧 Resources:', resources);

	if (isInitialized) {
		console.log('🔧 i18n already initialized');
		return;
	}

	try {
		await i18next.use(LanguageDetector).init({
			debug: false, // Disabled debug mode for production
			fallbackLng: DEFAULT_LOCALE,
			lng:
				(initialLocale === 'uk-ua' ? 'uk' : initialLocale) ||
				(browser ? undefined : DEFAULT_LOCALE === 'uk-ua' ? 'uk' : DEFAULT_LOCALE),
			supportedLngs: ['en', 'uk'],
			resources,
			defaultNS,
			interpolation: {
				escapeValue: false
			},
			detection: {
				order: browser
					? ['querystring', 'localStorage', 'navigator', 'htmlTag']
					: ['querystring', 'htmlTag'],
				caches: browser ? ['localStorage'] : [],
				lookupQuerystring: 'lang',
				lookupLocalStorage: 'i18nextLng',
				lookupFromPathIndex: 0, // Ищем локаль в первом сегменте пути
				lookupFromSubdomainIndex: 0
			},
			// Настройки для production
			load: 'languageOnly', // загружаем только основной язык (en, а не en-US)
			cleanCode: true,
			lowerCaseLng: true,
			nonExplicitSupportedLngs: true
		});

		isInitialized = true;
		console.log('✅ i18n initialized successfully');
		console.log('✅ Current language:', i18next.language);
		console.log('✅ Available languages:', i18next.languages);
	} catch (error) {
		console.error('❌ Failed to initialize i18n:', error);
		throw error;
	}
}

// Типизированная функция для получения переводов
export function t<K extends keyof TranslationKeys>(key: K | string, options?: any): string {
	if (!isInitialized || !i18next.isInitialized) {
		console.warn(`i18n not initialized yet, key: ${key}`);
		return key as string; // Return the key as fallback
	}

	const result = i18next.t(key as string, options);
	return typeof result === 'string' ? result : String(result);
}

// Функция для изменения языка
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
	if (!isInitialized) {
		await initI18n(locale);
	}
	// Map uk-ua to uk for i18next compatibility
	const i18nextLocale = locale === 'uk-ua' ? 'uk' : locale;
	await i18next.changeLanguage(i18nextLocale);
}

// Получение текущей локали
export function getCurrentLanguage(): SupportedLocale {
	const current = i18next.language || DEFAULT_LOCALE;
	// Map i18next's 'uk' back to our 'uk-ua'
	return current === 'uk' ? 'uk-ua' : (current as SupportedLocale);
}

// Проверка готовности
export function isReady(): boolean {
	return isInitialized && i18next.isInitialized;
}

export default i18next;
