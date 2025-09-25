import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang || 'uk-ua';

	// Возвращаем пустой массив - данные будут загружены на клиенте
	return {
		articles: [],
		lang
	};
};
