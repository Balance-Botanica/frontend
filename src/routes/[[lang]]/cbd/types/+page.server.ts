import type { PageServerLoad } from './$types';
import { loadArticleContent } from '$lib/utils/contentLoader';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang || 'uk-ua';
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';

	const { content, metadata, readingTime } = await loadArticleContent(
		'cbd/types',
		'cbd-types-guide.md',
		lang,
		10
	);

	return {
		lang: currentLocale,
		title: metadata.title || '',
		description: metadata.description || '',
		date: metadata.date || new Date().toISOString(),
		author: metadata.author || 'Balance Botanica',
		tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
		readingTime: metadata.readingTime ? parseInt(metadata.readingTime) : readingTime,
		keyPoints: metadata.keyPoints || [],
		content,
		seoData: {
			faq: metadata.faq || [],
			schema: metadata.schema || '',
			keywords: metadata.keywords || ''
		}
	};
};
