<script lang="ts">
	import { t } from '$lib/i18n';
	import { 
		cookieConsentStore, 
		hideManageModal, 
		updateCookieSetting, 
		acceptSelected, 
		acceptAll 
	} from '$lib/stores/cookie-consent';

	// Подписываемся на store
	$: ({ showManageModal, settings } = $cookieConsentStore);

	// Обработчики для toggle switches
	function handleToggle(key: 'statistics' | 'marketing') {
		updateCookieSetting(key, !settings[key]);
	}

	function handleAcceptSelected() {
		acceptSelected();
	}

	function handleAcceptAll() {
		acceptAll();
	}

	function handleBack() {
		hideManageModal();
	}
</script>

{#if showManageModal}
	<!-- Backdrop -->
	<div 
		class="fixed inset-0 z-[10000000] bg-black/30 transition-opacity"
		on:click={handleBack}
	></div>

	<!-- Modal -->
	<div class="fixed inset-0 z-[10000000] flex items-end justify-end p-8">
		<div 
			class="cookie-manage-modal w-[500px] max-w-[calc(100%-60px)] rounded-[40px] bg-[rgb(41,39,49)] p-8 text-white shadow-2xl border border-[rgb(41,39,49)]"
			on:click|stopPropagation={() => {}}
		>
			<!-- Header с кнопкой назад -->
			<div class="mb-6 flex items-center gap-3">
				<button
					on:click={handleBack}
					class="rounded-full p-2 transition-colors hover:bg-gray-700"
					aria-label="Назад"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M19 12H5M12 19l-7-7 7-7" />
					</svg>
				</button>
				<h2 class="text-xl font-bold">{t('cookie_manage.title')}</h2>
			</div>

			<!-- Категории cookies -->
			<div class="space-y-6">
				<!-- Necessary - всегда включено -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h3 class="font-semibold">{t('cookie_manage.necessary.title')}</h3>
						<div class="cookie-toggle necessary-toggle">
							<input 
								type="checkbox" 
								checked={true} 
								disabled 
								class="sr-only"
							/>
							<span class="toggle-track">
								<span class="toggle-thumb"></span>
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-300">
						{t('cookie_manage.necessary.description')}
					</p>
				</div>

				<!-- Statistics -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h3 class="font-semibold">{t('cookie_manage.statistics.title')}</h3>
						<div class="cookie-toggle">
							<input 
								type="checkbox" 
								checked={settings.statistics}
								on:change={() => handleToggle('statistics')}
								class="sr-only"
							/>
							<span class="toggle-track" class:active={settings.statistics}>
								<span class="toggle-thumb" class:active={settings.statistics}></span>
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-300">
						{t('cookie_manage.statistics.description')}
					</p>
				</div>

				<!-- Marketing -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<h3 class="font-semibold">{t('cookie_manage.marketing.title')}</h3>
						<div class="cookie-toggle">
							<input 
								type="checkbox" 
								checked={settings.marketing}
								on:change={() => handleToggle('marketing')}
								class="sr-only"
							/>
							<span class="toggle-track" class:active={settings.marketing}>
								<span class="toggle-thumb" class:active={settings.marketing}></span>
							</span>
						</div>
					</div>
					<p class="text-sm text-gray-300">
						{t('cookie_manage.marketing.description')}
					</p>
				</div>
			</div>

			<!-- Кнопки действий -->
			<div class="mt-8 flex gap-3">
				<button
					on:click={handleAcceptSelected}
					class="flex-1 rounded-[20px] border border-white bg-white px-6 py-4 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
				>
					{t('cookie_manage.accept_selected')}
				</button>
				<button
					on:click={handleAcceptAll}
					class="flex-1 rounded-[20px] bg-white px-6 py-4 text-sm font-medium text-gray-800 transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
				>
					{t('cookie_manage.accept_all')}
				</button>
			</div>
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
		font-family: "GT Walsheim", "Helvetica Neue", Helvetica, Arial, sans-serif;
		letter-spacing: -0.02em;
		line-height: 1.2;
		word-break: break-word;
		box-sizing: border-box;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		-webkit-font-smoothing: antialiased;
	}

	/* Toggle Switch Styles */
	.cookie-toggle {
		position: relative;
		width: 48px;
		height: 28px;
	}

	.toggle-track {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #4b5563; /* gray-600 */
		border-radius: 16px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-track.active {
		background-color: #f97316; /* orange-500 */
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 24px;
		height: 24px;
		background-color: white;
		border-radius: 50%;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.toggle-thumb.active {
		transform: translateX(20px);
	}

	/* Necessary toggle всегда активен */
	.necessary-toggle .toggle-track {
		background-color: #f97316; /* orange-500 */
	}

	.necessary-toggle .toggle-thumb {
		transform: translateX(20px);
	}

	/* Анимация для thumb */
	.toggle-thumb {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Hover эффекты */
	.toggle-track:hover {
		opacity: 0.9;
	}

	/* Focus стили для accessibility */
	.cookie-toggle input:focus + .toggle-track {
		outline: 2px solid #3b82f6; /* blue-500 */
		outline-offset: 2px;
	}
</style>
