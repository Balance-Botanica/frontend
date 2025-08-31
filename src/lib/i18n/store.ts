import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import type { SupportedLocale, LocaleConfig, PageMeta } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';
import { initI18n, changeLanguage, getCurrentLanguage, t } from './index';
import { getLocaleConfig, getAvailableLocales, createMetaTags } from './utils';

// Store для текущей локали
export const currentLocale = writable<SupportedLocale>(DEFAULT_LOCALE);

// Store для готовности i18n
export const i18nReady = writable<boolean>(false);

// Derived store для конфигурации текущей локали
export const currentLocaleConfig = derived(
	currentLocale,
	($currentLocale) => SUPPORTED_LOCALES[$currentLocale]
);

// Derived store для всех доступных локалей
export const availableLocales = derived(currentLocale, ($currentLocale) =>
	Object.values(SUPPORTED_LOCALES).filter((locale) => locale.code !== $currentLocale)
);

// Store для переводов (реактивный)
export const translations = derived([currentLocale, i18nReady], ([$currentLocale, $i18nReady]) => {
	if (!$i18nReady) return {};

	// Возвращаем объект с методами перевода
	return {
		t: (key: string, options?: any) => t(key, options),
		locale: $currentLocale,
		config: SUPPORTED_LOCALES[$currentLocale]
	};
});

// Инициализация i18n системы
export async function initializeI18n(initialLocale?: SupportedLocale): Promise<void> {
	try {
		// Определяем локаль из localStorage или используем переданную
		let locale: SupportedLocale = initialLocale || DEFAULT_LOCALE;

		if (browser && !initialLocale) {
			const savedLocale = localStorage.getItem('i18nextLng');
			locale = savedLocale && isValidLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
		}

		// Инициализируем i18next
		await initI18n(locale);

		// Обновляем stores
		currentLocale.set(locale);
		i18nReady.set(true);

		console.log(`🌍 I18n initialized with locale: ${locale}`);
	} catch (error) {
		console.error('❌ Failed to initialize i18n:', error);
		// Fallback к дефолтной локали
		currentLocale.set(DEFAULT_LOCALE);
		i18nReady.set(false);
	}
}

// Переключение языка (простое, без изменения URL)
export async function switchLocale(newLocale: SupportedLocale): Promise<void> {
	try {
		// Меняем язык в i18next
		await changeLanguage(newLocale);

		// Обновляем store
		currentLocale.set(newLocale);

		// Сохраняем в localStorage
		if (browser) {
			localStorage.setItem('i18nextLng', newLocale);
		}

		console.log(`🔄 Switched to locale: ${newLocale}`);
	} catch (error) {
		console.error('❌ Failed to switch locale:', error);
	}
}

// Функция для создания переводов страницы
export function createPageTranslations() {
	return derived([translations, i18nReady], ([$translations, $i18nReady]) => {
		if (!$i18nReady || !$translations.t) {
			return null;
		}

		const { t, locale } = $translations;

		return {
			// Основные переводы
			t,
			locale,

			// Хелперы для мета-данных
			getMeta: (pageKey: string): PageMeta => ({
				title: t(`${pageKey}.meta.title`),
				description: t(`${pageKey}.meta.description`),
				keywords: t(`${pageKey}.meta.keywords`, { defaultValue: '' })
			}),

			// Простые SEO мета-теги
			getSEOTags: (pageKey: string, baseUrl?: string) => {
				const meta = {
					title: t(`${pageKey}.meta.title`),
					description: t(`${pageKey}.meta.description`)
				};

				return createMetaTags(locale, meta.title, meta.description, baseUrl);
			}
		};
	});
}

// Реактивная функция перевода для использования в компонентах
export function createTranslator() {
	return derived(translations, ($translations) => $translations.t || ((key: string) => key));
}

// Вспомогательная функция для проверки валидности локали
function isValidLocale(locale: string): locale is SupportedLocale {
	return locale in SUPPORTED_LOCALES;
}
