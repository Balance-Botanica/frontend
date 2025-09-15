import type { PageServerLoad } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	// Получаем язык из параметров маршрута
	const lang = params.lang || 'uk-ua';
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	// Путь к MD файлу для статьи об артрите собак
	let contentPath = join(
		process.cwd(),
		'src',
		'lib',
		'content',
		'dogs',
		'arthritis',
		langDir,
		'dog-arthritis-guide.md'
	);

	// Если файл не существует для текущего языка, используем fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			'dogs',
			'artritis',
			fallbackLangDir,
			'dog-arthritis-guide.md'
		);
	}

	let content = '';
	let metadata: any = {};

	if (existsSync(contentPath)) {
		try {
			const fileContent = readFileSync(contentPath, 'utf-8');

			// Парсим frontmatter и контент
			const parts = fileContent.split('---');
			if (parts.length >= 3) {
				const frontmatter = parts[1];
				const markdownContent = parts.slice(2).join('---').trim();

				// Парсим frontmatter
				frontmatter.split('\n').forEach((line) => {
					const [key, ...valueParts] = line.split(':');
					if (key && valueParts.length > 0) {
						const value = valueParts.join(':').trim();
						metadata[key.trim()] = value.replace(/^["']|["']$/g, ''); // Убираем кавычки
					}
				});

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
			console.error('Error loading dog arthritis content:', error);
		}
	}

	// Дефолтные значения если MD файл не найден
	const defaultTitle =
		currentLocale === 'en'
			? 'Arthritis in Dogs: Natural Treatment and Prevention Guide 2024'
			: 'Артрит у собак: натуральне лікування та профілактика 2024';

	const defaultDescription =
		currentLocale === 'en'
			? 'Complete guide to dog arthritis: symptoms, natural treatments, CBD therapy, prevention and management strategies for your senior dog.'
			: 'Повний посібник по артриті у собак: симптоми, натуральне лікування, CBD терапія, профілактика та стратегії управління для вашого літнього собаки.';

	return {
		lang: currentLocale,
		title: metadata.title || defaultTitle,
		description: metadata.description || defaultDescription,
		date: metadata.date || new Date().toISOString(),
		author: metadata.author || 'Balance Botanica',
		tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
		content: content || '',
		seoData: {
			faq: metadata.faq ? JSON.parse(metadata.faq) : [],
			schema: metadata.schema || '',
			keywords: metadata.keywords || ''
		}
	};
};
