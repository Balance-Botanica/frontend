<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import { cookieConsentStore, acceptNecessary, acceptAll, hideCookieConsent, updateCookieSetting, acceptSelected, resetCookieConsentForDevelopment } from '$lib/stores/cookie-consent';
	import Switcher from './Switcher.svelte';

	// Подписываемся на store
	$: ({ isVisible, hasShown, showManageModal, settings } = $cookieConsentStore);

	// Анимация появления
	onMount(() => {
		// Показываем через 1 секунду после загрузки страницы
		setTimeout(() => {
			if (!$cookieConsentStore.hasShown) {
				$cookieConsentStore.isVisible = true;
			}
		}, 1000);
	});

	function handleAcceptAll() {
		acceptAll();
	}

	function handleAcceptNecessary() {
		acceptNecessary();
	}

	function handleManage() {
		$cookieConsentStore.showManageModal = true;
	}

	function hideManageModal() {
		$cookieConsentStore.showManageModal = false;
	}

	function handleToggle(key: 'statistics' | 'marketing') {
		updateCookieSetting(key, !settings[key]);
	}

	function handleAcceptSelected() {
		acceptSelected();
	}

	// TODO: Удалить эту функцию после завершения разработки
	function handleResetForDevelopment() {
		resetCookieConsentForDevelopment();
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
			{#if !showManageModal}
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
						on:click={hideManageModal}
						class="rounded-full p-2 transition-colors hover:bg-white/10 cursor-pointer"
						aria-label="Назад"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
					</button>
					<h2 class="text-xl font-bold">{t('cookie_manage.title')}</h2>
				</div>
			{/if}
		</div>

		<!-- Основное содержимое -->
		<div class="transition-all duration-500 ease-out overflow-hidden">
			{#if !showManageModal}
				<!-- Компактный режим -->
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

					<!-- TODO: Удалить после завершения разработки - кнопка для тестирования -->
					<button
						type="button"
						on:click={handleResetForDevelopment}
						class="text-xs text-white/40 underline transition-colors hover:text-white/60 cursor-pointer"
						title="Сбросить куки для тестирования (только для разработки)"
					>
						🔄 Сбросить для тестирования
					</button>
				</div>
			{:else}
				<!-- Развернутый режим -->
				<div class="space-y-6 animate-in slide-in-from-top duration-300">
					<!-- Necessary - всегда включено -->
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

					<!-- TODO: Удалить после завершения разработки - кнопка для тестирования -->
					<div class="pt-4 border-t border-white/20">
						<button
							type="button"
							on:click={handleResetForDevelopment}
							class="w-full px-4 py-2 text-xs text-white/60 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
							title="Сбросить куки для тестирования (только для разработки)"
						>
							🔄 Сбросить куки для тестирования
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer с кнопками (всегда показаны) -->
		<div class="mt-6 flex gap-3">
			<button
				type="button"
				on:click={showManageModal ? handleAcceptSelected : handleAcceptNecessary}
				class="cookie-btn-necessary flex-1 rounded-[20px] border-2 border-white bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#059669]"
			>
				{showManageModal ? t('cookie_manage.accept_selected') : t('cookie_consent.accept_necessary')}
			</button>

			<button
				type="button"
				on:click={handleAcceptAll}
				class="cookie-btn-all flex-1 rounded-[20px] bg-white px-6 py-3 text-sm font-medium text-[#059669] transition-all duration-300 hover:bg-gray-100"
			>
				{t('cookie_consent.accept_all')}
			</button>
		</div>
	</div>
{/if}

<style>
	/* CSS Variables как в оригинале */
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

	/* Основные стили как в оригинале */
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
		min-width: 200px; /* Базовый размер для английского */
	}

	/* Адаптивные размеры для разных языков */
	:global([lang="uk"]) .cookie-btn-necessary {
		min-width: 220px; /* Больше для украинского */
	}

	:global([lang="en"]) .cookie-btn-necessary {
		min-width: 200px; /* Меньше для английского */
	}

	/* Accept All Button Styles */
	.cookie-btn-all {
		transition: all 0.3s ease;
		min-width: 120px; /* Базовый размер для английского */
	}

	/* Адаптивные размеры для разных языков */
	:global([lang="uk"]) .cookie-btn-all {
		min-width: 140px; /* Больше для украинского */
	}

	:global([lang="en"]) .cookie-btn-all {
		min-width: 120px; /* Меньше для английского */
	}


</style>
