import type { PageServerLoad } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { marked } from 'marked';

export const load: PageServerLoad = async ({ params }) => {
	const { slug, lang } = params;

	// Get current locale from optional route parameter or default to Ukrainian
	const currentLocale = lang === 'en' ? 'en' : 'uk-ua';
	const langDir = currentLocale === 'uk-ua' ? 'uk' : 'en';

	// Try to load content for current locale
	let contentPath = join(process.cwd(), 'src', 'lib', 'content', 'blog', langDir, `${slug}.md`);

	// If file doesn't exist for current locale, try fallback
	const fallbackLangDir = currentLocale === 'uk-ua' ? 'en' : 'uk';
	if (!existsSync(contentPath)) {
		contentPath = join(
			process.cwd(),
			'src',
			'lib',
			'content',
			'blog',
			fallbackLangDir,
			`${slug}.md`
		);
	}

	if (!existsSync(contentPath)) {
		throw new Error(`Article not found: ${slug}`);
	}

	try {
		const content = readFileSync(contentPath, 'utf-8');

		// Parse frontmatter and content
		const parts = content.split('---');
		if (parts.length < 3) {
			throw new Error('Invalid article format');
		}

		const frontmatter = parts[1];
		const markdownContent = parts.slice(2).join('---').trim();

		// Parse frontmatter (simple implementation)
		const metadata: any = {};
		frontmatter.split('\n').forEach((line) => {
			const [key, ...valueParts] = line.split(':');
			if (key && valueParts.length > 0) {
				const value = valueParts.join(':').trim();
				metadata[key.trim()] = value.replace(/^["']|["']$/g, ''); // Remove quotes
			}
		});

		// Parse tags if they exist
		let tags = [];
		if (metadata.tags) {
			try {
				tags = JSON.parse(metadata.tags);
			} catch {
				tags = metadata.tags.split(',').map((tag: string) => tag.trim());
			}
		}

		return {
			title: metadata.title || '',
			description: metadata.description || '',
			date: metadata.date || '',
			author: metadata.author || '',
			tags,
			content: marked(markdownContent),
			slug
		};
	} catch (error) {
		console.error('Error loading article:', error);
		throw error;
	}
};
