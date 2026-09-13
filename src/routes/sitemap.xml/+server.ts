import type { RequestHandler } from './$types';
import { ProductRepositoryFactory, ProductService } from '$lib/server/products';
import { blogPostsUK } from '$lib/content/blog-posts/uk-ua';
import { blogPostsEN } from '$lib/content/blog-posts/en';

// TODO: point at the renewed production domain
const SITE = 'https://balance-botanica.com';

const STATIC_PATHS = ['', '/products', '/blog', '/about', '/contacts'];

export const GET: RequestHandler = async () => {
	const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];
	const today = new Date().toISOString().split('T')[0];

	// Static pages, both locales (default uk has no prefix)
	for (const path of STATIC_PATHS) {
		urls.push({ loc: `${SITE}${path}`, lastmod: today, changefreq: 'weekly', priority: path === '' ? '1.0' : '0.8' });
		urls.push({ loc: `${SITE}/en${path}`, lastmod: today, changefreq: 'weekly', priority: path === '' ? '1.0' : '0.8' });
	}

	// Products (both locales, canonical uk URL + en alternate)
	try {
		const service = new ProductService(ProductRepositoryFactory.createFromConfig());
		const products = await service.getAllProducts();
		for (const p of products) {
			const updated = p.updatedAt instanceof Date ? p.updatedAt.toISOString().split('T')[0] : today;
			urls.push({ loc: `${SITE}/products/${p.id}`, lastmod: updated, changefreq: 'weekly', priority: '0.9' });
			urls.push({ loc: `${SITE}/en/products/${p.id}`, lastmod: updated, changefreq: 'weekly', priority: '0.9' });
		}
	} catch (e) {
		console.error('sitemap: failed to load products', e);
	}

	// Blog articles
	for (const post of blogPostsUK) {
		urls.push({ loc: `${SITE}/blog/${post.slug}`, lastmod: post.date, changefreq: 'monthly', priority: '0.7' });
	}
	for (const post of blogPostsEN) {
		urls.push({ loc: `${SITE}/en/blog/${post.slug}`, lastmod: post.date, changefreq: 'monthly', priority: '0.7' });
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
		.map(
			(u) =>
				`  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
		)
		.join('\n')}\n</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'max-age=3600' }
	});
};
