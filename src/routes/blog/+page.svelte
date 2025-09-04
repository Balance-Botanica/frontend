<script lang="ts">
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';

	// Mock blog posts data (in production, this would come from a CMS or database)
	const blogPosts = [
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
	];

	$: formattedDate = (date: string) => {
		return new Date(date).toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<SEO
	title="Блог - Balance Botanica"
	description="Статті про CBD, здоров'я та натуральні продукти. Дізнайтеся більше про користь каннабіноїдів та як вони можуть покращити ваше життя."
	locale={$page.data.locale}
/>

<main class="blog-main">
	<div class="blog-container">
		<!-- Blog header -->
		<header class="blog-header">
			<h1 class="blog-title">Блог Balance Botanica</h1>
			<p class="blog-subtitle">Статті про CBD, здоров'я та натуральні продукти</p>
		</header>

		<!-- Blog posts grid -->
		<section class="blog-posts">
			<div class="posts-grid">
				{#each blogPosts as post}
					<article class="post-card">
						<div class="post-content">
							<div class="post-meta">
								<span class="date">📅 {formattedDate(post.date)}</span>
								<span class="reading-time">📖 {post.readingTime} хв</span>
							</div>

							<h2 class="post-title">
								<a href="/blog/{post.slug}" class="post-link">
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
								<a href="/blog/{post.slug}" class="read-more">
									Читати далі →
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</section>

		<!-- Newsletter section -->
		<section class="newsletter-section">
			<div class="newsletter-card">
				<h2 class="newsletter-title">Підписатися на оновлення</h2>
				<p class="newsletter-description">
					Отримуйте останні статті та новини про CBD прямо на email
				</p>
				<form class="newsletter-form" on:submit|preventDefault={() => {}}>
					<input
						type="email"
						placeholder="Ваш email"
						class="newsletter-input"
						required
					/>
					<button type="submit" class="newsletter-btn">
						Підписатися
					</button>
				</form>
			</div>
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
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.blog-header {
		text-align: center;
		margin-bottom: 48px;
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
		margin-bottom: 64px;
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

	.newsletter-card {
		background: linear-gradient(135deg, #4B766E 0%, #5d8a7e 100%);
		border-radius: 16px;
		padding: 48px 32px;
		text-align: center;
		color: white;
		box-shadow: 0 8px 32px rgba(75, 118, 110, 0.2);
	}

	.newsletter-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		margin: 0 0 16px 0;
		line-height: 1.2;
	}

	.newsletter-description {
		font-size: 18px;
		margin: 0 0 32px 0;
		opacity: 0.9;
		line-height: 1.5;
	}

	.newsletter-form {
		display: flex;
		max-width: 500px;
		margin: 0 auto;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.newsletter-input {
		flex: 1;
		min-width: 250px;
		padding: 12px 16px;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.newsletter-input::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}

	.newsletter-input:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.15);
	}

	.newsletter-btn {
		padding: 12px 24px;
		background: white;
		color: #4B766E;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.newsletter-btn:hover {
		background: #f8f9fa;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
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

		.newsletter-card {
			padding: 32px 20px;
		}

		.newsletter-title {
			font-size: 28px;
		}

		.newsletter-description {
			font-size: 16px;
		}

		.newsletter-form {
			flex-direction: column;
			align-items: stretch;
		}

		.newsletter-input {
			min-width: auto;
		}
	}
</style>
