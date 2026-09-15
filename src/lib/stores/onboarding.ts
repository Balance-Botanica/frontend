// First-visit phone onboarding + Google-link nudges.
// Smart anti-spam rules live here so components stay dumb.
// Only plain booleans/counters/timestamps in localStorage — no PII, safe.

import { browser } from '$app/environment';

const KEY_IMPRESSIONS = 'bb_phone_dialog_impressions';
const KEY_LAST_SEEN = 'bb_phone_dialog_last_seen';
const KEY_DONE = 'bb_phone_dialog_done'; // set after successful phone registration
const KEY_LINK_DISMISSED_AT = 'bb_link_google_dismissed_at';

const MAX_IMPRESSIONS = 3;
const DIALOG_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days between shows
const LINK_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000; // re-nudge Google link after 14 days

// Routes where the dialog must never interrupt (auth + checkout flows).
const EXCLUDED_PREFIXES = ['/login', '/password-recovery', '/cart', '/checkout', '/en/login'];

function readInt(key: string): number {
	try {
		return parseInt(localStorage.getItem(key) || '0', 10) || 0;
	} catch {
		return 0;
	}
}

function readStr(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStr(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		// private mode etc. — onboarding is best-effort
	}
}

function isExcludedPath(pathname: string): boolean {
	return EXCLUDED_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
	);
}

/** True when the first-visit phone dialog is allowed to appear. */
export function shouldShowPhoneDialog(isAuthenticated: boolean, pathname: string): boolean {
	if (!browser || isAuthenticated) return false;
	if (isExcludedPath(pathname)) return false;
	if (readStr(KEY_DONE) === '1') return false;
	if (readInt(KEY_IMPRESSIONS) >= MAX_IMPRESSIONS) return false;
	const lastSeen = readInt(KEY_LAST_SEEN);
	if (lastSeen && Date.now() - lastSeen < DIALOG_COOLDOWN_MS) return false;
	return true;
}

/** Record one dialog impression (called when it actually renders). */
export function markPhoneDialogShown(): void {
	if (!browser) return;
	writeStr(KEY_IMPRESSIONS, String(readInt(KEY_IMPRESSIONS) + 1));
	writeStr(KEY_LAST_SEEN, String(Date.now()));
}

/** User closed the dialog without registering — snooze via cooldown. */
export function dismissPhoneDialog(): void {
	if (!browser) return;
	writeStr(KEY_LAST_SEEN, String(Date.now()));
}

/** User completed phone registration — never show the first-visit dialog again. */
export function markPhoneRegistered(): void {
	if (!browser) return;
	writeStr(KEY_DONE, '1');
}

/** True when the "link Google" banner may appear (snooze respected). */
export function shouldShowLinkBanner(): boolean {
	if (!browser) return false;
	const dismissedAt = readInt(KEY_LINK_DISMISSED_AT);
	if (dismissedAt && Date.now() - dismissedAt < LINK_SNOOZE_MS) return false;
	return true;
}

/** User dismissed the Google-link banner — snooze it. */
export function dismissLinkBanner(): void {
	if (!browser) return;
	writeStr(KEY_LINK_DISMISSED_AT, String(Date.now()));
}

/**
 * Viber intercept support: links like /?phone=+380991234567 prefill the dialog.
 * Returns a normalized +380XXXXXXXXX number or null.
 */
export function getPrefilledPhone(search: string): string | null {
	try {
		const params = new URLSearchParams(search);
		const raw = params.get('phone');
		if (!raw) return null;
		let digits = raw.replace(/\D/g, '');
		// Accept 380XXXXXXXXX, 0XXXXXXXXX, or bare 9-digit mobile part
		if (digits.startsWith('380') && digits.length === 12) return '+' + digits;
		if (digits.length === 10 && digits.startsWith('0')) return '+38' + digits;
		if (digits.length === 9) return '+380' + digits;
		return null;
	} catch {
		return null;
	}
}
