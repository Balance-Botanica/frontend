<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { createPageTranslations } from '$lib/i18n/store';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { supabaseAuthStore, user, isAuthenticated } from '$lib/auth/supabase-store';
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { goto } from '$app/navigation';

	// Import icons
	import personIcon from '../assets/icons/person.svg';
	import cartIcon from '../assets/icons/cart.svg';

	// Initialize auth store
	onMount(() => {
		supabaseAuthStore.initialize();
	});

	// Create page translations
	const pageTranslations = createPageTranslations();

	$: navigationLinks = $pageTranslations
		? [
				{ href: '/products', label: $pageTranslations.t('header.navigation.shop') },
				{ href: '/about', label: $pageTranslations.t('header.navigation.about') },
				{ href: '/contacts', label: $pageTranslations.t('header.navigation.contacts') },
				{ href: '/blog', label: $pageTranslations.t('header.navigation.blog') }
			]
		: [];

	async function handlePersonClick() {
		if ($isAuthenticated) {
			// Sign out
			try {
				await supabaseAuthStore.signOut();
				console.log('✅ Successfully signed out from Google account');
				// Redirect to home page after logout
				goto('/');
			} catch (error) {
				console.error('❌ Error signing out:', error);
			}
		} else {
			// Go to login page
			goto('/login');
		}
	}

	// Function to get user display name, prioritizing Google account data
	function getUserDisplayName(user: any): string {
		if (!user) return 'User';
		
		// Priority order: full_name from Google > name > first+last > email
		if (user.name) return user.name;
		if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
		if (user.firstName) return user.firstName;
		if (user.email) {
			// Extract name from email (before @)
			return user.email.split('@')[0];
		}
		return 'User';
	}

	function handleCartClick() {
		if ($isAuthenticated) {
			// Переходим в корзину
			goto('/cart');
		} else {
			// Переходим на страницу входа
			goto('/login');
		}
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
				{#each navigationLinks as link (link.href)}
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
						class="flex cursor-pointer items-center justify-center transition-all duration-200 hover:scale-110"
						on:click={handlePersonClick}
						aria-label={$isAuthenticated ? 'Sign out' : 'Sign in'}
					>
						{#if $isAuthenticated}
							<!-- Залогиненный пользователь -->
							<div class="user-info">
								<span class="username" title="Click to logout">
									{getUserDisplayName($user)}
								</span>
								<div class="user-icon-container logged-in" title="Logout">
									{#if $user?.avatarUrl}
										<!-- Display Google profile picture if available -->
										<img
											src={$user.avatarUrl}
											alt="Profile"
											class="profile-picture"
										/>
									{:else}
										<!-- Fallback to person icon -->
										<img
											src={personIcon}
											alt="Account"
											class="user-icon"
										/>
									{/if}
								</div>
							</div>
						{:else}
							<!-- Не залогиненный пользователь -->
							<div class="user-icon-container logged-out" title="Sign in">
								<img
									src={personIcon}
									alt="Account"
									class="user-icon"
								/>
							</div>
						{/if}
					</button>

					<!-- Cart Icon -->
					<button
						class="cart-icon-button"
						on:click={handleCartClick}
						aria-label={$pageTranslations?.t('header.accessibility.shopping_cart') ||
							'Shopping cart'}
					>
						{#if $isAuthenticated}
							<!-- Залогиненный пользователь - полная корзина -->
							<div class="cart-icon-container logged-in">
								<img
									src={cartIcon}
									alt="Cart"
									class="cart-icon"
								/>
							</div>
						{:else}
							<!-- Не залогиненный пользователь - обведенная корзина -->
							<div class="cart-icon-container logged-out">
								<img
									src={cartIcon}
									alt="Cart"
									class="cart-icon"
								/>
							</div>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</header>
{/if}

<style>
	/* User Icon Styles */
	.user-info {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.username {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #4B766E;
		white-space: nowrap;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.username:hover {
		color: #3a5d56;
	}

	.profile-picture {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
		transition: transform 0.2s ease;
		border: 2px solid #4B766E;
	}

	.user-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.user-icon-container.logged-in {
		background: transparent;
		border: 2px solid #4B766E;
	}

	.user-icon-container.logged-in:hover {
		border-color: #3a5d56;
		transform: scale(1.1);
	}

	.user-icon-container.logged-out {
		background: transparent;
		border: 2px solid rgba(255, 255, 255, 0.8);
	}

	.user-icon-container.logged-out:hover {
		border-color: #4B766E;
		transform: scale(1.1);
	}

	.user-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.2s ease;
	}

	.user-icon-container.logged-in .user-icon {
		filter: brightness(0) saturate(100%) hue-rotate(120deg) brightness(0.6);
	}

	.user-icon-container.logged-out .user-icon {
		filter: brightness(0) saturate(100%) hue-rotate(120deg) brightness(0.6);
	}

	/* Cart Icon Styles */
	.cart-icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.cart-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.cart-icon-container.logged-in {
		background: transparent;
		border: 2px solid #4B766E;
	}

	.cart-icon-container.logged-in:hover {
		border-color: #3a5d56;
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(75, 118, 110, 0.3);
	}

	.cart-icon-container.logged-out {
		background: transparent;
		border: 2px solid rgba(255, 255, 255, 0.8);
	}

	.cart-icon-container.logged-out:hover {
		border-color: #4B766E;
		transform: scale(1.1);
	}

	.cart-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.2s ease;
	}

	.cart-icon-container.logged-in .cart-icon {
		filter: brightness(0) saturate(100%) hue-rotate(120deg) brightness(0.6);
	}

	.cart-icon-container.logged-out .cart-icon {
		filter: brightness(0) saturate(100%) hue-rotate(120deg) brightness(0.6);
	}
</style>
