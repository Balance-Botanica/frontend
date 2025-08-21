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

	const platforms: Array<'facebook' | 'instagram' | 'tiktok' | 'telegram' | 'whatsapp'> = [
		'facebook',
		'instagram',
		'tiktok',
		'telegram',
		'whatsapp'
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
					<a href="#" class="text-sm text-white/80 transition-colors hover:text-white"
						>{t('footer.navigation.shop')}</a
					>
					<a href="#" class="text-sm text-white/80 transition-colors hover:text-white"
						>{t('footer.navigation.about')}</a
					>
					<a href="#" class="text-sm text-white/80 transition-colors hover:text-white"
						>{t('footer.navigation.contacts')}</a
					>
					<a href="#" class="text-sm text-white/80 transition-colors hover:text-white"
						>{t('footer.navigation.blog')}</a
					>
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

		<!-- Bottom Section - After Divider -->
		<div class="border-t border-white/20 pt-6">
			<div class="flex flex-col items-center justify-between sm:flex-row">
				<!-- Left Side: Copyright and Terms -->
				<div class="text-xs text-white/60">
					<span>{t('footer.legal.copyright')}</span>
					<span class="mx-2">|</span>
					<a href="#" class="transition-colors hover:text-white"
						>{t('footer.legal.terms_privacy')}</a
					>
				</div>

				<!-- Right Side: Social Icons Only (No "Follow Us" text) -->
				<div class="mt-2 flex space-x-3 sm:mt-0">
					{#each platforms as platform (platform)}
						<a
							href="#"
							class="text-white/80 transition-colors hover:text-white"
							aria-label={t(`footer.social.${platform}`)}
						>
							<img
								src={getSocialIcon(platform)}
								alt={t(`footer.social.${platform}`)}
								class="h-5 w-5"
							/>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
