// Ukrainian phone helpers: single source of truth for the +38 mask.
// Stored value = plain digits, e.g. '380991234567' (max 12).
// Display value = progressive mask '+38 (0XX) XXX-XX-XX'.
// E.164 for API/orders = '+' + digits.

/** Strip to digits and normalize to the UA national format (380 + 9 digits). */
export function normalizeUaPhone(raw: string): string {
	let d = (raw || '').replace(/\D/g, '');
	if (d.startsWith('380')) {
		d = d.slice(0, 12);
	} else if (d.length === 10 && d.startsWith('0')) {
		d = '38' + d;
	} else if (d.length === 9) {
		d = '380' + d;
	} else if (d.length === 11 && d.startsWith('80')) {
		d = '3' + d; // pasted without the leading zero
	} else {
		d = d.slice(0, 12);
	}
	return d;
}

/** Progressive display mask. Empty input -> '' (placeholder shows instead). */
export function formatUaPhone(digits: string): string {
	const d = normalizeUaPhone(digits);
	if (!d) return '';
	// National part after the 38 country code (normally starts with 0).
	const rest = d.startsWith('38') ? d.slice(2).slice(0, 10) : d.slice(0, 10);
	let out = '+38';
	if (!rest.length) return out;
	out += ' (' + rest.slice(0, 3);
	if (rest.length < 3) return out;
	out += ')';
	const p1 = rest.slice(3, 6);
	const p2 = rest.slice(6, 8);
	const p3 = rest.slice(8, 10);
	if (p1) out += ' ' + p1;
	if (p2) out += '-' + p2;
	if (p3) out += '-' + p3;
	return out;
}

/** Complete UA mobile number: 380 + exactly 9 digits. */
export function isCompleteUaPhone(digits: string): boolean {
	return /^380\d{9}$/.test(normalizeUaPhone(digits));
}

/** E.164 for orders/profile API, e.g. '+380991234567'. */
export function toE164Ua(digits: string): string {
	return '+' + normalizeUaPhone(digits);
}

/**
 * Map a caret offset in the old display string to the new formatted string
 * by counting digits — keeps the caret stable while typing/deleting.
 */
export function remapCaret(oldDisplay: string, oldCaret: number, newDisplay: string): number {
	const digitsBefore = oldDisplay.slice(0, Math.max(0, oldCaret)).replace(/\D/g, '').length;
	if (digitsBefore === 0) return 0;
	let seen = 0;
	for (let i = 0; i < newDisplay.length; i++) {
		if (/\d/.test(newDisplay[i])) {
			seen++;
			if (seen === digitsBefore) return i + 1;
		}
	}
	return newDisplay.length;
}
