import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type {
	LocaleConfig,
	LocaleState,
	LocaleChangeEvent,
	LocaleDetectionResult
} from './types.js';
import {
	SUPPORTED_LOCALES,
	LOCALE_METADATA,
	getLocaleConfig,
	getFallbackLocale
} from './config.js';

// Advanced locale store with enterprise features
class AdvancedLocaleStore {
	private store = writable<LocaleState>(this.getInitialState());
	private changeHistory: LocaleChangeEvent[] = [];
	private detectionCache = new Map<string, LocaleDetectionResult>();
	private performanceMetrics = new Map<string, number>();

	// Get initial state
	private getInitialState(): LocaleState {
		const defaultLocale = LOCALE_METADATA.defaultLocale;
		const config = getLocaleConfig(defaultLocale)!;

		return {
			currentLocale: defaultLocale,
			previousLocale: null,
			isRTL: config.rtl,
			currency: config.currency,
			currencySymbol: config.currencySymbol,
			dateFormat: config.dateFormat,
			timeFormat: config.timeFormat,
			numberFormat: config.numberFormat
		};
	}

	// Subscribe to store
	subscribe = this.store.subscribe;

	// Get current state
	get currentState(): LocaleState {
		return get(this.store);
	}

	// Set locale with validation and fallbacks
	async setLocale(
		localeCode: string,
		options: {
			reason?: 'user' | 'auto' | 'fallback' | 'system';
			persist?: boolean;
			validate?: boolean;
		} = {}
	): Promise<boolean> {
		const { reason = 'user', persist = true, validate = true } = options;

		try {
			// Validate locale
			if (validate && !this.validateLocale(localeCode)) {
				console.warn(`Invalid locale: ${localeCode}, falling back to default`);
				localeCode = LOCALE_METADATA.defaultLocale;
			}

			// Get locale config
			const config = getLocaleConfig(localeCode);
			if (!config) {
				throw new Error(`Locale not supported: ${localeCode}`);
			}

			// Check if locale is enabled
			if (!config.enabled) {
				console.warn(`Locale disabled: ${localeCode}, falling back to fallback`);
				localeCode = config.fallback || LOCALE_METADATA.fallbackLocale;
			}

			// Get current state
			const currentState = this.currentState;
			const newState: LocaleState = {
				currentLocale: localeCode,
				previousLocale: currentState.currentLocale,
				isRTL: config.rtl,
				currency: config.currency,
				currencySymbol: config.currencySymbol,
				dateFormat: config.dateFormat,
				timeFormat: config.timeFormat,
				numberFormat: config.numberFormat
			};

			// Update store
			this.store.set(newState);

			// Record change
			this.recordChange(currentState.currentLocale, localeCode, reason);

			// Persist to storage
			if (persist && browser) {
				this.persistLocale(localeCode);
			}

			// Update document attributes
			if (browser) {
				this.updateDocumentAttributes(localeCode, config);
			}

			// Performance tracking
			this.trackPerformance(localeCode);

			return true;
		} catch (error) {
			console.error('Failed to set locale:', error);
			return false;
		}
	}

	// Toggle between primary and secondary locales
	async toggle(): Promise<boolean> {
		const currentState = this.currentState;
		const currentLocale = currentState.currentLocale;

		// Get enabled locales by priority
		const enabledLocales = Object.values(SUPPORTED_LOCALES)
			.filter((locale) => locale.enabled)
			.sort((a, b) => a.priority - b.priority);

		// Find next locale in priority order
		const currentIndex = enabledLocales.findIndex((locale) => locale.code === currentLocale);
		const nextIndex = (currentIndex + 1) % enabledLocales.length;
		const nextLocale = enabledLocales[nextIndex].code;

		return this.setLocale(nextLocale, { reason: 'user' });
	}

	// Detect user's preferred locale
	async detectUserLocale(): Promise<LocaleDetectionResult> {
		if (!browser) {
			return {
				detected: LOCALE_METADATA.defaultLocale,
				confidence: 1.0,
				fallback: LOCALE_METADATA.fallbackLocale,
				userPreference: null
			};
		}

		// Check cache first
		const cacheKey = 'user-locale-detection';
		if (this.detectionCache.has(cacheKey)) {
			return this.detectionCache.get(cacheKey)!;
		}

		try {
			// Check localStorage
			const stored = localStorage.getItem('PARAGLIDE_LOCALE');
			if (stored && this.isLocaleSupported(stored)) {
				const result: LocaleDetectionResult = {
					detected: stored,
					confidence: 0.9,
					fallback: getFallbackLocale(stored) || LOCALE_METADATA.fallbackLocale,
					userPreference: stored
				};
				this.detectionCache.set(cacheKey, result);
				return result;
			}

			// Check browser language
			const browserLang = navigator.language;
			const detected = this.findBestMatch(browserLang);

			const result: LocaleDetectionResult = {
				detected: detected.code,
				confidence: detected.confidence,
				fallback: detected.fallback,
				userPreference: null
			};

			this.detectionCache.set(cacheKey, result);
			return result;
		} catch (error) {
			console.error('Locale detection failed:', error);
			return {
				detected: LOCALE_METADATA.defaultLocale,
				confidence: 0.0,
				fallback: LOCALE_METADATA.fallbackLocale,
				userPreference: null
			};
		}
	}

	// Find best locale match for browser language
	private findBestMatch(browserLang: string): {
		code: string;
		confidence: number;
		fallback: string;
	} {
		const lang = browserLang.toLowerCase().split('-')[0];
		const country = browserLang.split('-')[1]?.toUpperCase();

		// Exact match
		if (this.isLocaleSupported(browserLang)) {
			return {
				code: browserLang,
				confidence: 1.0,
				fallback: getFallbackLocale(browserLang) || LOCALE_METADATA.fallbackLocale
			};
		}

		// Language match
		for (const [code, config] of Object.entries(SUPPORTED_LOCALES)) {
			if (config.iso === lang && config.enabled) {
				return {
					code,
					confidence: 0.8,
					fallback: config.fallback || LOCALE_METADATA.fallbackLocale
				};
			}
		}

		// Fallback to default
		return {
			code: LOCALE_METADATA.defaultLocale,
			confidence: 0.0,
			fallback: LOCALE_METADATA.fallbackLocale
		};
	}

	// Validate locale
	private validateLocale(localeCode: string): boolean {
		return this.isLocaleSupported(localeCode) && SUPPORTED_LOCALES[localeCode].enabled;
	}

	// Check if locale is supported
	private isLocaleSupported(localeCode: string): boolean {
		return localeCode in SUPPORTED_LOCALES;
	}

	// Record locale change
	private recordChange(
		from: string,
		to: string,
		reason: 'user' | 'auto' | 'fallback' | 'system'
	): void {
		const change: LocaleChangeEvent = {
			from,
			to,
			timestamp: Date.now(),
			reason
		};

		this.changeHistory.push(change);

		// Keep only last 100 changes
		if (this.changeHistory.length > 100) {
			this.changeHistory.shift();
		}
	}

	// Persist locale to storage
	private persistLocale(localeCode: string): void {
		try {
			localStorage.setItem('PARAGLIDE_LOCALE', localeCode);
			localStorage.setItem('PARAGLIDE_LOCALE_TIMESTAMP', Date.now().toString());
		} catch (error) {
			console.error('Failed to persist locale:', error);
		}
	}

	// Update document attributes
	private updateDocumentAttributes(localeCode: string, config: LocaleConfig): void {
		document.documentElement.lang = config.iso;
		document.documentElement.setAttribute('xml:lang', config.iso);
		document.documentElement.dir = config.rtl ? 'rtl' : 'ltr';

		// Add locale-specific classes
		document.documentElement.classList.remove('locale-rtl', 'locale-ltr');
		document.documentElement.classList.add(`locale-${config.rtl ? 'rtl' : 'ltr'}`);
	}

	// Track performance
	private trackPerformance(localeCode: string): void {
		const startTime = performance.now();
		this.performanceMetrics.set(localeCode, startTime);
	}

	// Get change history
	getChangeHistory(): LocaleChangeEvent[] {
		return [...this.changeHistory];
	}

	// Get performance metrics
	getPerformanceMetrics(): Map<string, number> {
		return new Map(this.performanceMetrics);
	}

	// Reset to default locale
	async reset(): Promise<boolean> {
		return this.setLocale(LOCALE_METADATA.defaultLocale, { reason: 'system' });
	}

	// Get available locales
	getAvailableLocales(): LocaleConfig[] {
		return Object.values(SUPPORTED_LOCALES).filter((locale) => locale.enabled);
	}

	// Get locale by priority
	getLocalesByPriority(): LocaleConfig[] {
		return this.getAvailableLocales().sort((a, b) => a.priority - b.priority);
	}
}

// Create store instance
export const advancedLocaleStore = new AdvancedLocaleStore();

// Derived stores for reactive updates
export const currentLocale = derived(advancedLocaleStore, ($store) => $store.currentLocale);
export const isRTL = derived(advancedLocaleStore, ($store) => $store.isRTL);
export const currentCurrency = derived(advancedLocaleStore, ($store) => $store.currency);
export const currentCurrencySymbol = derived(
	advancedLocaleStore,
	($store) => $store.currencySymbol
);
export const currentDateFormat = derived(advancedLocaleStore, ($store) => $store.dateFormat);
export const currentTimeFormat = derived(advancedLocaleStore, ($store) => $store.timeFormat);
export const currentNumberFormat = derived(advancedLocaleStore, ($store) => $store.numberFormat);

// Initialize store
if (browser) {
	advancedLocaleStore.detectUserLocale().then((result) => {
		advancedLocaleStore.setLocale(result.detected, { reason: 'auto', persist: false });
	});
}
