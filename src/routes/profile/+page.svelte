<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseAuthStore, user, isAuthenticated, isLoading } from '$lib/auth/supabase-store';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Form state
	let deliveryAddress = {
		street: '',
		city: '',
		postalCode: '',
		country: 'Ukraine'
	};

	let isSaving = false;
	let saveSuccess = false;
	let saveError = '';

	// Load data from server
	export let data: PageData;

	// Initialize with data from server
	onMount(() => {
		supabaseAuthStore.initialize();
		
		// Initialize form with delivery address data if available
		if (data?.deliveryAddress) {
			deliveryAddress = {
				street: data.deliveryAddress.street || '',
				city: data.deliveryAddress.city || '',
				postalCode: data.deliveryAddress.postalCode || '',
				country: data.deliveryAddress.country || 'Ukraine'
			};
		}
	});

	// Redirect to login if not authenticated
	$: if (!$isAuthenticated && !$isLoading) {
		goto('/login');
	}

	// Handle form input changes
	function handleAddressChange(field: keyof typeof deliveryAddress, value: string) {
		deliveryAddress = { ...deliveryAddress, [field]: value };
	}

	// Handle logout
	async function handleLogout() {
		try {
			await supabaseAuthStore.signOut();
			goto('/');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}

	// Handle form enhancement for better UX
	function enhanceForm({ form, data, cancel }: any) {
		isSaving = true;
		saveSuccess = false;
		saveError = '';
		
		return async ({ result }: any) => {
			isSaving = false;
			
			if (result.type === 'success') {
				const responseData = result.data;
				if (responseData?.success) {
					saveSuccess = true;
					setTimeout(() => {
						saveSuccess = false;
					}, 3000);
				} else {
					saveError = responseData?.error || 'Failed to save address. Please try again.';
				}
			} else {
				saveError = 'Failed to save address. Please try again.';
			}
		};
	}
</script>

{#if $pageTranslations}
<SEO
	title={$pageTranslations.t('profile.meta.title')}
	description={$pageTranslations.t('profile.meta.description')}
	locale={$pageTranslations.locale}
/>

<div class="profile-page">
	<div class="profile-container">
		<div class="profile-header">
			<h1 class="profile-title">{$pageTranslations.t('profile.title')}</h1>
			<Button 
				variant="outline" 
				size="sm" 
				on:click={handleLogout}
			>
				{$pageTranslations.t('profile.logout')}
			</Button>
		</div>

		{#if $isAuthenticated && $user}
			<div class="profile-content">
				<!-- User Information Section -->
				<section class="profile-section">
					<h2 class="section-title">{$pageTranslations.t('profile.userInformation')}</h2>
					<div class="user-info-grid">
						<div class="info-item">
							<label class="info-label">{$pageTranslations.t('profile.email')}</label>
							<div class="info-value">{$user.email}</div>
						</div>
						{#if $user.name}
							<div class="info-item">
								<label class="info-label">{$pageTranslations.t('profile.name')}</label>
								<div class="info-value">{$user.name}</div>
							</div>
						{/if}
						{#if $user.firstName || $user.lastName}
							<div class="info-item">
								<label class="info-label">{$pageTranslations.t('profile.fullName')}</label>
								<div class="info-value">{[$user.firstName, $user.lastName].filter(Boolean).join(' ')}</div>
							</div>
						{/if}
					</div>
				</section>

				<!-- Delivery Address Section -->
				<section class="profile-section">
					<h2 class="section-title">{$pageTranslations.t('profile.deliveryAddress')}</h2>
					<form 
						class="address-form" 
						method="POST" 
						action="?/saveDeliveryAddress"
						use:enhance={enhanceForm}
					>
						<div class="form-grid">
							<div class="form-field">
								<label class="form-label">{$pageTranslations.t('profile.street')}</label>
								<Input
									type="text"
									name="street"
									placeholder={$pageTranslations.t('profile.streetPlaceholder')}
									value={deliveryAddress.street}
									onChange={(value) => handleAddressChange('street', value)}
								/>
							</div>
							<div class="form-field">
								<label class="form-label">{$pageTranslations.t('profile.city')}</label>
								<Input
									type="text"
									name="city"
									placeholder={$pageTranslations.t('profile.cityPlaceholder')}
									value={deliveryAddress.city}
									onChange={(value) => handleAddressChange('city', value)}
								/>
							</div>
							<div class="form-field">
								<label class="form-label">{$pageTranslations.t('profile.postalCode')}</label>
								<Input
									type="text"
									name="postalCode"
									placeholder={$pageTranslations.t('profile.postalCodePlaceholder')}
									value={deliveryAddress.postalCode}
									onChange={(value) => handleAddressChange('postalCode', value)}
								/>
							</div>
							<div class="form-field">
								<label class="form-label">{$pageTranslations.t('profile.country')}</label>
								<Input
									type="text"
									name="country"
									value={deliveryAddress.country}
									disabled
								/>
							</div>
						</div>
						<div class="form-actions">
							<Button 
								type="submit" 
								variant="primary" 
								disabled={isSaving}
							>
								{#if isSaving}
									{$pageTranslations.t('profile.saving')}
								{:else}
									{$pageTranslations.t('profile.saveAddress')}
								{/if}
							</Button>
						</div>
						{#if saveSuccess}
							<div class="success-message">
								{$pageTranslations.t('profile.addressSaved')}
							</div>
						{/if}
						{#if saveError}
							<div class="error-message">
								{saveError}
							</div>
						{/if}
					</form>
				</section>
			</div>
		{:else if $isLoading}
			<div class="loading-state">
				<div class="spinner"></div>
				<p>{$pageTranslations.t('profile.loading')}</p>
			</div>
		{/if}
	</div>
</div>
{/if}

<style>
	.profile-page {
		min-height: calc(100vh - 80px);
		background: #F8F7F6;
		padding: 40px 0;
	}

	.profile-container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.profile-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.profile-title {
		font-family: 'Nunito', sans-serif;
		font-size: 28px;
		font-weight: 600;
		line-height: 1.2;
		color: #000000;
		margin: 0;
	}

	.profile-content {
		background: #FFFFFF;
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.profile-section {
		margin-bottom: 32px;
	}

	.profile-section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 22px;
		font-weight: 600;
		line-height: 1.3;
		color: #000000;
		margin: 0 0 24px 0;
	}

	.user-info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}

	.info-item {
		margin-bottom: 16px;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	.info-label {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.5;
		color: #9A9A9A;
		display: block;
		margin-bottom: 4px;
	}

	.info-value {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 400;
		line-height: 1.6;
		color: #474747;
		padding: 8px 0;
	}

	.address-form {
		width: 100%;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin-bottom: 24px;
	}

	.form-field {
		margin-bottom: 16px;
	}

	.form-field:last-child {
		margin-bottom: 0;
	}

	.form-label {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.5;
		color: #9A9A9A;
		display: block;
		margin-bottom: 8px;
	}

	.form-actions {
		margin-top: 24px;
	}

	.success-message {
		margin-top: 16px;
		padding: 12px 16px;
		background-color: #4B766E;
		color: #FFFFFF;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		text-align: center;
	}

	.error-message {
		margin-top: 16px;
		padding: 12px 16px;
		background-color: #FF3B30;
		color: #FFFFFF;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		text-align: center;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px 0;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #E0E0E0;
		border-top: 4px solid #4B766E;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	@media (max-width: 768px) {
		.profile-container {
			padding: 0 16px;
		}

		.profile-content {
			padding: 24px;
		}

		.profile-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.user-info-grid {
			grid-template-columns: 1fr;
		}
	}
</style>