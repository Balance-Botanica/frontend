<script lang="ts">
	import ArticleTOC from './ArticleTOC.svelte';
	import ArticleKeyPoints from './ArticleKeyPoints.svelte';

	interface Props {
		toc?: Array<{ href: string; text: string }>;
		keyPoints?: string[];
		lang?: string;
		children?: any;
		content?: string;
	}

	const { toc = [], keyPoints = [], lang = 'uk-ua', children, content = '' }: Props = $props();

	const isEnglish = $derived(lang === 'en');

	// Function to generate slug from text
	function generateSlug(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-|-$/g, '') // Remove leading/trailing hyphens
			.substring(0, 50); // Limit length
	}

	// Function to add IDs to headings in HTML content
	function addHeadingIds(htmlContent: string): string {
		// Always try to process, even on server side if possible
		if (!htmlContent) return htmlContent;

		try {
			// For server-side rendering, we'll skip DOM manipulation
			// and just return the content as-is for now
			if (typeof window === 'undefined') {
				return htmlContent;
			}

			// Create a temporary DOM element to parse HTML
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = htmlContent;

			// Find all headings and add IDs
			const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
			headings.forEach((heading, index) => {
				if (!heading.id) {
					// Generate ID from heading text
					const text = heading.textContent || '';
					const id = generateSlug(text);

					// Ensure unique ID by adding index if needed
					let counter = 1;
					let uniqueId = id;
					while (tempDiv.querySelector(`#${uniqueId}`)) {
						uniqueId = `${id}-${counter}`;
						counter++;
					}

					if (uniqueId) {
						heading.id = uniqueId;
					}
				}
			});

			return tempDiv.innerHTML;
		} catch (error) {
			console.warn('Error processing HTML content:', error);
			return htmlContent;
		}
	}

	// Processed content with heading IDs
	const processedContent = $derived(addHeadingIds(content));

	// Auto-generate TOC from content headings
	const autoToc = $derived(() => {
		if (!content || typeof window === 'undefined') return [];

		try {
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = content;
			const headings = tempDiv.querySelectorAll('h2, h3');

			return Array.from(headings)
				.map((heading) => {
					const text = heading.textContent || '';
					const id = generateSlug(text);
					return {
						href: `#${id}`,
						text: text,
						level: parseInt(heading.tagName.charAt(1))
					};
				})
				.filter((item) => item.text.trim());
		} catch (error) {
			return [];
		}
	});

	// Use auto-generated TOC if no manual TOC provided
	const finalToc = $derived(toc.length > 0 ? toc : autoToc);

	// Handle smooth scrolling to anchors
	function handleAnchorClick(event: Event) {
		// For keyboard events, only handle Enter and Space
		if (event.type === 'keydown') {
			const keyboardEvent = event as KeyboardEvent;
			if (keyboardEvent.key !== 'Enter' && keyboardEvent.key !== ' ') {
				return;
			}
		}

		const target = event.target as HTMLElement;
		if (target.tagName === 'A') {
			const href = target.getAttribute('href');
			if (href && href.startsWith('#')) {
				event.preventDefault();
				const element = document.getElementById(href.substring(1));
				if (element) {
					element.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Update URL without triggering navigation
					history.pushState(null, '', href);
				}
			}
		}
	}
</script>

<!-- Key Points after hero -->
{#if keyPoints.length > 0}
	<section class="article-key-points-section">
		<ArticleKeyPoints {keyPoints} {lang} />
	</section>
{/if}

{#if finalToc.length > 0}
	<div class="article-content-grid" onclick={handleAnchorClick} onkeydown={handleAnchorClick}>
		<aside class="article-sidebar">
			<ArticleTOC toc={finalToc} {lang} />
		</aside>

		<article class="article-main">
			<div class="article-content">
				{#if content}
					{@html processedContent}
				{:else}
					{@render children?.()}
				{/if}
			</div>
		</article>
	</div>
{:else}
	<article class="article-main article-main-fullwidth">
		<div class="article-content">
			{#if content}
				{@html processedContent}
			{:else}
				{@render children?.()}
			{/if}
		</div>
	</article>
{/if}

<style>
	.article-content-grid {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 3rem;
		margin-bottom: 3rem;
	}

	.article-key-points-section {
		margin-bottom: 3rem;
	}

	.article-sidebar {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.article-main {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		min-height: 600px;
	}

	.article-main-fullwidth {
		width: 100%;
		max-width: none;
	}

	.article-content {
		padding: 3rem;
		line-height: 1.8;
	}

	.article-content :global(h2) {
		color: #1e293b;
		font-size: 2rem;
		font-weight: 700;
		margin: 3rem 0 1.5rem 0;
		border-bottom: 3px solid rgb(75, 118, 110);
		padding-bottom: 0.5rem;
		scroll-margin-top: 2rem;
	}

	.article-content :global(h3) {
		color: #374151;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 2rem 0 1rem 0;
		scroll-margin-top: 2rem;
	}

	.article-content :global(h4) {
		color: #4b5563;
		font-size: 1.25rem;
		font-weight: 600;
		margin: 1.5rem 0 0.75rem 0;
	}

	.article-content :global(p) {
		margin-bottom: 1.5rem;
		color: #475569;
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}

	.article-content :global(li) {
		margin-bottom: 0.75rem;
		color: #475569;
		line-height: 1.6;
	}

	.article-content :global(blockquote) {
		border-left: 4px solid rgb(75, 118, 110);
		padding-left: 1.5rem;
		margin: 2rem 0;
		font-style: italic;
		color: #64748b;
		background: #f8fafc;
		padding: 1.5rem;
		border-radius: 0 8px 8px 0;
	}

	.article-content :global(a) {
		color: rgb(75, 118, 110);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border-bottom: 1px solid transparent;
	}

	.article-content :global(a:hover) {
		color: rgb(65, 105, 100);
		text-decoration: underline;
		border-bottom-color: rgb(65, 105, 100);
	}

	.article-content :global(strong) {
		font-weight: 600;
		color: #1e293b;
	}

	.article-content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.article-content :global(th),
	.article-content :global(td) {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #e5e7eb;
	}

	.article-content :global(th) {
		background: rgb(75, 118, 110);
		color: white;
		font-weight: 600;
	}

	.article-content :global(tr:nth-child(even)) {
		background: #f9fafb;
	}

	@media (max-width: 1024px) {
		.article-content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.article-sidebar {
			order: 2;
		}

		.article-main {
			order: 1;
		}
	}

	@media (max-width: 768px) {
		.article-content {
			padding: 2rem;
		}

		.article-content :global(h2) {
			font-size: 1.75rem;
		}

		.article-content :global(h3) {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		.article-content {
			padding: 1.5rem;
		}

		.article-content :global(h2) {
			font-size: 1.5rem;
		}

		.article-content :global(h3) {
			font-size: 1.125rem;
		}
	}

	/* Global smooth scrolling */
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
