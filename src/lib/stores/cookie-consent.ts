import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Types for cookie consent
export type CookieConsentStatus = 'none' | 'necessary' | 'all';

// Detailed cookie settings
export interface CookieSettings {
	necessary: boolean; // Always true, cannot be disabled
	statistics: boolean; // Statistics cookies
	marketing: boolean; // Marketing cookies
}

interface CookieConsentState {
	status: CookieConsentStatus;
	isVisible: boolean;
	hasShown: boolean;
	showManageModal: boolean; // Whether to show management modal
	settings: CookieSettings;
}

// Функция для получения начального состояния из localStorage
function getInitialState(): CookieConsentState {
	if (!browser) {
		return {
			status: 'none',
			isVisible: false,
			hasShown: false,
			showManageModal: false,
			settings: {
				necessary: true, // Всегда включено
				statistics: false,
				marketing: false
			}
		};
	}

	const stored = localStorage.getItem('cookie-consent');
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			return {
				status: parsed.status || 'none',
				isVisible: false, // Banner hidden if already chose
				hasShown: true,
				showManageModal: false,
				settings: parsed.settings || {
					necessary: true,
					statistics: false,
					marketing: false
				}
			};
		} catch {
			// If parsing error, reset
		}
	}

	// No stored preference - show banner
	return {
		status: 'none',
		isVisible: true, // Show banner by default when no choice made
		hasShown: false,
		showManageModal: false,
		settings: {
			necessary: true, // Always enabled
			statistics: false,
			marketing: false
		}
	};
}

// Create store
export const cookieConsentStore = writable<CookieConsentState>(getInitialState());

// Management functions
export function showCookieConsent() {
	cookieConsentStore.update((state) => ({
		...state,
		isVisible: true
	}));
}

export function hideCookieConsent() {
	cookieConsentStore.update((state) => ({
		...state,
		isVisible: false
	}));
}

export function showManageModal() {
	cookieConsentStore.update((state) => ({
		...state,
		showManageModal: true
		// Banner remains visible, only content changes
	}));
}

export function hideManageModal() {
	cookieConsentStore.update((state) => ({
		...state,
		showManageModal: false
		// Banner remains visible, only content changes
	}));
}

export function updateCookieSetting(key: keyof CookieSettings, value: boolean) {
	cookieConsentStore.update((state) => {
		const newSettings = { ...state.settings, [key]: value };
		const newState = { ...state, settings: newSettings };

		// Update localStorage
		if (browser) {
			localStorage.setItem('cookie-consent', JSON.stringify(newState));
		}

		return newState;
	});
}

export function acceptSelected() {
	const state = get(cookieConsentStore);
	const newState: CookieConsentState = {
		...state,
		status: 'necessary', // Base status for selected
		isVisible: false,
		hasShown: true,
		showManageModal: false
	};

	// If statistics or marketing enabled, update status
	if (state.settings.statistics || state.settings.marketing) {
		newState.status = 'all';
	}

	cookieConsentStore.set(newState);

	if (browser) {
		localStorage.setItem('cookie-consent', JSON.stringify(newState));
	}
}

export function acceptNecessary() {
	const newState: CookieConsentState = {
		status: 'necessary',
		isVisible: false,
		hasShown: true,
		showManageModal: false,
		settings: {
			necessary: true,
			statistics: false,
			marketing: false
		}
	};

	cookieConsentStore.set(newState);

	if (browser) {
		localStorage.setItem('cookie-consent', JSON.stringify(newState));
	}
}

export function acceptAll() {
	const newState: CookieConsentState = {
		status: 'all',
		isVisible: false,
		hasShown: true,
		showManageModal: false,
		settings: {
			necessary: true,
			statistics: true,
			marketing: true
		}
	};

	cookieConsentStore.set(newState);

	if (browser) {
		localStorage.setItem('cookie-consent', JSON.stringify(newState));
	}
}

export function resetCookieConsent() {
	const newState: CookieConsentState = {
		status: 'none',
		isVisible: true, // Show banner when reset
		hasShown: false,
		showManageModal: false,
		settings: {
			necessary: true,
			statistics: false,
			marketing: false
		}
	};

	cookieConsentStore.set(newState);

	if (browser) {
		localStorage.removeItem('cookie-consent');
	}
}

// Remove all TODO items and development functions for production

// Production-ready helper functions
export function getCookieStatus(): CookieConsentStatus {
	if (!browser) return 'none';

	const stored = localStorage.getItem('cookie-consent');
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			return parsed.status || 'none';
		} catch {
			return 'none';
		}
	}

	return 'none';
}

export function getCookieSettings(): CookieSettings {
	if (!browser) {
		return {
			necessary: true,
			statistics: false,
			marketing: false
		};
	}

	const stored = localStorage.getItem('cookie-consent');
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			return (
				parsed.settings || {
					necessary: true,
					statistics: false,
					marketing: false
				}
			);
		} catch {
			return {
				necessary: true,
				statistics: false,
				marketing: false
			};
		}
	}

	return {
		necessary: true,
		statistics: false,
		marketing: false
	};
}

// Helper to check if specific cookie types are allowed
export function isCookieAllowed(type: keyof CookieSettings): boolean {
	const settings = getCookieSettings();
	return settings[type];
}

// Helper to execute code only if marketing cookies are allowed
export function withMarketingConsent(callback: () => void): void {
	if (isCookieAllowed('marketing')) {
		callback();
	}
}

// Helper to execute code only if statistics cookies are allowed
export function withStatisticsConsent(callback: () => void): void {
	if (isCookieAllowed('statistics')) {
		callback();
	}
}
