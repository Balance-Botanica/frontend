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

export const load: PageServerLoad = async ({ params }) => {
	// Получаем язык из параметров маршрута
	const lang = params.lang || 'uk-ua';
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	// Путь к MD файлу для страницы видов CBD
	let contentPath = join(
		process.cwd(),
		'src',
		'lib',
		'content',
		'cbd',
		'types',
		langDir,
		'cbd-types-guide.md'
	);

	// Если файл не существует для текущего языка, используем fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			'cbd',
			'types',
			fallbackLangDir,
			'cbd-types-guide.md'
		);
	}

	let content = '';
	const metadata: any = {};

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
			console.error('Error loading CBD types content:', error);
		}
	}

	// Дефолтные значения если MD файл не найден
	const defaultTitle =
		currentLocale === 'en'
			? 'CBD Types: Isolate vs Full Spectrum vs Broad Spectrum 2024'
			: 'Види CBD: ізолят, повний спектр, широкий спектр 2024';

	const defaultDescription =
		currentLocale === 'en'
			? 'Complete guide to CBD types: isolate, full spectrum, broad spectrum. Compare benefits, scientific evidence, and choose the right CBD form for your needs.'
			: 'Повний посібник з видів CBD: ізолят, повний спектр, широкий спектр. Порівняння переваг, наукові докази та вибір правильної форми CBD.';

	return {
		lang: currentLocale,
		title: metadata.title || defaultTitle,
		description: metadata.description || defaultDescription,
		date: metadata.date || new Date().toISOString(),
		author: metadata.author || 'Balance Botanica',
		tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
		keyPoints: metadata.keyPoints || [],
		content: content || '',
		seoData: {
			faq: metadata.faq ? JSON.parse(metadata.faq) : [],
			schema: metadata.schema || '',
			keywords: metadata.keywords || ''
		}
	};
};
