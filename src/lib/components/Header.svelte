<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { createPageTranslations } from '$lib/i18n/store';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import Logo from './Logo.svelte';

	// Import icons
	import personIcon from '../assets/icons/person.svg';
	import cartIcon from '../assets/icons/cart.svg';

	// Создаем переводы для страницы
	const pageTranslations = createPageTranslations();

	$: navigationLinks = $pageTranslations
		? [
				{ href: '/shop', label: $pageTranslations.t('header.navigation.shop') },
				{ href: '/about', label: $pageTranslations.t('header.navigation.about') },
				{ href: '/contacts', label: $pageTranslations.t('header.navigation.contacts') },
				{ href: '/blog', label: $pageTranslations.t('header.navigation.blog') }
			]
		: [];

	function handlePersonClick() {
		// TODO: Navigate to account/login page
		console.log('Person icon clicked');
	}

	function handleCartClick() {
		// TODO: Navigate to cart page
		console.log('Cart icon clicked');
	}
</script>

{#if $pageTranslations}
	<header class="w-full border-b border-stroke bg-white" style="height: 80px;">
		<div class="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center">
					<Logo size="default" />
				</a>
			</div>

			<!-- Navigation Menu -->
			<nav class="hidden items-center space-x-8 md:flex">
				{#each navigationLinks as link, index}
					<a
						href={link.href}
						class="text-base font-medium transition-colors duration-200 hover:text-main"
						style="
            color: {colors.heading};
            font-size: {typography.sizes.base};
            font-weight: {typography.weights.medium};
            line-height: {typography.styles.linkButtonMedium.lineHeight};
          "
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Right Side Actions -->
			<div class="flex items-center space-x-4">
				<!-- Language Switcher -->
				<LanguageSwitcher />

				<!-- Action Icons -->
				<div class="flex items-center space-x-2">
					<!-- Person/Account Icon -->
					<button
						class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-main transition-all duration-200 hover:scale-110 hover:bg-main-additional hover:shadow-lg"
						on:click={handlePersonClick}
						aria-label={$pageTranslations?.t('header.accessibility.account') || 'Account'}
					>
						<img
							src={personIcon}
							alt="Account"
							class="h-6 w-6 transition-transform duration-200 hover:scale-110"
						/>
					</button>

					<!-- Cart Icon -->
					<button
						class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-main transition-all duration-200 hover:scale-110 hover:bg-main-additional hover:shadow-lg"
						on:click={handleCartClick}
						aria-label={$pageTranslations?.t('header.accessibility.shopping_cart') ||
							'Shopping cart'}
					>
						<img
							src={cartIcon}
							alt="Cart"
							class="h-6 w-6 transition-transform duration-200 hover:scale-110"
						/>
					</button>
				</div>
			</div>
		</div>
	</header>
{/if}
