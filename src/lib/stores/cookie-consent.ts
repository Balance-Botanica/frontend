import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Типы для cookie consent
export type CookieConsentStatus = 'none' | 'necessary' | 'all';

// Детальные настройки cookies
export interface CookieSettings {
	necessary: boolean; // Всегда true, нельзя отключить
	statistics: boolean; // Статистические cookies
	marketing: boolean; // Маркетинговые cookies
}

interface CookieConsentState {
	status: CookieConsentStatus;
	isVisible: boolean;
	hasShown: boolean;
	showManageModal: boolean; // Показывать ли модалку управления
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
				isVisible: false, // Не показываем если уже выбрали
				hasShown: true,
				showManageModal: false,
				settings: parsed.settings || {
					necessary: true,
					statistics: false,
					marketing: false
				}
			};
		} catch {
			// Если ошибка парсинга, сбрасываем
		}
	}

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

// Создаем store
export const cookieConsentStore = writable<CookieConsentState>(getInitialState());

// Функции для управления
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
		// Banner остается видимым, только контент меняется
	}));
}

export function hideManageModal() {
	cookieConsentStore.update((state) => ({
		...state,
		showManageModal: false
		// Banner остается видимым, только контент меняется
	}));
}

export function updateCookieSetting(key: keyof CookieSettings, value: boolean) {
	cookieConsentStore.update((state) => {
		const newSettings = { ...state.settings, [key]: value };
		const newState = { ...state, settings: newSettings };

		// Обновляем localStorage
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
		status: 'necessary', // Базовый статус для выбранных
		isVisible: false,
		hasShown: true,
		showManageModal: false
	};

	// Если включены статистика или маркетинг, обновляем статус
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
		isVisible: false,
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

// Функция для проверки, нужно ли показать consent
export function shouldShowCookieConsent(): boolean {
	if (!browser) return false;

	const stored = localStorage.getItem('cookie-consent');
	return !stored; // Показываем только если нет сохраненного выбора
}

// Функция для получения текущего статуса
export function getCookieConsentStatus(): CookieConsentStatus {
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
