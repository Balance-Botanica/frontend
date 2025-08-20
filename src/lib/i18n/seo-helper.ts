import type { SupportedLocale } from './types';
import { getAlternateLanguages, getCanonicalUrl } from './utils';

/**
 * Простой SEO хелпер для Balance Botanica
 */
export function createSEOHelper(locale: SupportedLocale, currentPath: string) {
	const baseUrl = 'https://balance-botanica.com';

	return {
		// Основные meta теги
		getMetaTags: (title: string, description: string) => ({
			title: `${title} | Balance Botanica`,
			description,
			canonical: getCanonicalUrl(currentPath, locale, baseUrl),
			locale: locale === 'uk' ? 'uk_UA' : 'en_US'
		}),

		// Hreflang для SEO (важно для украинского рынка)
		getHreflangTags: () => {
			const alternates = getAlternateLanguages(currentPath);
			return alternates.map(({ locale: altLocale, url }) => ({
				locale: altLocale,
				url: getCanonicalUrl(url, altLocale, baseUrl)
			}));
		},

		// Open Graph для соцсетей
		getOpenGraph: (title: string, description: string, image?: string) => ({
			title: `${title} | Balance Botanica`,
			description,
			image: image || `${baseUrl}/images/og-image.jpg`,
			url: getCanonicalUrl(currentPath, locale, baseUrl),
			locale: locale === 'uk' ? 'uk_UA' : 'en_US'
		})
	};
}
