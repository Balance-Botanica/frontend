import type { LocaleConfig, LocaleMetadata } from './types.js';

// Supported locales with full metadata
export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
	'uk-ua': {
		code: 'uk-ua',
		iso: 'uk',
		country: 'UA',
		name: 'Українська',
		nativeName: 'Українська',
		flag: '🇺🇦',
		rtl: false,
		dateFormat: 'DD.MM.YYYY',
		timeFormat: 'HH:mm',
		currency: 'UAH',
		currencySymbol: '₴',
		numberFormat: {
			decimal: ',',
			thousands: ' ',
			precision: 2
		},
		fallback: null, // Primary language, no fallback
		enabled: true,
		priority: 1
	},
	en: {
		code: 'en',
		iso: 'en',
		country: 'GB',
		name: 'English',
		nativeName: 'English',
		flag: '🇬🇧',
		rtl: false,
		dateFormat: 'MM/DD/YYYY',
		timeFormat: 'HH:mm',
		currency: 'USD',
		currencySymbol: '$',
		numberFormat: {
			decimal: '.',
			thousands: ',',
			precision: 2
		},
		fallback: 'uk-ua',
		enabled: true,
		priority: 2
	},
	de: {
		code: 'de',
		iso: 'de',
		country: 'DE',
		name: 'Deutsch',
		nativeName: 'Deutsch',
		flag: '🇩🇪',
		rtl: false,
		dateFormat: 'DD.MM.YYYY',
		timeFormat: 'HH:mm',
		currency: 'EUR',
		currencySymbol: '€',
		numberFormat: {
			decimal: ',',
			thousands: '.',
			precision: 2
		},
		fallback: 'en',
		enabled: true,
		priority: 3
	},
	pl: {
		code: 'pl',
		iso: 'pl',
		country: 'PL',
		name: 'Polski',
		nativeName: 'Polski',
		flag: '🇵🇱',
		rtl: false,
		dateFormat: 'DD.MM.YYYY',
		timeFormat: 'HH:mm',
		currency: 'PLN',
		currencySymbol: 'zł',
		numberFormat: {
			decimal: ',',
			thousands: ' ',
			precision: 2
		},
		fallback: 'en',
		enabled: true,
		priority: 4
	},
	cs: {
		code: 'cs',
		iso: 'cs',
		country: 'CZ',
		name: 'Čeština',
		nativeName: 'Čeština',
		flag: '🇨🇿',
		rtl: false,
		dateFormat: 'DD.MM.YYYY',
		timeFormat: 'HH:mm',
		currency: 'CZK',
		currencySymbol: 'Kč',
		numberFormat: {
			decimal: ',',
			thousands: ' ',
			precision: 2
		},
		fallback: 'en',
		enabled: true,
		priority: 5
	}
	// Easy to add more locales here...
};

// Locale metadata for dynamic loading
export const LOCALE_METADATA: LocaleMetadata = {
	defaultLocale: 'uk-ua',
	fallbackLocale: 'en',
	supportedLocales: Object.keys(SUPPORTED_LOCALES),
	enabledLocales: Object.keys(SUPPORTED_LOCALES).filter((code) => SUPPORTED_LOCALES[code].enabled),
	rtlLocales: Object.keys(SUPPORTED_LOCALES).filter((code) => SUPPORTED_LOCALES[code].rtl)
};

// Helper functions
export function getLocaleConfig(code: string): LocaleConfig | null {
	return SUPPORTED_LOCALES[code] || null;
}

export function isLocaleSupported(code: string): boolean {
	return code in SUPPORTED_LOCALES;
}

export function isLocaleEnabled(code: string): boolean {
	return SUPPORTED_LOCALES[code]?.enabled || false;
}

export function getFallbackLocale(code: string): string | null {
	return SUPPORTED_LOCALES[code]?.fallback || null;
}

export function getEnabledLocales(): LocaleConfig[] {
	return Object.values(SUPPORTED_LOCALES).filter((locale) => locale.enabled);
}

export function getLocalesByPriority(): LocaleConfig[] {
	return getEnabledLocales().sort((a, b) => a.priority - b.priority);
}

// Currency formatting helpers
export function formatCurrency(amount: number, localeCode: string): string {
	const locale = getLocaleConfig(localeCode);
	if (!locale) return amount.toString();

	const { currencySymbol, numberFormat } = locale;
	const formatted = new Intl.NumberFormat(localeCode, {
		minimumFractionDigits: numberFormat.precision,
		maximumFractionDigits: numberFormat.precision
	}).format(amount);

	return `${currencySymbol}${formatted}`;
}

// Date formatting helpers
export function formatDate(date: Date, localeCode: string): string {
	const locale = getLocaleConfig(localeCode);
	if (!locale) return date.toLocaleDateString();

	return new Intl.DateTimeFormat(localeCode, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(date);
}
