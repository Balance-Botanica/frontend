<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { createPageTranslations } from '$lib/i18n/store';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { authStore, user, isAuthenticated } from '$lib/auth/store';
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { goto } from '$app/navigation';

	// Import icons
	import personIcon from '../assets/icons/person.svg';
	import cartIcon from '../assets/icons/cart.svg';

	// Инициализируем auth store
	onMount(() => {
		authStore.initialize();
	});

	// Создаем переводы для страницы
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
			// Разлогиниваемся
			try {
				await authStore.signOut();
				console.log('✅ Разлогинились успешно');
			} catch (error) {
				console.error('❌ Ошибка при разлогине:', error);
			}
		} else {
			// Переходим на страницу входа
			goto('/login');
		}
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
						aria-label={$isAuthenticated ? 'Выйти из аккаунта' : 'Войти в аккаунт'}
					>
						{#if $isAuthenticated}
							<!-- Залогиненный пользователь -->
							<div class="user-info">
								<span class="username">{$user?.name || 'User'}</span>
								<div class="user-icon-container logged-in">
									<img
										src={personIcon}
										alt="Account"
										class="user-icon"
									/>
								</div>
							</div>
						{:else}
							<!-- Не залогиненный пользователь -->
							<div class="user-icon-container logged-out">
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
