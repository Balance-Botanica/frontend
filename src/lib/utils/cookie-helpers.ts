// ================================
// 🍪 COOKIE HELPERS - Production Ready Utilities
// ================================

import {
	getCookieStatus,
	getCookieSettings,
	withMarketingConsent,
	withStatisticsConsent
} from '$lib/stores/cookie-consent';

/**
 * Analytics Integration Helper
 * Use this to conditionally load analytics scripts
 */
export class AnalyticsManager {
	private static isInitialized = false;

	/**
	 * Initialize analytics only if statistics cookies are allowed
	 */
	static initializeAnalytics() {
		if (this.isInitialized) return;

		withStatisticsConsent(() => {
			// Example: Initialize Google Analytics
			// gtag('config', 'GA_MEASUREMENT_ID');
			console.log('🔍 Analytics initialized - statistics cookies allowed');
			this.isInitialized = true;
		});
	}

	/**
	 * Track event only if statistics cookies are allowed
	 */
	static trackEvent(eventName: string, parameters?: Record<string, any>) {
		withStatisticsConsent(() => {
			// Example: Track event
			// gtag('event', eventName, parameters);
			console.log(`📊 Event tracked: ${eventName}`, parameters);
		});
	}
}

/**
 * Marketing Tools Integration Helper
 * Use this to conditionally load marketing scripts
 */
export class MarketingManager {
	private static isInitialized = false;

	/**
	 * Initialize marketing tools only if marketing cookies are allowed
	 */
	static initializeMarketing() {
		if (this.isInitialized) return;

		withMarketingConsent(() => {
			// Example: Initialize Facebook Pixel, Google Ads
			// fbq('init', 'FACEBOOK_PIXEL_ID');
			console.log('🎯 Marketing tools initialized - marketing cookies allowed');
			this.isInitialized = true;
		});
	}

	/**
	 * Track conversion only if marketing cookies are allowed
	 */
	static trackConversion(eventType: string, data?: Record<string, any>) {
		withMarketingConsent(() => {
			// Example: Track conversion
			// fbq('track', eventType, data);
			console.log(`💰 Conversion tracked: ${eventType}`, data);
		});
	}
}

/**
 * Cookie Consent Status Helper
 * Use this to check current consent status
 */
export class ConsentChecker {
	/**
	 * Check if user has given any consent
	 */
	static hasConsent(): boolean {
		const status = getCookieStatus();
		return status !== 'none';
	}

	/**
	 * Check if user has given full consent
	 */
	static hasFullConsent(): boolean {
		const status = getCookieStatus();
		return status === 'all';
	}

	/**
	 * Check if specific cookie type is allowed
	 */
	static isAllowed(cookieType: 'necessary' | 'statistics' | 'marketing'): boolean {
		const settings = getCookieSettings();
		return settings[cookieType];
	}

	/**
	 * Get consent summary for debugging
	 */
	static getConsentSummary() {
		const status = getCookieStatus();
		const settings = getCookieSettings();

		return {
			status,
			settings,
			hasConsent: this.hasConsent(),
			hasFullConsent: this.hasFullConsent(),
			allowedTypes: Object.entries(settings)
				.filter(([, allowed]) => allowed)
				.map(([type]) => type)
		};
	}
}

/**
 * Third-party Script Loader
 * Use this to conditionally load external scripts based on consent
 */
export class ScriptLoader {
	private static loadedScripts = new Set<string>();

	/**
	 * Load script only if required consent is given
	 */
	static async loadScript(
		src: string,
		requiredConsent: 'necessary' | 'statistics' | 'marketing',
		options: { async?: boolean; defer?: boolean } = {}
	): Promise<boolean> {
		// Check if script already loaded
		if (this.loadedScripts.has(src)) {
			return true;
		}

		// Check if consent is given
		if (!ConsentChecker.isAllowed(requiredConsent)) {
			console.log(`❌ Script ${src} not loaded - ${requiredConsent} consent required`);
			return false;
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = src;
			script.async = options.async ?? true;
			script.defer = options.defer ?? false;

			script.onload = () => {
				this.loadedScripts.add(src);
				console.log(`✅ Script loaded: ${src}`);
				resolve(true);
			};

			script.onerror = () => {
				console.error(`❌ Failed to load script: ${src}`);
				reject(new Error(`Failed to load script: ${src}`));
			};

			document.head.appendChild(script);
		});
	}

	/**
	 * Load Google Analytics
	 */
	static async loadGoogleAnalytics(measurementId: string): Promise<boolean> {
		const success = await this.loadScript(
			`https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
			'statistics'
		);

		if (success) {
			// Initialize gtag
			withStatisticsConsent(() => {
				(window as any).dataLayer = (window as any).dataLayer || [];
				function gtag(...args: any[]) {
					(window as any).dataLayer.push(args);
				}
				(window as any).gtag = gtag;
				gtag('js', new Date());
				gtag('config', measurementId);
			});
		}

		return success;
	}

	/**
	 * Load Facebook Pixel
	 */
	static async loadFacebookPixel(pixelId: string): Promise<boolean> {
		if (!ConsentChecker.isAllowed('marketing')) {
			return false;
		}

		// Load Facebook Pixel code
		withMarketingConsent(() => {
			(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
				if (f.fbq) return;
				n = f.fbq = function (...args: any[]) {
					if (n.callMethod) {
						n.callMethod(...args);
					} else {
						n.queue.push(args);
					}
				};
				if (!f._fbq) f._fbq = n;
				n.push = n;
				n.loaded = !0;
				n.version = '2.0';
				n.queue = [];
				t = b.createElement(e);
				t.async = !0;
				t.src = v;
				s = b.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t, s);
			})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

			(window as any).fbq('init', pixelId);
			(window as any).fbq('track', 'PageView');
		});

		return true;
	}
}

/**
 * Example Usage Functions
 * These demonstrate how to integrate cookie consent with real features
 */
export const CookieExamples = {
	/**
	 * Initialize all tracking based on user consent
	 */
	initializeTracking() {
		// Initialize analytics if allowed
		AnalyticsManager.initializeAnalytics();

		// Initialize marketing tools if allowed
		MarketingManager.initializeMarketing();

		// Log current consent status
		console.log('🍪 Cookie Consent Status:', ConsentChecker.getConsentSummary());
	},

	/**
	 * Track a page view (respects consent)
	 */
	trackPageView(pagePath: string) {
		AnalyticsManager.trackEvent('page_view', {
			page_path: pagePath,
			page_title: document.title
		});
	},

	/**
	 * Track a purchase (respects consent)
	 */
	trackPurchase(orderId: string, value: number, currency: string = 'UAH') {
		// Analytics tracking
		AnalyticsManager.trackEvent('purchase', {
			transaction_id: orderId,
			value,
			currency
		});

		// Marketing conversion tracking
		MarketingManager.trackConversion('Purchase', {
			value,
			currency,
			content_ids: [orderId]
		});
	},

	/**
	 * Track user registration (respects consent)
	 */
	trackRegistration(method: string = 'email') {
		AnalyticsManager.trackEvent('sign_up', {
			method
		});

		MarketingManager.trackConversion('CompleteRegistration');
	}
};
