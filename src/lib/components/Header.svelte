<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { createPageTranslations } from '$lib/i18n/store';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { supabaseAuthStore, user, isAuthenticated, isLoading } from '$lib/auth/supabase-store';
	import { cartItemCount } from '$lib/stores/cart.store';
	import { onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { goto } from '$app/navigation';

	// Import icons
	import personIcon from '../assets/icons/person.svg';
	import cartIcon from '../assets/icons/cart.svg';

	// Initialize auth store
	onMount(() => {
		console.log('🐄 [HEADER] Initializing header component...');
		supabaseAuthStore.initialize();

		// Manual subscription to force reactivity
		const unsubscribe = supabaseAuthStore.subscribe((state) => {
			console.log('🔄 [HEADER] ⭐ MANUAL STORE SUBSCRIPTION UPDATE:', {
				isAuthenticated: !!state.user && !!state.session,
				userEmail: state.user?.email,
				userName: state.user?.name,
				isLoading: state.isLoading,
				errorPresent: !!state.error,
				timestamp: new Date().toISOString()
			});
		});

		// Force a check after a small delay to catch any missed updates
		setTimeout(() => {
			console.log('🕰️ [HEADER] ⭐ FORCED REACTIVITY CHECK AFTER 1 SECOND');
			console.log('🔍 [HEADER] Current derived store values:', {
				isAuthenticated: $isAuthenticated,
				userEmail: $user?.email,
				userName: $user?.name,
				isLoading: $isLoading
			});
		}, 1000);

		// Another check after 3 seconds
		setTimeout(() => {
			console.log('🕰️ [HEADER] ⭐ FINAL REACTIVITY CHECK AFTER 3 SECONDS');
			console.log('🔍 [HEADER] Final derived store values:', {
				isAuthenticated: $isAuthenticated,
				userEmail: $user?.email,
				userName: $user?.name,
				isLoading: $isLoading
			});
		}, 3000);

		// Cleanup subscription on destroy
		return () => {
			unsubscribe();
		};
	});

	// Create page translations
	const pageTranslations = createPageTranslations();

	// State for logout confirmation dialog
	let showLogoutDialog = false;

	$: {
		console.log('🐄 [HEADER] Auth state updated:', {
			isAuthenticated: $isAuthenticated,
			userEmail: $user?.email,
			userName: $user?.name,
			isLoading: $isLoading
		});
	}

	$: navigationLinks = $pageTranslations
		? [
				{ href: '/products', label: $pageTranslations.t('header.navigation.shop') },
				{ href: '/categories', label: $pageTranslations.t('header.navigation.categories') },
				{ href: '/about', label: $pageTranslations.t('header.navigation.about') },
				{ href: '/contacts', label: $pageTranslations.t('header.navigation.contacts') },
				{ href: '/blog', label: $pageTranslations.t('header.navigation.blog') }
			]
		: [];

	async function handlePersonClick() {
		console.log('👤 [HEADER] Person icon clicked, auth state:', {
			isAuthenticated: $isAuthenticated,
			userEmail: $user?.email
		});
		
		if ($isAuthenticated) {
			console.log('🔓 [HEADER] User is authenticated, showing logout confirmation...');
			// Show logout confirmation dialog
			showLogoutDialog = true;
		} else {
			console.log('🔗 [HEADER] User not authenticated, redirecting to login...');
			// Go to login page
			goto('/login');
		}
	}

	// Handle logout confirmation
	async function handleLogoutConfirm() {
		console.log('🚪 [HEADER] Logout confirmed, signing out...');
		
		try {
			showLogoutDialog = false;
			await supabaseAuthStore.signOut();
			console.log('✅ [HEADER] Successfully signed out');
			// Redirect to home page after logout
			goto('/');
		} catch (error) {
			console.error('❌ [HEADER] Error signing out:', error);
		}
	}

	// Handle logout cancellation
	function handleLogoutCancel() {
		console.log('🙅 [HEADER] Logout cancelled');
		showLogoutDialog = false;
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
		// Always go to cart page, authentication will be required only at checkout
		goto('/cart');
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
						aria-label={$isAuthenticated ? 'Account menu' : 'Sign in'}
					>
						{#if $isAuthenticated}
							<!-- Logged in user -->
							<div class="user-info">
								<span class="username" title="Click for account menu">
									{getUserDisplayName($user)}
								</span>
								<div class="user-icon-container logged-in" title="Account menu">
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
							<!-- Not logged in user -->
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
						<div class="cart-icon-container">
							<img
								src={cartIcon}
								alt="Cart"
								class="cart-icon"
							/>
							{#if $cartItemCount > 0}
								<span class="cart-badge">{$cartItemCount}</span>
							{/if}
						</div>
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- Logout Confirmation Dialog -->
	{#if showLogoutDialog}
		<div class="logout-dialog-overlay" on:click={handleLogoutCancel}>
			<div class="logout-dialog" on:click|stopPropagation>
				<h3 class="logout-dialog-title">Confirm Logout</h3>
				<p class="logout-dialog-message">
					Are you sure you want to sign out?
				</p>
				<div class="logout-dialog-buttons">
					<button class="logout-cancel-btn" on:click={handleLogoutCancel}>
						Cancel
					</button>
					<button class="logout-confirm-btn" on:click={handleLogoutConfirm}>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	{/if}
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
		border: none;
		background: transparent;
		position: relative;
	}

	.cart-icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		transition: all 0.2s ease;
		background: transparent;
		border: 2px solid #4B766E;
		position: relative;
	}

	.cart-icon-container:hover {
		border-color: #3a5d56;
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(75, 118, 110, 0.3);
	}

	.cart-icon {
		width: 24px;
		height: 24px;
		transition: transform 0.2s ease;
		filter: brightness(0) saturate(100%) hue-rotate(120deg) brightness(0.6);
	}

	.cart-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		background: #ff4444;
		color: white;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		font-weight: 600;
		font-family: 'Nunito', sans-serif;
		min-width: 20px;
		padding: 0 2px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		border: 2px solid white;
	}

	/* Logout Dialog Styles */
	.logout-dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	.logout-dialog {
		background: white;
		border-radius: 12px;
		padding: 24px;
		min-width: 320px;
		max-width: 400px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		animation: slideIn 0.2s ease-out;
	}

	.logout-dialog-title {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #222222;
		margin: 0 0 12px 0;
		text-align: center;
	}

	.logout-dialog-message {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 400;
		color: #666666;
		margin: 0 0 24px 0;
		text-align: center;
		line-height: 1.5;
	}

	.logout-dialog-buttons {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.logout-cancel-btn {
		padding: 10px 20px;
		border: 1px solid #D1D5DB;
		background: white;
		color: #374151;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 80px;
	}

	.logout-cancel-btn:hover {
		background: #F9FAFB;
		border-color: #9CA3AF;
	}

	.logout-confirm-btn {
		padding: 10px 20px;
		border: none;
		background: #EF4444;
		color: white;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 80px;
	}

	.logout-confirm-btn:hover {
		background: #DC2626;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
