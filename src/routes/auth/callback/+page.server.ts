import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	// Просто логируем - OAuth будет полностью обработан на клиенте
	console.log('🔄 [OAuth] Server callback loaded, delegating to client-side processing');
	console.log('🔍 [OAuth] Server received URL:', url.toString());

	// Никакого редиректа на сервере - пусть клиент сам разберется
	return {};
};
