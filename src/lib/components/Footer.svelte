<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import logoText from '../assets/icons/logo-text.svg';
	import waIcon from '../assets/icons/wa.svg';
	import tgIcon from '../assets/icons/tg.svg';
	import ttIcon from '../assets/icons/tt.svg';
	import igIcon from '../assets/icons/ig.svg';
	import fbIcon from '../assets/icons/fb.svg';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	const socialLinks: Array<{ href: string; platform: 'facebook' | 'instagram' | 'tiktok' | 'telegram' | 'whatsapp'; label: string }> = [
		{ href: '#', platform: 'facebook', label: m['footer.social.facebook']() },
		{ href: '#', platform: 'instagram', label: m['footer.social.instagram']() },
		{ href: '#', platform: 'tiktok', label: m['footer.social.tiktok']() },
		{ href: '#', platform: 'telegram', label: m['footer.social.telegram']() },
		{ href: '#', platform: 'whatsapp', label: m['footer.social.whatsapp']() }
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
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Main Footer Content - 2 Column Layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
			<!-- Left Column: Logo, Navigation, Company Info -->
			<div class="space-y-6">
				<!-- Logo - Left Aligned -->
				<div class="flex justify-start">
					<img src={logoText} alt="Balance Botanica" class="h-8 brightness-0 invert" />
				</div>

				<!-- Navigation Links - Horizontal -->
				<nav class="flex flex-wrap gap-6">
					<a href="#" class="text-white/80 text-sm hover:text-white transition-colors">{m['footer.navigation.shop']()}</a>
					<a href="#" class="text-white/80 text-sm hover:text-white transition-colors">{m['footer.navigation.about']()}</a>
					<a href="#" class="text-white/80 text-sm hover:text-white transition-colors">{m['footer.navigation.contacts']()}</a>
					<a href="#" class="text-white/80 text-sm hover:text-white transition-colors">{m['footer.navigation.blog']()}</a>
				</nav>

				<!-- Company Description -->
				<p class="text-white/80 text-sm leading-relaxed max-w-md">
					{m['footer.company.description']()}
				</p>
			</div>

			<!-- Right Column: Newsletter Only -->
			<div>
				<!-- Newsletter Section -->
				<div>
					<h3 class="text-white font-semibold text-sm mb-3">{m['footer.newsletter.title']()}</h3>
					<form class="flex gap-2">
						<Input
							type="email"
							placeholder={m['footer.newsletter.placeholder']()}
							required
						/>
						<Button variant="secondary" size="sm">
							{m['footer.newsletter.button']()}
						</Button>
					</form>
				</div>
			</div>
		</div>

		<!-- Bottom Section - After Divider -->
		<div class="border-t border-white/20 pt-6">
			<div class="flex flex-col sm:flex-row justify-between items-center">
				<!-- Left Side: Copyright and Terms -->
				<div class="text-xs text-white/60">
					<span>{m['footer.legal.copyright']()}</span>
					<span class="mx-2">|</span>
					<a href="#" class="hover:text-white transition-colors">{m['footer.legal.terms_privacy']()}</a>
				</div>

				<!-- Right Side: Social Icons Only (No "Follow Us" text) -->
				<div class="flex space-x-3 mt-2 sm:mt-0">
					{#each socialLinks as link}
						<a
							href={link.href}
							class="text-white/80 hover:text-white transition-colors"
							aria-label={link.label}
						>
							<img src={getSocialIcon(link.platform)} alt={link.label} class="w-5 h-5" />
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
