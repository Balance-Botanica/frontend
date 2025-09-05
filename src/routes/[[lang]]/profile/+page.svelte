<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabaseAuthStore, user, isAuthenticated, isLoading } from '$lib/auth/supabase-store';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import NovaPoshtaSelector from '$lib/components/NovaPoshtaSelector.svelte';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	// Detect language from optional route parameter
	let lang = $derived($page.params?.lang || 'uk-ua');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Form state
	let deliveryAddress = {
		name: '',
		street: '',
		city: '',
		postalCode: '',
		country: 'Ukraine',
		// Nova Poshta fields
		npCityName: '',
		npCityFullName: '',
		npWarehouse: '',
		useNovaPost: true,
		isDefault: false
	};

	let isAddingNew = false;
	let isEditing = false;
	let editingAddressId = '';
	let isSaving = false;
	let saveSuccess = false;
	let saveError = '';
	let isLoggingOut = false;

	// Load data from server
	const { data }: { data: PageData } = $props();

	// Initialize with data from server
	onMount(() => {
		console.log('[Profile Page] Initializing profile page');
		supabaseAuthStore.initialize();
		console.log('[Profile Page] Supabase auth store initialized');
	});

	// Redirect to login if not authenticated (but not during logout)
	$effect(() => {
		if (!$isAuthenticated && !$isLoading && !isLoggingOut) {
			console.log('[Profile Page] User not authenticated and not loading, redirecting to login');
			goto('/login');
		}
	});

	// Form state
	let deliveryAddresses = $derived(data?.deliveryAddresses || []);
	let hasAddresses = $derived(deliveryAddresses?.length > 0);
	console.log('[Profile Page] Delivery addresses loaded:', deliveryAddresses?.length);

	// Handle form input changes
	function handleAddressChange(field: keyof typeof deliveryAddress, value: string | boolean) {
		console.log('[Profile Page] Address field changed:', field, value);
		deliveryAddress = { ...deliveryAddress, [field]: value };
	}

	// Handle Nova Poshta selection changes
	function handleNovaPoshtaChange(event: CustomEvent<{npCityName: string; npCityFullName: string; npWarehouse: string}>) {
		const { npCityName, npCityFullName, npWarehouse } = event.detail;
		console.log('[Profile Page] Nova Poshta selection changed:', { npCityName, npCityFullName, npWarehouse });
		deliveryAddress = {
			...deliveryAddress,
			npCityName,
			npCityFullName,
			npWarehouse
		};
	}

	// Start adding a new address
	function addNewAddress() {
		console.log('[Profile Page] Starting to add new address');
		isAddingNew = true;
		isEditing = false;
		deliveryAddress = {
			name: '',
			street: '',
			city: '',
			postalCode: '',
			country: 'Ukraine',
			npCityName: '',
			npCityFullName: '',
			npWarehouse: '',
			useNovaPost: true,
			isDefault: false
		};
	}

	// Edit an existing address
	function editAddress(address: any) {
		console.log('[Profile Page] Editing address:', address.id);
		isEditing = true;
		isAddingNew = false;
		editingAddressId = address.id;
		deliveryAddress = {
			name: address.name || '',
			street: address.street || '',
			city: address.city || '',
			postalCode: address.postalCode || '',
			country: address.country || 'Ukraine',
			npCityName: address.npCityName || '',
			npCityFullName: address.npCityFullName || '',
			npWarehouse: address.npWarehouse || '',
			useNovaPost: address.useNovaPost || false,
			isDefault: address.isDefault || false
		};
	}

	// Cancel editing/adding
	function cancelEdit() {
		console.log('[Profile Page] Cancelling edit/add');
		isEditing = false;
		isAddingNew = false;
		editingAddressId = '';
	}

	// Handle address save via API
	async function saveAddress(formData: any) {
		console.log('[Profile Page] Saving address via API');
		isSaving = true;
		saveSuccess = false;
		saveError = '';

		try {
			const response = await fetch('/api/user/address', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.name,
					npCityName: formData.npCityName,
					npCityFullName: formData.npCityFullName,
					npWarehouse: formData.npWarehouse,
					useNovaPost: true,
					isDefault: formData.isDefault
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to save address');
			}

			console.log('[Profile Page] Address saved successfully via API');
			saveSuccess = true;
			isAddingNew = false;
			isEditing = false;

			// Refresh the page to show updated data
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.error('[Profile Page] Failed to save address:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			if (errorMessage.includes('Unauthorized')) {
				saveError = 'Your session has expired. Redirecting to login...';
				setTimeout(() => {
					goto('/login');
				}, 2000);
			} else {
				saveError = errorMessage || 'Failed to save address. Please try again.';
			}
		} finally {
			isSaving = false;
		}
	}

	// Handle form enhancement for better UX (legacy support)
	function enhanceForm({ form, data, cancel }: any) {
		console.log('[Profile Page] Enhancing form submission');
		isSaving = true;
		saveSuccess = false;
		saveError = '';

		return async ({ result }: any) => {
			console.log('[Profile Page] Form submission result:', result);
			isSaving = false;

			if (result.type === 'success') {
				const responseData = result.data;
				if (responseData?.success) {
					console.log('[Profile Page] Address saved successfully');
					saveSuccess = true;
					isAddingNew = false;
					isEditing = false;

					// Refresh the page to show updated data
					setTimeout(() => {
						window.location.reload();
					}, 1000);
				} else {
					console.log('[Profile Page] Address save failed:', responseData?.error);
					// Check if it's an authentication error
					if (responseData?.error === 'User not authenticated') {
						console.log('[Profile Page] Authentication error detected, redirecting to login');
						saveError = 'Your session has expired. Redirecting to login...';
						// Redirect to login after a short delay
						setTimeout(() => {
							goto('/login');
						}, 2000);
					} else {
						saveError = responseData?.error || 'Failed to save address. Please try again.';
					}
				}
			} else {
				console.log('[Profile Page] Form submission failed');
				saveError = 'Failed to save address. Please try again.';
			}
		};
	}

	// Format address for display
	function formatAddress(address: any) {
		if (address.useNovaPost) {
			return `${address.npCityFullName}, ${address.npWarehouse}`;
		} else {
			return `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
		}
	}

	// Handle logout
	async function handleLogout() {
		try {
			console.log('🚪 Initiating logout...');

			// Temporarily disable the auth redirect to prevent showing login page
			isLoggingOut = true;

			await supabaseAuthStore.signOut();
			console.log('✅ Logout successful, redirecting to home page...');

			// Immediately redirect to home page without showing login
			goto('/', { replaceState: true });
		} catch (error) {
			console.error('❌ Error during logout:', error);
			// Even if there's an error, still redirect to home page
			goto('/', { replaceState: true });
		} finally {
			// Reset the flag after a short delay
			setTimeout(() => {
				isLoggingOut = false;
			}, 1000);
		}
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
				onClick={handleLogout}
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
							<span class="info-label">{$pageTranslations.t('profile.email')}</span>
							<div class="info-value">{$user.email}</div>
						</div>
						{#if $user.name}
							<div class="info-item">
								<span class="info-label">{$pageTranslations.t('profile.name')}</span>
								<div class="info-value">{$user.name}</div>
							</div>
						{/if}
						{#if $user.firstName || $user.lastName}
							<div class="info-item">
								<span class="info-label">{$pageTranslations.t('profile.fullName')}</span>
								<div class="info-value">{[$user.firstName, $user.lastName].filter(Boolean).join(' ')}</div>
							</div>
						{/if}
					</div>
				</section>

				<!-- Orders Section -->
				<section class="profile-section">
					<h2 class="section-title">{$pageTranslations.t('profile.orders') || 'Orders'}</h2>
					<div class="orders-section">
						<p class="orders-description">
							{$pageTranslations.t('profile.ordersDescription') || 'View your order history and track current orders'}
						</p>
						<a href="/orders" class="orders-button-link">
							<Button
								variant="primary"
							>
								{$pageTranslations.t('profile.viewOrders') || 'View My Orders'}
							</Button>
						</a>
					</div>
				</section>

				<!-- Delivery Address Section -->
				<section class="profile-section">
					<div class="section-header">
						<h2 class="section-title">{$pageTranslations.t('profile.deliveryAddress')}</h2>
						{#if !isAddingNew && !isEditing && hasAddresses}
							<Button 
								variant="primary" 
								size="sm" 
								onClick={addNewAddress}
							>
								{$pageTranslations.t('profile.address.addNew')}
							</Button>
						{/if}
					</div>
					
					<!-- Delivery Info -->
					<div class="delivery-info">
						<p class="delivery-description">
							{$pageTranslations.t('delivery.description')}
						</p>
					</div>
					
					<!-- Show saved addresses if any exist -->
					{#if hasAddresses && !isEditing && !isAddingNew}
						<div class="saved-addresses">
							{#each deliveryAddresses as address}
								<div class="address-card {address.isDefault ? 'default' : ''}">
									<div class="address-header">
										<h3 class="address-name">{address.name || $pageTranslations.t('profile.address.addressName')}</h3>
										{#if address.isDefault}
											<span class="default-badge">{$pageTranslations.t('profile.address.defaultBadge')}</span>
										{/if}
									</div>
									<div class="address-content">
										<p class="address-text">
											{formatAddress(address)}
										</p>
										<div class="address-type">
											{#if address.useNovaPost}
												<span class="delivery-type">{$pageTranslations.t('profile.address.deliveryType.novaPoshta')}</span>
											{:else}
												<span class="delivery-type">{$pageTranslations.t('profile.address.deliveryType.regular')}</span>
											{/if}
										</div>
									</div>
									<div class="address-actions">
										<button class="action-btn edit" on:click={() => editAddress(address)}>
											{$pageTranslations.t('profile.address.edit')}
										</button>
										{#if !address.isDefault}
											<form 
												method="POST" 
												action="?/setDefaultAddress"
												use:enhance
											>
												<input type="hidden" name="addressId" value={address.id}>
												<button type="submit" class="action-btn default">
													{$pageTranslations.t('profile.address.setDefault')}
												</button>
											</form>
											<form 
												method="POST" 
												action="?/deleteAddress"
												use:enhance
											>
												<input type="hidden" name="addressId" value={address.id}>
												<button type="submit" class="action-btn delete">
													{$pageTranslations.t('profile.address.delete')}
												</button>
											</form>
										{/if}
									</div>
								</div>
							{/each}
							
							{#if deliveryAddresses?.length < 3}
								<button class="add-address-btn" on:click={addNewAddress}>
									+ {$pageTranslations.t('profile.address.addNew')}
								</button>
							{/if}
						</div>
					{:else if !hasAddresses && !isAddingNew}
						<div class="no-addresses">
							<p>{$pageTranslations.t('profile.address.noAddresses')}</p>
							<Button 
								variant="primary" 
								onClick={addNewAddress}
							>
								{$pageTranslations.t('profile.address.addAddress')}
							</Button>
						</div>
					{/if}
					
					<!-- Address Form for Adding/Editing -->
					{#if isAddingNew || isEditing}
						<form
							class="address-form"
							on:submit|preventDefault={() => saveAddress(deliveryAddress)}
						>
							<!-- Address Name -->
							<div class="form-group">
								<label for="name" class="form-label">{$pageTranslations.t('profile.address.addressName')}</label>
								<input 
									type="text" 
									id="name" 
									name="name" 
									class="form-input"
									placeholder={$pageTranslations.t('profile.address.addressNamePlaceholder')}
									bind:value={deliveryAddress.name}
									on:input={(e) => handleAddressChange('name', e.currentTarget.value)}
								/>
							</div>
							
							<!-- Is Default Checkbox -->
							<div class="form-group checkbox">
								<label class="checkbox-label">
									<input 
										type="checkbox" 
										name="isDefault" 
										value="true"
										checked={deliveryAddress.isDefault}
										on:change={(e) => handleAddressChange('isDefault', e.currentTarget.checked)}
									/>
									{$pageTranslations.t('profile.address.setDefaultCheckbox')}
								</label>
							</div>
							
							<!-- Hidden inputs for Nova Poshta data -->
							<input type="hidden" name="npCityName" value={deliveryAddress.npCityName}>
							<input type="hidden" name="npCityFullName" value={deliveryAddress.npCityFullName}>
							<input type="hidden" name="npWarehouse" value={deliveryAddress.npWarehouse}>
							<input type="hidden" name="useNovaPost" value="true">
							<input type="hidden" name="country" value="Ukraine">
							<input type="hidden" name="street" value="">
							<input type="hidden" name="city" value="">
							<input type="hidden" name="postalCode" value="">
							
							<!-- Nova Poshta Selection -->
							<div class="nova-poshta-container">
								<NovaPoshtaSelector
									selectedCityName={deliveryAddress.npCityName}
									selectedCityFullName={deliveryAddress.npCityFullName}
									selectedWarehouse={deliveryAddress.npWarehouse}
									on:change={handleNovaPoshtaChange}
								/>
							</div>
							
							<div class="form-actions">
								<Button 
									type="button" 
									variant="outline" 
									onClick={cancelEdit}
								>
									{$pageTranslations.t('profile.address.cancel')}
								</Button>
								<Button 
									type="submit" 
									variant="primary" 
									disabled={isSaving}
								>
									{#if isSaving}
										{$pageTranslations.t('profile.saving')}
									{:else}
										{isEditing ? $pageTranslations.t('profile.address.update') : $pageTranslations.t('profile.address.save')}
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
					{/if}
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

	.orders-section {
		padding: 24px;
		background: #f8f9fa;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
		text-align: center;
	}

	.orders-description {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #666;
		margin-bottom: 16px;
		line-height: 1.5;
	}

	.orders-button-link {
		text-decoration: none;
		display: inline-block;
		margin: 0 auto;
		transition: opacity 0.2s ease;
	}

	.orders-button-link:hover {
		opacity: 0.9;
	}


	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #333;
		margin: 0 0 16px 0;
	}
	
	.delivery-info {
		background: #f0f7f5;
		border-radius: 12px;
		padding: 16px 20px;
		margin-bottom: 24px;
		border-left: 4px solid #4B766E;
	}

	.delivery-description {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #4B766E;
		font-weight: 500;
		margin: 0;
	}
	
	/* Saved Addresses */
	.saved-addresses {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin-bottom: 24px;
	}
	
	.address-card {
		background: #f9f9f9;
		border-radius: 12px;
		padding: 16px;
		border: 1px solid #eee;
		transition: all 0.2s ease;
	}
	
	.address-card.default {
		background: #f0f7f5;
		border-color: #4B766E;
	}
	
	.address-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	
	.address-name {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #333;
		margin: 0;
	}
	
	.default-badge {
		background: #4B766E;
		color: white;
		font-size: 12px;
		padding: 4px 8px;
		border-radius: 4px;
		font-weight: 500;
	}
	
	.address-content {
		margin-bottom: 12px;
	}
	
	.address-text {
		font-family: 'Nunito', sans-serif;
		font-size: 15px;
		color: #555;
		margin: 0 0 8px 0;
	}
	
	.delivery-type {
		font-size: 13px;
		background: #f0f0f0;
		padding: 2px 8px;
		border-radius: 4px;
		color: #666;
	}
	
	.address-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}
	
	.action-btn {
		background: none;
		border: none;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		padding: 6px 12px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.action-btn.edit {
		background: #f0f0f0;
		color: #555;
	}
	
	.action-btn.default {
		background: #e0f0ed;
		color: #4B766E;
	}
	
	.action-btn.delete {
		background: #ffeded;
		color: #e74c3c;
	}
	
	.action-btn:hover {
		opacity: 0.8;
	}
	
	.add-address-btn {
		background: #f5f5f5;
		border: 1px dashed #ccc;
		border-radius: 12px;
		padding: 16px;
		width: 100%;
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #4B766E;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}
	
	.add-address-btn:hover {
		background: #f0f7f5;
		border-color: #4B766E;
	}
	
	.no-addresses {
		text-align: center;
		padding: 40px 20px;
		background: #f9f9f9;
		border-radius: 12px;
	}
	
	.no-addresses p {
		margin-bottom: 16px;
		color: #666;
	}

	.nova-poshta-container {
		margin-bottom: 24px;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
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

	/* Form styles */
	.form-group {
		margin-bottom: 16px;
	}
	
	.form-label {
		display: block;
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 500;
		color: #333;
		margin-bottom: 8px;
	}
	
	.form-input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 15px;
	}
	
	.checkbox {
		display: flex;
		align-items: center;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 15px;
		color: #333;
		cursor: pointer;
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



		.user-info-grid {
			grid-template-columns: 1fr;
		}
		

		
		.form-actions {
			flex-direction: column;
		}
		
		.action-btn {
			font-size: 13px;
			padding: 4px 8px;
		}
	}
</style>