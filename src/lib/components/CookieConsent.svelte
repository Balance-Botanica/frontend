<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import { 
		cookieConsentStore, 
		acceptNecessary, 
		acceptAll, 
		hideCookieConsent, 
		updateCookieSetting, 
		acceptSelected,
		showManageModal,
		hideManageModal
	} from '$lib/stores/cookie-consent';
	import Switcher from './Switcher.svelte';

	// Subscribe to store
	$: ({ isVisible, hasShown, showManageModal: isManageModalOpen, settings } = $cookieConsentStore);

	function handleAcceptAll() {
		acceptAll();
	}

	function handleAcceptNecessary() {
		acceptNecessary();
	}

	function handleManage() {
		showManageModal();
	}

	function handleHideManageModal() {
		hideManageModal();
	}

	function handleToggle(key: 'statistics' | 'marketing') {
		updateCookieSetting(key, !settings[key]);
	}

	function handleAcceptSelected() {
		acceptSelected();
	}
</script>

{#if isVisible}
	<div
		class="fixed bottom-[30px] right-[30px] z-[10000000] w-[500px] max-w-[calc(100%-60px)] rounded-[40px] text-white bg-[#059669] px-8 py-6 transition-all duration-500 ease-out"
		class:translate-y-0={isVisible}
		class:translate-y-full={!isVisible}
		class:opacity-100={isVisible}
		class:opacity-0={!isVisible}
	>
		<!-- Header -->
		<div class="mb-4 flex items-start justify-between">
			{#if !isManageModalOpen}
				<div class="flex items-center gap-3">
					<h3 class="text-lg font-semibold">{t('cookie_consent.title')}</h3>
					<img src="/icons/cookie.svg" alt="Cookie" class="h-6 w-6" />
				</div>
				<button
					on:click={hideCookieConsent}
					class="rounded-full p-1 transition-colors hover:bg-white/10 cursor-pointer"
					aria-label={t('cookie_consent.close')}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6L18 18" />
					</svg>
				</button>
			{:else}
				<div class="flex items-center gap-3">
					<button
						on:click={handleHideManageModal}
						class="rounded-full p-2 transition-colors hover:bg-white/10 cursor-pointer"
						aria-label="Back"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
					</button>
					<h2 class="text-xl font-bold">{t('cookie_manage.title')}</h2>
				</div>
			{/if}
		</div>

		<!-- Main content -->
		<div class="transition-all duration-500 ease-out overflow-hidden">
			{#if !isManageModalOpen}
				<!-- Compact mode -->
				<div class="space-y-4">
					<p class="text-sm text-white/80">
						{t('cookie_consent.description')}
					</p>
					
					<button	
						on:click={handleManage}
						class="text-sm underline transition-colors hover:text-white/60 cursor-pointer"
					>
						{t('cookie_consent.manage')}
					</button>
				</div>
			{:else}
				<!-- Expanded mode -->
				<div class="space-y-6 animate-in slide-in-from-top duration-300">
					<!-- Necessary - always enabled -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="font-semibold">{t('cookie_manage.necessary.title')}</h3>
								<p class="text-sm text-white/80 mt-1">
									{t('cookie_manage.necessary.description')}
								</p>
							</div>
							<Switcher 
								checked={true} 
								disabled={true}
								variant="cookie"
								onChange={() => {}} 
							/>
						</div>
					</div>

					<!-- Statistics -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="font-semibold">{t('cookie_manage.statistics.title')}</h3>
								<p class="text-sm text-white/80 mt-1">
									{t('cookie_manage.statistics.description')}
								</p>
							</div>
							<Switcher 
								checked={settings.statistics}
								variant="cookie"
								onChange={(checked) => handleToggle('statistics')}
							/>
						</div>
					</div>

					<!-- Marketing -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="font-semibold">{t('cookie_manage.marketing.title')}</h3>
								<p class="text-sm text-white/80 mt-1">
									{t('cookie_manage.marketing.description')}
								</p>
							</div>
							<Switcher 
								checked={settings.marketing}
								variant="cookie"
								onChange={(checked) => handleToggle('marketing')}
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer with buttons (always shown) -->
		<div class="mt-6 flex gap-3">
			<button
				type="button"
				on:click={isManageModalOpen ? handleAcceptSelected : handleAcceptNecessary}
				class="cookie-btn-necessary flex-1 rounded-[20px] border-2 border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#059669] cursor-pointer"
			>
				{isManageModalOpen ? t('cookie_manage.accept_selected') : t('cookie_consent.accept_necessary')}
			</button>

			<button
				type="button"
				on:click={handleAcceptAll}
				class="cookie-btn-all flex-1 rounded-[20px] bg-white px-6 py-3 text-sm font-medium text-[#059669] transition-all duration-300 hover:bg-gray-100 cursor-pointer"
			>
				{t('cookie_consent.accept_all')}
			</button>
		</div>
	</div>
{/if}

<style>
	/* CSS Variables for consistency */
	:global(:root) {
		--rt-color-white: #fff;
		--rt-color-dark: #222;
		--rt-color-success: #8dc572;
		--rt-color-error: #be6464;
		--rt-color-warning: #f0ad4e;
		--rt-color-info: #337ab7;
		--rt-opacity: 0.9;
		--rt-transition-show-delay: 0.15s;
		--rt-transition-closing-delay: 0.15s;
	}

	/* Base styles for cookie management modal */
	:global(.cookie-manage-modal) {
		font-family: "Nunito", "GT Walsheim", "Helvetica Neue", Helvetica, Arial, sans-serif;
		letter-spacing: -0.02em;
		line-height: 1.2;
		word-break: break-word;
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-font-smoothing: antialiased;
		color: inherit;
		position: relative;
		display: inline-flex;
		align-items: center;
		font-size: 22px;
		line-height: 125%;
		font-weight: 400 !important;
		cursor: pointer;
		white-space: nowrap;
	}

	/* Accept Necessary Button Styles */
	.cookie-btn-necessary {
		transition: all 0.3s ease;
		min-width: 200px; /* Base size for English */
	}

	/* Adaptive sizes for different languages */
	:global([lang="uk"]) .cookie-btn-necessary {
		min-width: 220px; /* Larger for Ukrainian */
	}

	:global([lang="en"]) .cookie-btn-necessary {
		min-width: 200px; /* Smaller for English */
	}

	/* Accept All Button Styles */
	.cookie-btn-all {
		transition: all 0.3s ease;
		min-width: 120px; /* Base size for English */
	}

	/* Adaptive sizes for different languages */
	:global([lang="uk"]) .cookie-btn-all {
		min-width: 140px; /* Larger for Ukrainian */
	}

	:global([lang="en"]) .cookie-btn-all {
		min-width: 120px; /* Smaller for English */
	}
</style>
