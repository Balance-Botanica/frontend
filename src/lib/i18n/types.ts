// Locale configuration interface
export interface LocaleConfig {
	code: string;
	iso: string;
	country: string;
	name: string;
	nativeName: string;
	flag: string;
	rtl: boolean;
	dateFormat: string;
	timeFormat: string;
	currency: string;
	currencySymbol: string;
	numberFormat: {
		decimal: string;
		thousands: string;
		precision: number;
	};
	fallback: string | null;
	enabled: boolean;
	priority: number;
}

// Locale metadata interface
export interface LocaleMetadata {
	defaultLocale: string;
	fallbackLocale: string;
	supportedLocales: string[];
	enabledLocales: string[];
	rtlLocales: string[];
}

// Locale store state interface
export interface LocaleState {
	currentLocale: string;
	previousLocale: string | null;
	isRTL: boolean;
	currency: string;
	currencySymbol: string;
	dateFormat: string;
	timeFormat: string;
	numberFormat: {
		decimal: string;
		thousands: string;
		precision: number;
	};
}

// Locale change event interface
export interface LocaleChangeEvent {
	from: string;
	to: string;
	timestamp: number;
	reason: 'user' | 'auto' | 'fallback' | 'system';
}

// Locale detection result interface
export interface LocaleDetectionResult {
	detected: string;
	confidence: number;
	fallback: string;
	userPreference: string | null;
}

// Locale persistence interface
export interface LocalePersistence {
	storageKey: string;
	expiryDays: number;
	encrypt: boolean;
}

// Locale validation result interface
export interface LocaleValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	suggestions: string[];
}

// Locale loading state interface
export interface LocaleLoadingState {
	isLoading: boolean;
	progress: number;
	currentLocale: string;
	totalLocales: number;
	errors: string[];
}

// Locale fallback chain interface
export interface LocaleFallbackChain {
	primary: string;
	fallbacks: string[];
	ultimate: string;
}

// Locale performance metrics interface
export interface LocalePerformanceMetrics {
	loadTime: number;
	bundleSize: number;
	cacheHitRate: number;
	translationCount: number;
}

// Locale accessibility interface
export interface LocaleAccessibility {
	screenReaderSupport: boolean;
	keyboardNavigation: boolean;
	highContrast: boolean;
	fontScaling: boolean;
}

// Locale SEO interface
export interface LocaleSEO {
	hreflang: string;
	alternateUrls: Record<string, string>;
	canonicalUrl: string;
	metaLanguage: string;
}
