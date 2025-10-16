import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { SupportedLocale, LocaleConfig, PageMeta } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';
import { initI18n, changeLanguage, getCurrentLanguage, t } from './index';
import { getLocaleConfig, getAvailableLocales, createMetaTags } from './utils';
import i18next from 'i18next';
import { language } from '$lib/stores/language';

// Удален дублирующий currentLocale - теперь используется единый language store

// Store для готовности i18n
export const i18nReady = writable<boolean>(false);

// Derived store для конфигурации текущей локали
export const currentLocaleConfig = derived(language, ($language) => SUPPORTED_LOCALES[$language]);

// Derived store для всех доступных локалей
export const availableLocales = derived(language, ($language) =>
	Object.values(SUPPORTED_LOCALES).filter((locale) => locale.code !== $language)
);

// Store для переводов (реактивный)
export const translations = derived([language, i18nReady], ([$language, $i18nReady]) => {
	if (!$i18nReady) return {};

	// Создаем новую функцию перевода для текущей локали
	const tForLocale = (key: string, options?: any) => {
		// Используем i18next напрямую с правильной локалью
		const i18nextLocale = $language === 'uk-ua' ? 'uk' : $language;
		let result = i18next.t(key, { ...options, lng: i18nextLocale });

		// Гарантируем, что result является строкой для работы с replace
		let resultString = String(result);

		// Обрабатываем интерполяцию с ${}
		if (options) {
			Object.keys(options).forEach((key) => {
				resultString = resultString.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), options[key]);
			});
		}

		return resultString;
	};

	// Возвращаем объект с методами перевода
	return {
		t: tForLocale,
		locale: $language,
		config: SUPPORTED_LOCALES[$language]
	};
});

// Инициализация i18n системы
export async function initializeI18n(initialLocale?: string): Promise<void> {
	try {
		// Определяем локаль из localStorage или используем переданную
		let locale: SupportedLocale = DEFAULT_LOCALE;

		if (initialLocale && isValidLocale(initialLocale)) {
			locale = initialLocale;
		} else if (browser && !initialLocale) {
			const savedLocale = localStorage.getItem('i18nextLng');
			locale = savedLocale && isValidLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
		}

		// Инициализируем i18next
		await initI18n(locale);

		// Обновляем stores
		language.set(locale);
		i18nReady.set(true);
	} catch (error) {
		console.error('❌ Failed to initialize i18n:', error);
		// Fallback к дефолтной локали
		language.set(DEFAULT_LOCALE);
		i18nReady.set(false);
	}
}

// Переключение языка (простое, без изменения URL)
export async function switchLocale(newLocale: SupportedLocale): Promise<void> {
	try {
		// Меняем язык в i18next
		await changeLanguage(newLocale);

		// Обновляем store
		language.set(newLocale);

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

		// Используем прямые ссылки на свойства из translations
		const translateFn = $translations.t;
		const currentLocale = $translations.locale;

		return {
			// Основные переводы
			t: translateFn,
			locale: currentLocale,

			// Хелперы для мета-данных
			getMeta: (pageKey: string): PageMeta => ({
				title: String(translateFn(`${pageKey}.meta.title`)),
				description: String(translateFn(`${pageKey}.meta.description`)),
				keywords: String(translateFn(`${pageKey}.meta.keywords`, { defaultValue: '' }))
			}),

			// Простые SEO мета-теги
			getSEOTags: (pageKey: string, baseUrl?: string) => {
				const meta = {
					title: String(translateFn(`${pageKey}.meta.title`)),
					description: String(translateFn(`${pageKey}.meta.description`))
				};

				return createMetaTags(currentLocale, meta.title, meta.description, baseUrl);
			}
		};
	});
}

// Функция для создания переводов страницы с конкретной локалью (для URL-based routing)
export function createPageTranslationsForLocale(targetLocale: SupportedLocale) {
	return derived([translations, i18nReady], ([$translations, $i18nReady]) => {
		if (!$i18nReady || !$translations.t) {
			return null;
		}

		// Создаем функцию перевода для конкретной локали
		const tForLocale = (key: string, options?: any) => {
			// Для английского используем английские ресурсы
			if (targetLocale === 'en') {
				return i18next.t(key, { ...options, lng: 'en' });
			}
			// Для украинского используем украинские ресурсы
			else if (targetLocale === 'uk-ua') {
				return i18next.t(key, { ...options, lng: 'uk' });
			}
			// Fallback
			return i18next.t(key, options);
		};

		return {
			// Основные переводы
			t: tForLocale,
			locale: targetLocale,

			// Хелперы для мета-данных
			getMeta: (pageKey: string): PageMeta => ({
				title: String(tForLocale(`${pageKey}.meta.title`)),
				description: String(tForLocale(`${pageKey}.meta.description`)),
				keywords: String(tForLocale(`${pageKey}.meta.keywords`, { defaultValue: '' }))
			}),

			// Простые SEO мета-теги
			getSEOTags: (pageKey: string, baseUrl?: string) => {
				const meta = {
					title: String(tForLocale(`${pageKey}.meta.title`)),
					description: String(tForLocale(`${pageKey}.meta.description`))
				};

				return createMetaTags(targetLocale, meta.title, meta.description, baseUrl);
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
