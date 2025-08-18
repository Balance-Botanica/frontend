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

<footer class="bg-white border-t border-stroke">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<!-- Logo Section -->
		<div class="flex justify-center mb-8">
			<img src={logoText} alt="Balance Botanica" class="h-8" />
		</div>

		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
			<!-- Company Info -->
			<div class="lg:col-span-2">
				<p class="text-text text-sm leading-relaxed max-w-md">
					{m['footer.company.description']()}
				</p>
			</div>

			<!-- Navigation -->
			<div>
				<h3 class="text-heading font-semibold text-sm mb-4">Navigation</h3>
				<ul class="space-y-2">
					<li><a href="#" class="text-text text-sm hover:text-main transition-colors">{m['footer.navigation.shop']()}</a></li>
					<li><a href="#" class="text-text text-sm hover:text-main transition-colors">{m['footer.navigation.about']()}</a></li>
					<li><a href="#" class="text-text text-sm hover:text-main transition-colors">{m['footer.navigation.contacts']()}</a></li>
					<li><a href="#" class="text-text text-sm hover:text-main transition-colors">{m['footer.navigation.blog']()}</a></li>
				</ul>
			</div>

			<!-- Social Links -->
			<div>
				<h3 class="text-heading font-semibold text-sm mb-4">Follow Us</h3>
				<div class="flex space-x-3">
					{#each socialLinks as link}
						<a
							href={link.href}
							class="text-text hover:text-main transition-colors"
							aria-label={link.label}
						>
							<img src={getSocialIcon(link.platform)} alt={link.label} class="w-5 h-5" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Newsletter Section -->
		<div class="border-t border-stroke pt-8 mb-8">
			<div class="max-w-md">
				<h3 class="text-heading font-semibold text-sm mb-3">{m['footer.newsletter.title']()}</h3>
				<form class="flex gap-2">
					<Input
						type="email"
						placeholder={m['footer.newsletter.placeholder']()}
						required
					/>
					<Button variant="primary" size="sm">
						{m['footer.newsletter.button']()}
					</Button>
				</form>
			</div>
		</div>

		<!-- Legal Section -->
		<div class="border-t border-stroke pt-6">
			<div class="flex flex-col sm:flex-row justify-between items-center text-xs text-text">
				<p>{m['footer.legal.copyright']()}</p>
				<div class="mt-2 sm:mt-0">
					<a href="#" class="hover:text-main transition-colors">{m['footer.legal.terms_privacy']()}</a>
				</div>
			</div>
		</div>
	</div>
</footer>
