<script lang="ts">
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';
	import EmailSubscription from '$lib/components/EmailSubscription.svelte';
	import { currentLocale } from '$lib/i18n/store';

	// Detect language from optional route parameter
	let lang = $derived($page.params?.lang || 'uk-ua');

	// Blog posts data for different languages
	const blogPostsData = {
		'uk-ua': [
			{
				title: "Що таке CBD і як він працює?",
				description: "Повний гід по каннабидіолу, його механізм дії та користь для здоров'я. Розбираємося в науці за CBD.",
				date: "2025-01-01",
				author: "Команда Balance Botanica",
				tags: ["CBD", "Здоров'я", "Наука"],
				slug: "cbd-explained",
				readingTime: 8
			},
			{
				title: "CBD для спортивного відновлення",
				description: "Як CBD допомагає спортсменам відновлюватися після тренувань, зменшувати запалення та покращувати сон.",
				date: "2025-01-02",
				author: "Команда Balance Botanica",
				tags: ["CBD", "Спорт", "Відновлення"],
				slug: "cbd-sports-recovery",
				readingTime: 6
			},
			{
				title: "Як вибрати якісну CBD олію?",
				description: "Посібник з вибору CBD продуктів: типи екстракції, сертифікати якості та що шукати в складі.",
				date: "2025-01-03",
				author: "Команда Balance Botanica",
				tags: ["CBD", "Продукти", "Якість"],
				slug: "cbd-quality-guide",
				readingTime: 7
			}
		],
		'en': [
			{
				title: "What is CBD and How Does It Work?",
				description: "Complete guide to cannabidiol, its mechanism of action and health benefits. Understanding the science behind CBD.",
				date: "2025-01-01",
				author: "Balance Botanica Team",
				tags: ["CBD", "Health", "Science"],
				slug: "cbd-explained",
				readingTime: 8
			},
			{
				title: "CBD for Sports Recovery",
				description: "How CBD helps athletes recover from workouts, reduce inflammation, and improve sleep.",
				date: "2025-01-02",
				author: "Balance Botanica Team",
				tags: ["CBD", "Sports", "Recovery"],
				slug: "cbd-sports-recovery",
				readingTime: 6
			},
			{
				title: "How to Choose Quality CBD Oil?",
				description: "Guide to selecting CBD products: extraction types, quality certificates, and what to look for in composition.",
				date: "2025-01-03",
				author: "Balance Botanica Team",
				tags: ["CBD", "Products", "Quality"],
				slug: "cbd-quality-guide",
				readingTime: 7
			}
		]
	};

	// Get current blog posts based on detected language
	let blogPosts = $derived(blogPostsData[lang === 'en' ? 'en' : 'uk-ua']);

	// Format date based on detected language
	const formattedDate = (date: string) => {
		const localeMap = {
			'uk': 'uk-UA',
			'en': 'en-US'
		};
		return new Date(date).toLocaleDateString(localeMap[lang] || 'uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	// Get translations based on detected language
	let pageTitle = $derived(lang === 'en' ? 'Blog - Balance Botanica' : 'Блог - Balance Botanica');
	let pageDescription = $derived(lang === 'en'
		? 'Articles about CBD, health and natural products. Learn more about the benefits of cannabinoids and how they can improve your life.'
		: 'Статті про CBD, здоров\'я та натуральні продукти. Дізнайтеся більше про користь каннабіноїдів та як вони можуть покращити ваше життя.';
	let blogTitle = $derived(lang === 'en' ? 'Balance Botanica Blog' : 'Блог Balance Botanica');
	let blogSubtitle = $derived(lang === 'en'
		? 'Articles about CBD, health and natural products'
		: 'Статті про CBD, здоров\'я та натуральні продукти');
	let readMoreText = $derived(lang === 'en' ? 'Read more' : 'Читати далі');
	let readingTimeLabel = $derived(lang === 'en' ? 'min' : 'хв');
</script>

<SEO
	title={pageTitle}
	description={pageDescription}
	locale={$page.data.locale}
/>

<main class="blog-main">
	<div class="blog-container">
		<!-- Blog header -->
		<header class="blog-header">
			<h1 class="blog-title">{blogTitle}</h1>
			<p class="blog-subtitle">{blogSubtitle}</p>
		</header>

		<!-- Blog posts grid -->
		<section class="blog-posts">
			<div class="posts-grid">
				{#each blogPosts as post}
					<article class="post-card">
						<div class="post-content">
							<div class="post-meta">
								<span class="date">📅 {formattedDate(post.date)}</span>
								<span class="reading-time">📖 {post.readingTime} {readingTimeLabel}</span>
							</div>

							<h2 class="post-title">
								<a href="{lang === 'uk' ? '' : `/${lang}`}/blog/{post.slug}" class="post-link">
									{post.title}
								</a>
							</h2>

							<p class="post-description">{post.description}</p>

							{#if post.tags && post.tags.length > 0}
								<div class="post-tags">
									{#each post.tags as tag}
										<span class="tag">#{tag}</span>
									{/each}
								</div>
							{/if}

							<div class="post-footer">
								<span class="author">✍️ {post.author}</span>
								<a href="{lang === 'uk' ? '' : `/${lang}`}/blog/{post.slug}" class="read-more">
									{readMoreText} →
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<!-- Newsletter section -->
		<section class="newsletter-section">
			<EmailSubscription compact={true} />
		</section>
	</div>
</main>

<style>
	.blog-main {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 40px 0;
	}

	.blog-container {
		/* Container now allows full width for newsletter */
	}

	.blog-header {
		max-width: 1200px;
		margin: 0 auto 48px auto;
		padding: 0 20px;
		text-align: center;
	}

	.blog-title {
		font-family: 'Nunito', sans-serif;
		font-size: 48px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.blog-subtitle {
		font-size: 20px;
		color: #666;
		margin: 0;
		font-weight: 400;
	}

	.blog-posts {
		max-width: 1200px;
		margin: 0 auto 64px auto;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 32px;
	}

	.post-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		overflow: hidden;
	}

	.post-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
	}

	.post-content {
		padding: 24px;
	}

	.post-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: #666;
		margin-bottom: 16px;
		font-weight: 500;
	}

	.post-title {
		margin: 0 0 12px 0;
		line-height: 1.3;
	}

	.post-link {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #1a1a1a;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.post-link:hover {
		color: #4B766E;
	}

	.post-description {
		font-size: 16px;
		color: #666;
		line-height: 1.6;
		margin: 0 0 16px 0;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 16px;
	}

	.tag {
		background: #f0f0f0;
		color: #4B766E;
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 500;
	}

	.post-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 16px;
		border-top: 1px solid #f0f0f0;
	}

	.author {
		font-size: 12px;
		color: #666;
		font-weight: 500;
	}

	.read-more {
		color: #4B766E;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.read-more:hover {
		color: #3a5d56;
	}

	.newsletter-section {
		margin-top: 64px;
	}


	@media (max-width: 768px) {
		.blog-header {
			padding: 0 16px;
		}


		.blog-title {
			font-size: 36px;
		}

		.blog-subtitle {
			font-size: 18px;
		}

		.posts-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.post-content {
			padding: 20px;
		}

		.post-link {
			font-size: 20px;
		}

		.post-description {
			font-size: 15px;
		}

		.newsletter-section {
			margin-top: 48px;
		}

	}
</style>
