import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// For the v2 coming soon page, we don't need to load any products
	// This is a simple page focused on email collection and anticipation building
	return {};
};