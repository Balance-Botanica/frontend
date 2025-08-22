<script lang="ts">
	import { onMount } from 'svelte';
	import { resetCookieConsent, getCookieConsentStatus } from '$lib/stores/cookie-consent';

	let cookieStatus = 'none';

	onMount(() => {
		// Получаем текущий статус cookies
		cookieStatus = getCookieConsentStatus();
	});

	function handleReset() {
		resetCookieConsent();
		cookieStatus = 'none';
		// Перезагружаем страницу чтобы показать consent снова
		setTimeout(() => {
			window.location.reload();
		}, 500);
	}
</script>

<svelte:head>
	<title>Cookie Consent Demo</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-8 text-4xl font-bold text-green-800">🍪 Cookie Consent Demo</h1>
		
		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">Как это работает:</h2>
			<ul class="space-y-2 text-gray-600">
				<li>• Cookie consent появляется автоматически через 1 секунду</li>
				<li>• <strong>Accept Necessary</strong> - белая сфера заполняет кнопку снизу вверх</li>
				<li>• <strong>Accept All</strong> - зеленая сфера + текст подпрыгивает с bounce эффектом</li>
				<li>• Все анимации плавные с ease-out</li>
			</ul>
		</div>

		<div class="mb-8 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">Тестирование:</h2>
			<button
				on:click={handleReset}
				class="rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
			>
				Сбросить Cookie Consent
			</button>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-2xl font-semibold text-gray-800">Статус cookies:</h2>
			<p class="text-gray-600 mb-4">
				{cookieStatus !== 'none' 
					? `Cookies accepted: ${cookieStatus}` 
					: 'Cookies not yet accepted'}
			</p>
			
			<!-- Детальные настройки -->
			{#if cookieStatus !== 'none'}
				<div class="mt-4 space-y-2 text-sm text-gray-600">
					<h3 class="font-semibold text-gray-800">Детальные настройки:</h3>
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span class="w-3 h-3 bg-orange-500 rounded-full"></span>
							<span>Необходимые: Включены (всегда)</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="w-3 h-3 rounded-full" class:bg-green-500={cookieStatus === 'all'} class:bg-gray-300={cookieStatus === 'necessary'}></span>
							<span>Статистика: {cookieStatus === 'all' ? 'Включена' : 'Отключена'}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="w-3 h-3 rounded-full" class:bg-green-500={cookieStatus === 'all'} class:bg-gray-300={cookieStatus === 'necessary'}></span>
							<span>Маркетинг: {cookieStatus === 'all' ? 'Включен' : 'Отключен'}</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
