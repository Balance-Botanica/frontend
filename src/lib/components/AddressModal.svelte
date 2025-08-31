<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import NovaPoshtaSelector from './NovaPoshtaSelector.svelte';
	import { createPageTranslations } from '$lib/i18n/store';
	import { colors } from '$lib/colors';

	// Props
	export let show = false;

	// Prevent body scroll when modal is open
	$: if (show && typeof document !== 'undefined') {
		document.body.style.overflow = 'hidden';
	} else if (!show && typeof document !== 'undefined') {
		document.body.style.overflow = '';
	}



	// Create page translations
	const pageTranslations = createPageTranslations();

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		save: { addressData: any };
		close: void;
	}>();

	// Form state
	let addressData = {
		name: '',
		npCityName: '',
		npCityFullName: '',
		npWarehouse: '',
		useNovaPost: true,
		isDefault: false
	};

	let isSaving = false;
	let saveError = '';

	// Handle Nova Poshta selection changes
	function handleNovaPoshtaChange(event: CustomEvent<{npCityName: string; npCityFullName: string; npWarehouse: string}>) {
		const { npCityName, npCityFullName, npWarehouse } = event.detail;
		addressData = {
			...addressData,
			npCityName,
			npCityFullName,
			npWarehouse
		};
	}

	// Handle form submission
	async function handleSubmit() {
		if (!addressData.name.trim()) {
			saveError = 'Please enter address name';
			return;
		}

		if (!addressData.npCityName || !addressData.npWarehouse) {
			saveError = 'Please select city and warehouse';
			return;
		}

		isSaving = true;
		saveError = '';

		try {
			dispatch('save', { addressData });
		} catch (error) {
			saveError = 'Failed to save address. Please try again.';
		} finally {
			isSaving = false;
		}
	}

	// Handle modal close
	function handleClose() {
		// Reset form
		addressData = {
			name: '',
			npCityName: '',
			npCityFullName: '',
			npWarehouse: '',
			useNovaPost: true,
			isDefault: false
		};
		saveError = '';
		dispatch('close');
	}

	// Handle background click
	function handleBackgroundClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleClose();
		}
	}
</script>

{#if show}

	<!-- Modal overlay -->
	<div
		class="modal-overlay"
		on:click={handleBackgroundClick}
		style="
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			width: 100vw !important;
			height: 100vh !important;
			background: rgba(0, 0, 0, 0.8) !important;
			display: flex !important;
			align-items: center !important;
			justify-content: center !important;
			z-index: 99999999 !important;
			padding: 20px !important;
			box-sizing: border-box !important;
		"
	>
		<div
			class="modal-content"
			style="
				background: white !important;
				border-radius: 16px !important;
				border: 5px solid {colors.main} !important;
				max-width: 500px !important;
				width: 100% !important;
				max-height: 90vh !important;
				overflow-y: auto !important;
				box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
				position: relative !important;
				z-index: 1000000 !important;
				padding: 0 !important;
				margin: 0 !important;
			"
		>
			<!-- Modal header -->
			<div
				class="modal-header"
				style="
					display: flex !important;
					justify-content: space-between !important;
					align-items: center !important;
					padding: 24px !important;
					border-bottom: 1px solid #e0e0e0 !important;
					position: relative !important;
				"
			>
				<h2
					class="modal-title"
					style="
						font-family: 'Nunito', sans-serif !important;
						font-size: 20px !important;
						font-weight: 600 !important;
						color: #333 !important;
						margin: 0 !important;
					"
				>
					{$pageTranslations?.t('profile.address.addNew') || 'Add New Address'}
				</h2>
				<button
					class="close-btn"
					on:click={handleClose}
					aria-label="Close"
					style="
						background: none !important;
						border: none !important;
						cursor: pointer !important;
						padding: 8px !important;
						border-radius: 6px !important;
						color: #666 !important;
						transition: all 0.2s ease !important;
						position: absolute !important;
						top: 16px !important;
						right: 16px !important;
						width: 32px !important;
						height: 32px !important;
						display: flex !important;
						align-items: center !important;
						justify-content: center !important;
					"
					on:mouseenter={(e) => e.currentTarget.style.background = '#f5f5f5'}
					on:mouseleave={(e) => e.currentTarget.style.background = 'none'}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal body -->
			<div class="modal-body">
				<form on:submit|preventDefault={handleSubmit}>
					<!-- Address Name -->
					<div class="form-group">
						<label for="modal-address-name" class="form-label">
							{$pageTranslations?.t('profile.address.addressName') || 'Address Name'}
						</label>
						<input
							type="text"
							id="modal-address-name"
							class="form-input"
							placeholder={$pageTranslations?.t('profile.address.addressNamePlaceholder') || 'Home, Work, etc.'}
							bind:value={addressData.name}
							required
						/>
					</div>

					<!-- Is Default Checkbox -->
					<div class="form-group checkbox">
						<label class="checkbox-label">
							<input
								type="checkbox"
								id="modal-is-default"
								bind:checked={addressData.isDefault}
							/>
							{$pageTranslations?.t('profile.address.setDefaultCheckbox') || 'Set as default address'}
						</label>
					</div>

					<!-- Nova Poshta Selection -->
					<div class="nova-poshta-container">
						<NovaPoshtaSelector
							selectedCityName={addressData.npCityName}
							selectedCityFullName={addressData.npCityFullName}
							selectedWarehouse={addressData.npWarehouse}
							on:change={handleNovaPoshtaChange}
						/>
					</div>

					<!-- Error message -->
					{#if saveError}
						<div class="error-message">
							{saveError}
						</div>
					{/if}
				</form>
			</div>

			<!-- Modal footer -->
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-secondary"
					on:click={handleClose}
					disabled={isSaving}
				>
					{$pageTranslations?.t('profile.address.cancel') || 'Cancel'}
				</button>
				<button
					type="button"
					class="btn btn-primary"
					on:click={handleSubmit}
					disabled={isSaving}
				>
					{#if isSaving}
						{$pageTranslations?.t('profile.saving') || 'Saving...'}
					{:else}
						{$pageTranslations?.t('profile.address.save') || 'Save Address'}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed !important;
		top: 0 !important;
		left: 0 !important;
		width: 100vw !important;
		height: 100vh !important;
		background: rgba(0, 0, 0, 0.5) !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		z-index: 999999 !important;
		padding: 20px !important;
		box-sizing: border-box !important;
	}

	.modal-content {
		background: white !important;
		border-radius: 16px !important;
		max-width: 500px !important;
		width: 100% !important;
		max-height: 90vh !important;
		overflow-y: auto !important;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
		position: relative !important;
		z-index: 1000000 !important;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 1px solid #e0e0e0;
	}

	.modal-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #333;
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: #666;
		cursor: pointer;
		padding: 8px;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		background: #f5f5f5 !important;
		color: #333 !important;
	}

	.modal-body {
		padding: 24px;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		padding: 24px;
		border-top: 1px solid #e0e0e0;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-label {
		display: block;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #666;
		margin-bottom: 8px;
	}

	.form-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #333;
		transition: border-color 0.2s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: #4B766E;
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
		font-size: 14px;
		color: #333;
		cursor: pointer;
		margin: 0;
	}

	.checkbox-label input[type="checkbox"] {
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.nova-poshta-container {
		margin-bottom: 0;
	}

	.btn {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #4B766E;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #3a5d56;
	}

	.btn-secondary {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #e9ecef;
	}

	.error-message {
		margin-top: 16px;
		padding: 12px 16px;
		background-color: #fee;
		color: #e74c3c;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		text-align: center;
		border: 1px solid #f5c6cb;
	}

	@media (max-width: 600px) {
		.modal-overlay {
			padding: 10px;
		}

		.modal-header,
		.modal-body,
		.modal-footer {
			padding: 16px;
		}

		.modal-footer {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}
</style>
