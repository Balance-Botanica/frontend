import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Функция для расчета времени чтения на основе текста
function calculateReadingTime(text: string): number {
	// Средняя скорость чтения - 200 слов в минуту
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / wordsPerMinute);
	return Math.max(1, minutes); // Минимум 1 минута
}

// Функция для извлечения метаданных из pillar статьи
async function getPillarArticleMetadata(lang: string, slug: string) {
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	let contentPath = '';

	// Определяем путь к MD файлу в зависимости от структуры
	if (slug === 'cbd') {
		contentPath = join(process.cwd(), 'src', 'lib', 'content', 'cbd', langDir, 'cbd-guide.md');
	} else if (slug === 'cbd/dogs') {
		// Для cbd/dogs используем import вместо чтения файла
		try {
			let contentModule;
			if (lang === 'en') {
				contentModule = await import('$lib/content/cbd/dogs/en/cbd-dogs-guide.md');
			} else {
				contentModule = await import('$lib/content/cbd/dogs/uk/cbd-dogs-guide.md');
			}
			const content = contentModule.default;
			const metadata = contentModule.metadata || {};

			let textForReadingTime = '';
			if (typeof content === 'string') {
				textForReadingTime = content;
			} else if (content.body) {
				textForReadingTime = content.body.replace(/<[^>]*>/g, ' ');
			}

			const calculatedReadingTime = textForReadingTime
				? calculateReadingTime(textForReadingTime)
				: 12;

			return {
				title: metadata.title || content.title,
				description: metadata.description || content.description,
				author: metadata.author || content.author || 'Balance Botanica',
				date: metadata.date || content.date,
				readingTime: metadata.readingTime ? parseInt(metadata.readingTime) : calculatedReadingTime,
				tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
				slug: slug,
				type: 'pillar' as const
			};
		} catch (err) {
			console.error(`Error loading ${slug} content:`, err);
			return null;
		}
	} else if (slug.includes('/')) {
		// Для других сложных путей (cbd/cats, cbd/types, dogs/arthritis, pets/thc-toxicity)
		const [category, subCategory] = slug.split('/');
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			category,
			subCategory,
			langDir,
			`${subCategory}-guide.md`
		);
	} else {
		// Для простых путей (cats-health, dog-health, veterinary-cbd)
		contentPath = join(process.cwd(), 'src', 'lib', 'content', slug, langDir, `${slug}-guide.md`);
	}

	// Если файл не существует для текущего языка, используем fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		if (slug.includes('/')) {
			const [category, subCategory] = slug.split('/');
			contentPath = join(
				process.cwd(),
				'src',
				'lib',
				'content',
				category,
				subCategory,
				fallbackLangDir,
				`${subCategory}-guide.md`
			);
		} else {
			contentPath = join(
				process.cwd(),
				'src',
				'lib',
				'content',
				slug,
				fallbackLangDir,
				`${slug}-guide.md`
			);
		}
	}

	if (!existsSync(contentPath)) {
		return null;
	}

	try {
		const fileContent = readFileSync(contentPath, 'utf-8');
		const parts = fileContent.split('---');

		if (parts.length < 3) {
			return null;
		}

		const frontmatter = parts[1];
		const markdownContent = parts.slice(2).join('---').trim();

		const metadata: any = {};
		frontmatter.split('\n').forEach((line) => {
			const [key, ...valueParts] = line.split(':');
			if (key && valueParts.length > 0) {
				const value = valueParts.join(':').trim();
				metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
			}
		});

		const calculatedReadingTime = calculateReadingTime(markdownContent);

		return {
			title: metadata.title,
			description: metadata.description,
			author: metadata.author || 'Balance Botanica',
			date: metadata.date,
			readingTime: metadata.readingTime ? parseInt(metadata.readingTime) : calculatedReadingTime,
			tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
			slug: slug,
			type: 'pillar' as const
		};
	} catch (error) {
		console.error(`Error reading ${slug} metadata:`, error);
		return null;
	}
}

// Функция для получения blog статей
async function getBlogArticles(lang: string) {
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';

	try {
		let blogPosts;
		if (currentLocale === 'uk-ua') {
			const { blogPostsUK } = await import('$lib/content/blog-posts/uk-ua.ts');
			blogPosts = blogPostsUK;
		} else {
			const { blogPostsEN } = await import('$lib/content/blog-posts/en.ts');
			blogPosts = blogPostsEN;
		}

		return blogPosts.map((post) => ({
			...post,
			type: 'blog' as const
		}));
	} catch (error) {
		console.error('Error loading blog posts:', error);
		return [];
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const lang = url.searchParams.get('lang') || 'uk-ua';

	try {
		// Получаем метаданные всех pillar статей
		const pillarSlugs = [
			'cbd',
			'dog-health',
			'cats-health',
			'veterinary-cbd',
			'cbd/dogs',
			'cbd/cats',
			'cbd/types',
			'dogs/arthritis',
			'pets/thc-toxicity'
		];

		const pillarArticles = [];
		for (const slug of pillarSlugs) {
			const article = await getPillarArticleMetadata(lang, slug);
			if (article) {
				pillarArticles.push(article);
			}
		}

		// Получаем blog статьи
		const blogArticles = await getBlogArticles(lang);

		// Объединяем все статьи: сначала pillar, потом blog, внутри каждой группы сортировка по дате
		const pillarArticlesSorted = pillarArticles.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
		const blogArticlesSorted = blogArticles.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
		const allArticles = [...pillarArticlesSorted, ...blogArticlesSorted];

		return json({
			articles: allArticles,
			lang
		});
	} catch (error) {
		console.error('Error in blog articles API:', error);
		return json({ error: 'Failed to load articles' }, { status: 500 });
	}
};
