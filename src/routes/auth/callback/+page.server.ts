import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	// Просто логируем и редиректим на главную
	// OAuth будет обработан на клиенте через auth store
	console.log('🔄 [OAuth] Server callback loaded, redirecting to home for client-side processing');
	console.log('🔍 [OAuth] Server received URL:', url.toString());
	console.log('🔍 [OAuth] Server received hash:', url.hash);

	throw redirect(302, '/');
};