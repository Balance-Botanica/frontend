<script lang="ts">
	import { onMount } from 'svelte';
	import { advancedLocaleStore, currentLocale, isRTL, currentCurrency, currentCurrencySymbol } from '$lib/i18n/store.js';
	import { SUPPORTED_LOCALES, getEnabledLocales, getLocalesByPriority } from '$lib/i18n/config.js';
	import { user, isAuthenticated, signOutUser } from '$lib/firebase/auth.js';
	import PhoneAuth from '$lib/components/PhoneAuth.svelte';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import Radio from '$lib/components/Radio.svelte';

	let showAuth = false;
	let selectedLocale = '';
	let showAdvancedSettings = false;
	let performanceMetrics = false;
	let accessibilityFeatures = false;
	let seoOptimization = false;

	$: currentLocaleCode = $currentLocale;
	$: currentUser = $user;
	$: isUserAuthenticated = $isAuthenticated;

	onMount(() => {
		selectedLocale = currentLocaleCode;
	});

	async function handleLocaleChange(localeCode: string) {
		if (localeCode === currentLocaleCode) return;
		
		const success = await advancedLocaleStore.setLocale(localeCode, { reason: 'user' });
		if (success) {
			selectedLocale = localeCode;
		}
	}

	async function handleSignOut() {
		await signOutUser();
		showAuth = false;
	}

	function handleAuthSuccess() {
		showAuth = false;
	}

	function handleAuthError(event: CustomEvent) {
		console.error('Authentication error:', event.detail.message);
	}
</script>

<svelte:head>
	<title>Locale Management Dashboard - Balance Botanica</title>
	<meta name="description" content="Manage application locales, languages, and internationalization settings" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Locale Management Dashboard</h1>
					<p class="text-gray-600 mt-1">Manage application locales and internationalization</p>
				</div>
				
				<div class="flex items-center space-x-4">
					{#if isUserAuthenticated}
						<div class="flex items-center space-x-3">
							<div class="text-sm text-gray-700">
								<span class="font-medium">Phone:</span> {currentUser?.phoneNumber || 'N/A'}
							</div>
							<Button on:click={handleSignOut} variant="outline" size="sm">
								Sign Out
							</Button>
						</div>
					{:else}
						<Button on:click={() => showAuth = true} variant="primary">
							Sign In
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Left Column - Current Locale Info -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-lg shadow p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Current Locale</h2>
					
					<div class="space-y-4">
						<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
							<div class="flex items-center space-x-3">
								<span class="text-2xl">{SUPPORTED_LOCALES[currentLocaleCode]?.flag || '🌐'}</span>
								<div>
									<div class="font-medium text-gray-900">
										{SUPPORTED_LOCALES[currentLocaleCode]?.nativeName || 'Unknown'}
									</div>
									<div class="text-sm text-gray-500">
										{SUPPORTED_LOCALES[currentLocaleCode]?.name || 'Unknown'}
									</div>
								</div>
							</div>
							<div class="text-sm text-gray-500 font-mono">
								{currentLocaleCode}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div class="text-center p-3 bg-blue-50 rounded-lg">
								<div class="text-2xl font-bold text-blue-600">
									{currentCurrencySymbol}
								</div>
								<div class="text-xs text-blue-600">Currency</div>
							</div>
							<div class="text-center p-3 bg-green-50 rounded-lg">
								<div class="text-2xl font-bold text-green-600">
									{isRTL ? 'RTL' : 'LTR'}
								</div>
								<div class="text-xs text-green-600">Direction</div>
							</div>
						</div>

						<div class="space-y-2">
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">Date Format:</span>
								<span class="font-medium">{SUPPORTED_LOCALES[currentLocaleCode]?.dateFormat || 'N/A'}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">Time Format:</span>
								<span class="font-medium">{SUPPORTED_LOCALES[currentLocaleCode]?.timeFormat || 'N/A'}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-600">Number Format:</span>
								<span class="font-medium">
									{SUPPORTED_LOCALES[currentLocaleCode]?.numberFormat.decimal || 'N/A'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="bg-white rounded-lg shadow p-6 mt-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
					
					<div class="space-y-3">
						<Button
							on:click={() => advancedLocaleStore.toggle()}
							variant="outline"
							class="w-full"
						>
							Toggle Locale
						</Button>
						
						<Button
							on:click={() => advancedLocaleStore.reset()}
							variant="outline"
							class="w-full"
						>
							Reset to Default
						</Button>
					</div>
				</div>
			</div>

			<!-- Right Column - Locale Management -->
			<div class="lg:col-span-2">
				<!-- Locale Selection -->
				<div class="bg-white rounded-lg shadow p-6 mb-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Locale Selection</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each getEnabledLocales() as locale}
							<button
								on:click={() => handleLocaleChange(locale.code)}
								class="p-4 border rounded-lg text-left transition-all hover:shadow-md {locale.code === currentLocaleCode ? 'border-main bg-main/5' : 'border-gray-200 hover:border-main/30'}"
							>
								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-3">
										<span class="text-2xl">{locale.flag}</span>
										<div>
											<div class="font-medium text-gray-900">{locale.nativeName}</div>
											<div class="text-sm text-gray-500">{locale.name}</div>
										</div>
									</div>
									{#if locale.code === currentLocaleCode}
										<div class="w-3 h-3 bg-main rounded-full"></div>
									{/if}
								</div>
								<div class="mt-2 text-xs text-gray-500">
									Priority: {locale.priority} | {locale.currency} | {locale.fallback || 'No fallback'}
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Advanced Settings -->
				<div class="bg-white rounded-lg shadow p-6 mb-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold text-gray-900">Advanced Settings</h3>
						<Switch
							bind:checked={showAdvancedSettings}
							label="Show Advanced Options"
						/>
					</div>

					{#if showAdvancedSettings}
						<div class="space-y-4">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="space-y-3">
									<Checkbox
										bind:checked={performanceMetrics}
										label="Performance Metrics"
									/>
									<p class="text-xs text-gray-500">Track locale loading times and bundle sizes</p>
								</div>
								
								<div class="space-y-3">
									<Checkbox
										bind:checked={accessibilityFeatures}
										label="Accessibility Features"
									/>
									<p class="text-xs text-gray-500">Enable screen reader and keyboard navigation</p>
								</div>
								
								<div class="space-y-3">
									<Checkbox
										bind:checked={seoOptimization}
										label="SEO Optimization"
									/>
									<p class="text-xs text-gray-500">Add hreflang and alternate URLs</p>
								</div>
							</div>

							<div class="border-t pt-4">
								<h4 class="font-medium text-gray-900 mb-3">Locale Priority</h4>
								<RadioGroup bind:value={selectedLocale} name="locale-priority">
									{#each getLocalesByPriority() as locale}
										<Radio
											value={locale.code}
											label={`${locale.flag} ${locale.nativeName} (Priority: ${locale.priority})`}
										/>
									{/each}
								</RadioGroup>
							</div>
						</div>
					{/if}
				</div>

				<!-- Performance Metrics -->
				{#if performanceMetrics && showAdvancedSettings}
					<div class="bg-white rounded-lg shadow p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div class="p-4 bg-gray-50 rounded-lg">
								<div class="text-2xl font-bold text-gray-900">
									{advancedLocaleStore.getPerformanceMetrics().size || 0}
								</div>
								<div class="text-sm text-gray-600">Metrics Tracked</div>
							</div>
							
							<div class="p-4 bg-gray-50 rounded-lg">
								<div class="text-2xl font-bold text-gray-900">
									{advancedLocaleStore.getChangeHistory().length || 0}
								</div>
								<div class="text-sm text-gray-600">Locale Changes</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Phone Authentication Modal -->
{#if showAuth}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-lg max-w-md w-full p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold text-gray-900">Phone Authentication</h2>
				<button
					on:click={() => showAuth = false}
					class="text-gray-400 hover:text-gray-600"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			
			<PhoneAuth
				on:success={handleAuthSuccess}
				on:error={handleAuthError}
			/>
		</div>
	</div>
{/if}
