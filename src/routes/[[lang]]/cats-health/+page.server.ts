import type { PageServerLoad } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

// Функция для парсинга YAML-подобного frontmatter
function parseFrontmatter(frontmatter: string): any {
	const metadata: any = {};

	const lines = frontmatter
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line);
	let currentKey = '';
	let currentArray: string[] = [];
	let inArray = false;

	for (const line of lines) {
		if (line.startsWith('- ')) {
			// Это элемент массива
			if (inArray && currentKey) {
				currentArray.push(line.substring(2).replace(/^["']|["']$/g, ''));
			}
		} else if (line.includes(':')) {
			// Сохраняем предыдущий массив если он был
			if (inArray && currentKey) {
				metadata[currentKey] = currentArray;
				currentArray = [];
				inArray = false;
			}

			const [key, ...valueParts] = line.split(':');
			const trimmedKey = key.trim();
			const value = valueParts.join(':').trim();

			if (value === '') {
				// Начало массива
				currentKey = trimmedKey;
				currentArray = [];
				inArray = true;
			} else {
				// Обычное значение
				metadata[trimmedKey] = value.replace(/^["']|["']$/g, '');
			}
		}
	}

	// Сохраняем последний массив если он был
	if (inArray && currentKey) {
		metadata[currentKey] = currentArray;
	}

	return metadata;
}

// Функция для расчета времени чтения на основе текста
function calculateReadingTime(text: string): number {
	// Средняя скорость чтения - 200 слов в минуту
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes); // Минимум 1 минута
}

export const load: PageServerLoad = async ({ params }) => {
	// Получаем язык из параметров маршрута
	const lang = params.lang || 'uk-ua';
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	// Путь к MD файлу для страницы здоровья кошек
	let contentPath = join(
		process.cwd(),
		'src',
		'lib',
		'content',
		'cats-health',
		langDir,
		'cats-health-guide.md'
	);

	// Если файл не существует для текущего языка, используем fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			'cats-health',
			fallbackLangDir,
			'cats-health-guide.md'
		);
	}

	let content = '';
	const metadata: any = {};
	let readingTime = 18; // дефолтное значение

	if (existsSync(contentPath)) {
		try {
			const fileContent = readFileSync(contentPath, 'utf-8');

			// Парсим frontmatter и контент
			const parts = fileContent.split('---');
			if (parts.length >= 3) {
				const frontmatter = parts[1];
				const markdownContent = parts.slice(2).join('---').trim();

				// Парсим frontmatter с поддержкой массивов
				Object.assign(metadata, parseFrontmatter(frontmatter));

				// Рассчитываем время чтения на основе markdown контента
				readingTime = calculateReadingTime(markdownContent);

				// Настраиваем marked для лучшей семантики
				marked.setOptions({
					breaks: true,
					gfm: true,
					headerIds: true,
					mangle: false
				});

				content = marked(markdownContent);
			}
		} catch (error) {
			console.error('Error loading cats health content:', error);
		}
	}

	// Дефолтные значения если MD файл не найден
	const defaultTitle =
		currentLocale === 'en'
			? 'Cat Health: Natural Wellness Guide 2024'
			: "Здоров'я котів: комплексний натуральний підхід 2024";

	const defaultDescription =
		currentLocale === 'en'
			? 'Complete guide to natural cat health. Learn about nutrition, supplements, CBD therapy, and holistic care for your feline friend.'
			: "Повний посібник з натурального здоров'я котів. Дізнайтеся про харчування, добавки, CBD терапію та цілісний догляд за вашим котом.";

	return {
		lang: currentLocale,
		title: metadata.title || defaultTitle,
		description: metadata.description || defaultDescription,
		date: metadata.date || new Date().toISOString(),
		author: metadata.author || 'Balance Botanica',
		tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
		readingTime: metadata.readingTime ? parseInt(metadata.readingTime) : readingTime,
		keyPoints: metadata.keyPoints || [],
		content: content || '',
		seoData: {
			faq: metadata.faq ? JSON.parse(metadata.faq) : [],
			schema: metadata.schema || '',
			keywords: metadata.keywords || ''
		}
	};
};
