<script lang="ts">
	import { t } from '../i18n';
	import Logo from './Logo.svelte';
	import waIcon from '../assets/icons/wa.svg';
	import tgIcon from '../assets/icons/tg.svg';
	import ttIcon from '../assets/icons/tt.svg';
	import igIcon from '../assets/icons/ig.svg';
	import fbIcon from '../assets/icons/fb.svg';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { page } from '$app/stores';
	import { getLocalizedUrl } from '$lib/stores/language';

	const platforms: Array<'facebook' | 'instagram' | 'tiktok' | 'telegram' | 'whatsapp'> = [
		'facebook',
		'instagram',
		'tiktok',
		'telegram',
		'whatsapp'
	];

	// Pillar articles data
	const pillarArticles = [
		{
			path: '/knowledgebase/cbd',
			title: t('footer.pillar.cbd'),
			description: t('footer.pillar.cbd_desc')
		},
		{
			path: '/knowledgebase/cbd/cats',
			title: t('footer.pillar.cbd_cats'),
			description: t('footer.pillar.cbd_cats_desc')
		},
		{
			path: '/knowledgebase/cbd/dogs',
			title: t('footer.pillar.cbd_dogs'),
			description: t('footer.pillar.cbd_dogs_desc')
		},
		{
			path: '/knowledgebase/cbd/types',
			title: t('footer.pillar.cbd_types'),
			description: t('footer.pillar.cbd_types_desc')
		},
		{
			path: '/cats-health',
			title: t('footer.pillar.cats_health'),
			description: t('footer.pillar.cats_health_desc')
		},
		{
			path: '/dog-health',
			title: t('footer.pillar.dog_health'),
			description: t('footer.pillar.dog_health_desc')
		},
		{
			path: '/veterinary-cbd',
			title: t('footer.pillar.veterinary_cbd'),
			description: t('footer.pillar.veterinary_cbd_desc')
		}
	];

	function getSocialIcon(platform: string) {
		switch (platform) {
			case 'facebook':
				return fbIcon;
			case 'instagram':
				return igIcon;
			case 'tiktok':
				return ttIcon;
			case 'telegram':
				return tgIcon;
			case 'whatsapp':
				return waIcon;
			default:
				return waIcon;
		}
	}

	// Function to handle navigation with proper language prefix
	function handleNavigation(path: string) {
		const fullPath = getLocalizedUrl(path);
		console.log('Navigate to:', fullPath);
		window.location.href = fullPath;
	}
</script>

<footer class="bg-main text-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<!-- Main Footer Content - 2 Column Layout -->
		<div class="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Left Column: Logo, Navigation, Company Info -->
			<div class="space-y-6">
				<!-- Logo - Left Aligned -->
				<div class="flex justify-start">
					<Logo size="small" className="brightness-0 invert" />
				</div>

				<!-- Navigation Links - Horizontal -->
				<nav class="flex flex-wrap gap-6">
					<button
						class="text-sm text-white/80 transition-colors hover:text-white"
						onclick={() => handleNavigation('/products')}
					>
						{t('footer.navigation.shop')}
					</button>
					<button
						class="text-sm text-white/80 transition-colors hover:text-white"
						onclick={() => handleNavigation('/about')}
					>
						{t('footer.navigation.about')}
					</button>
					<button
						class="text-sm text-white/80 transition-colors hover:text-white"
						onclick={() => handleNavigation('/contacts')}
					>
						{t('footer.navigation.contacts')}
					</button>
					<button
						class="text-sm text-white/80 transition-colors hover:text-white"
						onclick={() => handleNavigation('/blog')}
					>
						{t('footer.navigation.blog')}
					</button>
				</nav>

				<!-- Company Description -->
				<p class="max-w-md text-sm leading-relaxed text-white/80">
					{t('footer.company.description')}
				</p>
			</div>

			<!-- Right Column: Newsletter Only -->
			<div>
				<!-- Newsletter Section -->
				<div>
					<h3 class="mb-3 text-sm font-semibold text-white">{t('footer.newsletter.title')}</h3>
					<form class="flex gap-2">
						<Input type="email" placeholder={t('footer.newsletter.placeholder')} required />
						<Button variant="secondary" size="sm">
							{t('footer.newsletter.button')}
						</Button>
					</form>
				</div>
			</div>
		</div>

		<!-- Pillar Articles Section -->
		<div class="mb-8">
			<h3 class="mb-6 text-lg font-semibold text-white">{t('footer.pillar.title')}</h3>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each pillarArticles as article (article.path)}
					<button
						class="pillar-article-button group rounded-lg border border-white/20 bg-white/5 p-4 text-left transition-all hover:border-white/40 hover:bg-white/10"
						onclick={() => handleNavigation(article.path)}
					>
						<h4
							class="mb-2 text-sm font-medium text-white transition-colors group-hover:text-green-300"
						>
							{article.title}
						</h4>
						<p
							class="text-xs leading-relaxed text-white/70 transition-colors group-hover:text-white/90"
						>
							{article.description}
						</p>
					</button>
				{/each}
			</div>
		</div>

		<!-- Bottom Section - After Divider -->
		<div class="border-t border-white/20 pt-6">
			<div class="flex flex-col items-center justify-between sm:flex-row">
				<!-- Left Side: Copyright and Terms -->
				<div class="text-xs text-white/60">
					<span>{t('footer.legal.copyright')}</span>
					<span class="mx-2">|</span>
					<button
						class="transition-colors hover:text-white"
						onclick={() => handleNavigation('/terms')}
					>
						{t('footer.legal.terms_privacy')}
					</button>
				</div>

				<!-- Right Side: Social Icons Only (No "Follow Us" text) -->
				<div class="mt-2 flex space-x-3 sm:mt-0">
					{#each platforms as platform (platform)}
						<button
							class="text-white/80 transition-colors hover:text-white"
							aria-label={t(`footer.social.${platform}`)}
							onclick={() => handleNavigation(`/social/${platform}`)}
						>
							<img
								src={getSocialIcon(platform)}
								alt={t(`footer.social.${platform}`)}
								class="h-5 w-5"
							/>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>

<style>
	/* Pillar articles cursor pointer */
	.pillar-article-button {
		cursor: pointer;
	}

	/* Removed the media query for small screens padding */
</style>
