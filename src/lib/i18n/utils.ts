import type { SupportedLocale, PageMeta } from './types';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './types';

/**
 * Проверяет валидность локали
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
	return locale in SUPPORTED_LOCALES;
}

/**
 * Получает конфигурацию локали
 */
export function getLocaleConfig(locale: SupportedLocale) {
	return SUPPORTED_LOCALES[locale];
}

/**
 * Получает все доступные локали
 */
export function getAvailableLocales(): SupportedLocale[] {
	return Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];
}

/**
 * Простой SEO хелпер для meta тегов
 */
export function createMetaTags(
	locale: SupportedLocale,
	title: string,
	description: string,
	baseUrl: string = 'https://balance-botanica.com'
) {
	return {
		title: `${title} | Balance Botanica`,
		description,
		locale: locale === 'uk' ? 'uk_UA' : 'en_US',
		canonical: baseUrl,
		// Hreflang для SEO (важно для украинского рынка)
		hreflang: [
			{ locale: 'en', url: baseUrl },
			{ locale: 'uk', url: baseUrl },
			{ locale: 'x-default', url: baseUrl }
		]
	};
}
