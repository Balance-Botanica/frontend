import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';

// Функция для расчета времени чтения на основе текста
function calculateReadingTime(text: string): number {
	// Средняя скорость чтения - 200 слов в минуту
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes); // Минимум 1 минута
}

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

		// Настраиваем marked для лучшей семантики
		marked.setOptions({
			breaks: true,
			gfm: true,
			headerIds: true,
			mangle: false
		});

		// Преобразуем markdown в HTML
		let htmlContent = '';
		let rawMarkdown = '';

		if (typeof content === 'string') {
			rawMarkdown = content;
			htmlContent = marked(content);
		} else if (content.body) {
			rawMarkdown = content.body;
			htmlContent = marked(content.body);
		} else if (content.default) {
			rawMarkdown = content.default;
			htmlContent = marked(content.default);
		} else {
			// Fallback если контент не найден
			htmlContent = '<p>Content not available</p>';
		}

		// Рассчитываем время чтения
		const calculatedReadingTime = rawMarkdown ? calculateReadingTime(rawMarkdown) : 12;

		return {
			title: metadata.title || content.title,
			description: metadata.description || content.description,
			author: metadata.author || content.author || 'Balance Botanica',
			date: metadata.date || content.date,
			readingTime: metadata.readingTime ? parseInt(metadata.readingTime) : calculatedReadingTime,
			content: htmlContent,
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
			readingTime: 12, // дефолтное значение в минутах
			content: lang === 'en' ? 'Content loading...' : 'Контент завантажується...',
			seoData: {
				faq: []
			}
		};
	}
};
