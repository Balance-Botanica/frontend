import type { LayoutLoad } from './$types';
import { initializeI18n } from '$lib/i18n/store';

// Runs on the server (SSR) AND in the browser before first render.
// Awaiting i18n here (instead of only onMount) means crawlers and
// no-JS clients receive fully translated HTML, not an empty shell.
export const load: LayoutLoad = async ({ data }) => {
	const locale = (data as any)?.locale || 'uk-ua';
	try {
		await initializeI18n(locale);
		// The i18next instance is global and shared across SSR requests —
		// make sure it matches THIS request's locale, not a previous one.
		const [{ getCurrentLanguage, changeLanguage }, { setLanguage }] = await Promise.all([
			import('$lib/i18n/index'),
			import('$lib/stores/language')
		]);
		if (getCurrentLanguage() !== locale) {
			await changeLanguage(locale as any);
			setLanguage(locale as any);
		}
	} catch (e) {
		console.error('[layout] i18n init failed, falling back to client init:', e);
	}
	return data;
};
