import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

// Унифицированная функция для парсинга YAML-подобного frontmatter
export function parseFrontmatter(frontmatter: string): any {
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
				// Обычное значение - проверяем, является ли оно JSON строкой
				let processedValue = value.replace(/^["']|["']$/g, '');
				if (processedValue.startsWith('[') || processedValue.startsWith('{')) {
					try {
						processedValue = JSON.parse(processedValue);
					} catch (e) {
						// Если не JSON, оставляем как есть
					}
				}
				metadata[trimmedKey] = processedValue;
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
export function calculateReadingTime(text: string): number {
	// Средняя скорость чтения - 200 слов в минуту
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes); // Минимум 1 минута
}

// Унифицированная функция для загрузки контента статьи
export async function loadArticleContent(
	contentDir: string,
	fileName: string,
	lang: string,
	defaultReadingTime: number = 15
): Promise<{
	content: string;
	metadata: any;
	readingTime: number;
}> {
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	// Путь к MD файлу
	let contentPath = join(process.cwd(), 'src', 'lib', 'content', contentDir, langDir, fileName);

	// Если файл не существует для текущего языка, используем fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			contentDir,
			fallbackLangDir,
			fileName
		);
	}

	let content = '';
	const metadata: any = {};
	let readingTime = defaultReadingTime;

	if (existsSync(contentPath)) {
		try {
			const fileContent = readFileSync(contentPath, 'utf-8');

			// Парсим frontmatter и контент
			const parts = fileContent.split('---');
			if (parts.length >= 3) {
				const frontmatter = parts[1];
				const markdownContent = parts.slice(2).join('---').trim();

				// Парсим frontmatter с поддержкой массивов и JSON
				Object.assign(metadata, parseFrontmatter(frontmatter));

				// Рассчитываем время чтения на основе markdown контента
				readingTime = calculateReadingTime(markdownContent);

				// Преобразуем markdown в HTML с унифицированными настройками
				content = await marked.parse(markdownContent, {
					breaks: true,
					gfm: true
				} as any);
			}
		} catch (error) {
			console.error(`Error loading ${contentDir} content:`, error);
		}
	}

	return {
		content: content || '',
		metadata,
		readingTime
	};
}
