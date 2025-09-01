import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	console.log('🔄 [OAuth] Server callback loaded');
	console.log('🔍 [OAuth] Server received URL:', url.toString());

	// Проверяем, есть ли OAuth параметры в URL
	const hasOAuthTokens = url.toString().includes('access_token=') ||
	                      url.toString().includes('#access_token=') ||
	                      url.toString().includes('?code=');

	console.log('🔍 [OAuth] Has OAuth tokens:', hasOAuthTokens);

	// Если OAuth параметров нет - пользователь пришел вручную, редиректим на главную
	if (!hasOAuthTokens) {
		console.log('🚀 [OAuth] No OAuth tokens found, instant redirect to home');
		throw redirect(302, '/');
	}

	// Если OAuth параметры есть - обрабатываем на клиенте
	console.log('🔄 [OAuth] OAuth tokens found, delegating to client-side processing');
	return {};
};
