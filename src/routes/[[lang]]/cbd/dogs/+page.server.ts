import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang || 'uk-ua';

	try {
		// Load content based on language
		let contentModule;

		if (lang === 'en') {
			contentModule = await import('$lib/content/cbd/dogs/en/cbd-dogs-guide.md');
		} else {
			contentModule = await import('$lib/content/cbd/dogs/uk/cbd-dogs-guide.md');
		}

		const content = contentModule.default;
		const metadata = contentModule.metadata || {};

		return {
			title: metadata.title || content.title,
			description: metadata.description || content.description,
			author: metadata.author || content.author || 'Balance Botanica',
			date: metadata.date || content.date,
			readingTime: metadata.readingTime || content.readingTime,
			content: content.body || content.default || content,
			seoData: {
				faq: metadata.faq
					? typeof metadata.faq === 'string'
						? JSON.parse(metadata.faq)
						: metadata.faq
					: []
			}
		};
	} catch (err) {
		console.error('Error loading CBD dogs content:', err);

		// Fallback: return basic structure
		return {
			title:
				lang === 'en'
					? 'CBD for Dogs: Complete Scientific Guide 2024'
					: 'CBD для собак: повний науковий посібник 2024',
			description:
				lang === 'en'
					? 'Complete scientific guide to CBD therapy for dogs.'
					: 'Повний науковий посібник з CBD терапії для собак.',
			author: 'Balance Botanica',
			date: '2024-12-13',
			readingTime: '24 хвилин',
			content: lang === 'en' ? 'Content loading...' : 'Контент завантажується...',
			seoData: {
				faq: []
			}
		};
	}
};
