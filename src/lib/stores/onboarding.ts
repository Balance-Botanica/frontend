// First-visit phone onboarding + Google-link nudges.
// Smart anti-spam rules live here so components stay dumb.
// Only plain booleans/counters/timestamps in localStorage — no PII, safe.

import { browser } from '$app/environment';

const KEY_IMPRESSIONS = 'bb_phone_dialog_impressions';
const KEY_LAST_SEEN = 'bb_phone_dialog_last_seen';
const KEY_DONE = 'bb_phone_dialog_done'; // set after successful phone registration
const KEY_LINK_DISMISSED_AT = 'bb_link_google_dismissed_at';
const KEY_LINK_DIALOG_IMPRESSIONS = 'bb_link_dialog_impressions';
const KEY_LINK_DIALOG_LAST_SEEN = 'bb_link_dialog_last_seen';
const KEY_AUTH_VISITS = 'bb_auth_visits';

const MAX_IMPRESSIONS = 3;
const DIALOG_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days between shows
const LINK_SNOOZE_MS = 14 * 24 * 60 * 60 * 1000; // re-nudge Google link after 14 days
const LINK_DIALOG_MAX = 2;
const LINK_DIALOG_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

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

// --- Link-accounts nudge: WHEN to fire ---------------------------------------
// Moments (first matching wins), all require a signed-in user who still has
// something to link (phone-only, or no Google and no email):
//  A. just ordered (checkout success) — highest goodwill, user is happy
//  B. 2nd+ authenticated visit — proven returner, SMS cost is now recurring
//  C. first profile view while unlinked — user is already in settings context
// Caps: max 2 impressions ever, 14-day cooldown, never inside checkout/cart,
// CTA navigates to /profile#login-methods where linking actually lives.

const LINK_DIALOG_EXCLUDED = ['/cart', '/checkout', '/en/cart', '/en/checkout'];

/** Count one authenticated visit (call once per page view while signed in). */
export function trackAuthVisit(): number {
	if (!browser) return 0;
	const next = readInt(KEY_AUTH_VISITS) + 1;
	writeStr(KEY_AUTH_VISITS, String(next));
	return next;
}

/** Checkout success calls this — the next page view becomes moment A. */
export function markOrderCompleted(): void {
	if (!browser) return;
	try {
		sessionStorage.setItem('bb_just_ordered', '1');
	} catch {}
}

/** One-shot read of the just-ordered flag. */
export function consumeOrderCompletedFlag(): boolean {
	if (!browser) return false;
	try {
		const v = sessionStorage.getItem('bb_just_ordered') === '1';
		if (v) sessionStorage.removeItem('bb_just_ordered');
		return v;
	} catch {
		return false;
	}
}

export interface LinkDialogContext {
	isAuthenticated: boolean;
	needsLink: boolean;
	pathname: string;
	justOrdered: boolean;
	authVisits: number;
	onProfilePage: boolean;
}

/** True when the link-accounts dialog is allowed to appear right now. */
export function shouldShowLinkDialog(ctx: LinkDialogContext): boolean {
	if (!browser || !ctx.isAuthenticated || !ctx.needsLink) return false;
	if (LINK_DIALOG_EXCLUDED.some((p) => ctx.pathname === p || ctx.pathname.startsWith(p + '/'))) {
		return false;
	}
	if (readInt(KEY_LINK_DIALOG_IMPRESSIONS) >= LINK_DIALOG_MAX) return false;
	const lastSeen = readInt(KEY_LINK_DIALOG_LAST_SEEN);
	if (lastSeen && Date.now() - lastSeen < LINK_DIALOG_COOLDOWN_MS) return false;
	// At least one smart moment must hold — never fire "just because".
	const momentA = ctx.justOrdered;
	const momentB = ctx.authVisits >= 2;
	const momentC = ctx.onProfilePage;
	return momentA || momentB || momentC;
}

/** Record one link-dialog impression. */
export function markLinkDialogShown(): void {
	if (!browser) return;
	writeStr(KEY_LINK_DIALOG_IMPRESSIONS, String(readInt(KEY_LINK_DIALOG_IMPRESSIONS) + 1));
	writeStr(KEY_LINK_DIALOG_LAST_SEEN, String(Date.now()));
}

/** User dismissed or navigated via CTA — snooze via cooldown. */
export function dismissLinkDialog(): void {
	if (!browser) return;
	writeStr(KEY_LINK_DIALOG_LAST_SEEN, String(Date.now()));
}
