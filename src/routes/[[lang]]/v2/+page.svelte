<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import EmailSubscription from '$lib/components/EmailSubscription.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	// Use global translations (reactive to language changes)
	const pageTranslations = createPageTranslations();

	// State for email form
	let email = $state('');
	let isSubmitting = $state(false);
	let isSubscribed = $state(false);
	let errorMessage = $state('');

	// Function to handle email subscription
	async function handleSubscribe(event: Event) {
		event.preventDefault();
		if (!email) return;

		isSubmitting = true;
		errorMessage = '';

		try {
			// Simulate API call - in a real implementation, this would connect to your backend
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			// Success
			isSubscribed = true;
			email = '';
		} catch (error) {
			errorMessage = 'Something went wrong. Please try again.';
			console.error('Subscription error:', error);
		} finally {
			isSubmitting = false;
		}
	}

	// Function to validate email
	function isValidEmail(email: string): boolean {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}
</script>

{#if $pageTranslations}
	<SEO
		title="Balance Botanica - Purrrfect Cubes Coming Soon"
		description="Be the first to know when our revolutionary Balance Botanica Purrrfect Cubes for pets are released. Sign up for exclusive updates!"
	/>

	<!-- Main Content -->
	<main class="flex-1">
		<!-- Hero Section -->
		<section class="w-full bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] py-16 md:py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex flex-col items-center text-center">
					<!-- Badge -->
					<div class="mb-6 inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#2e7d32] shadow-sm">
						<span class="mr-2 h-2 w-2 rounded-full bg-[#2e7d32]"></span>
						{ $pageTranslations.t('v2.coming_soon') }
					</div>

					<!-- Main Heading -->
					<h1 class="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
						{ $pageTranslations.t('v2.hero.title') }
					</h1>

					<!-- Subtitle -->
					<p class="mb-10 max-w-3xl text-xl text-gray-700 md:text-2xl">
						{ $pageTranslations.t('v2.hero.subtitle') }
					</p>

					<!-- Image Placeholder -->
					<div class="mb-12 flex h-64 w-full max-w-2xl items-center justify-center rounded-2xl bg-white/50 shadow-lg">
						<div class="text-center">
							<div class="mb-4 text-5xl">🐱</div>
							<p class="text-lg font-medium text-gray-600">{ $pageTranslations.t('v2.hero.coming_soon_image') }</p>
						</div>
					</div>

					<!-- CTA Button -->
					<a 
						href="#subscribe" 
						class="rounded-full bg-[#3f6f68] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#2d5a54] hover:shadow-xl"
					>
						{ $pageTranslations.t('v2.hero.notify_me') }
					</a>
				</div>
			</div>
		</section>

		<!-- Benefits Section -->
		<section class="py-16 md:py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
						{ $pageTranslations.t('v2.benefits.title') }
					</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-600">
						{ $pageTranslations.t('v2.benefits.subtitle') }
					</p>
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					<!-- Benefit 1 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-6 text-4xl text-[#3f6f68]">🌿</div>
						<h3 class="mb-4 text-xl font-bold text-gray-900">
							{ $pageTranslations.t('v2.benefits.natural.title') }
						</h3>
						<p class="text-gray-600">
							{ $pageTranslations.t('v2.benefits.natural.description') }
						</p>
					</div>

					<!-- Benefit 2 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-6 text-4xl text-[#3f6f68]">🐾</div>
						<h3 class="mb-4 text-xl font-bold text-gray-900">
							{ $pageTranslations.t('v2.benefits.pets_love.title') }
						</h3>
						<p class="text-gray-600">
							{ $pageTranslations.t('v2.benefits.pets_love.description') }
						</p>
					</div>

					<!-- Benefit 3 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-6 text-4xl text-[#3f6f68]">💝</div>
						<h3 class="mb-4 text-xl font-bold text-gray-900">
							{ $pageTranslations.t('v2.benefits.care.title') }
						</h3>
						<p class="text-gray-600">
							{ $pageTranslations.t('v2.benefits.care.description') }
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Story Section -->
		<section class="bg-gray-50 py-16 md:py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex flex-col items-center gap-12 lg:flex-row">
					<div class="flex-1">
						<h2 class="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
							{ $pageTranslations.t('v2.story.title') }
						</h2>
						<p class="mb-6 text-lg text-gray-600">
							{ $pageTranslations.t('v2.story.paragraph1') }
						</p>
						<p class="mb-6 text-lg text-gray-600">
							{ $pageTranslations.t('v2.story.paragraph2') }
						</p>
						<p class="text-lg text-gray-600">
							{ $pageTranslations.t('v2.story.paragraph3') }
						</p>
					</div>
					<div class="flex flex-1 justify-center">
						<div class="flex h-80 w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] shadow-lg">
							<div class="text-center">
								<div class="mb-4 text-6xl">❤️</div>
								<p class="text-lg font-medium text-gray-700">{ $pageTranslations.t('v2.story.illustration') }</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Email Subscription Section -->
		<section id="subscribe" class="py-16 md:py-24">
			<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<div class="rounded-3xl bg-gradient-to-br from-[#3f6f68] to-[#2d5a54] p-8 text-white shadow-xl md:p-12">
					<div class="text-center">
						<h2 class="mb-4 text-3xl font-bold md:text-4xl">
							{ $pageTranslations.t('v2.subscription.title') }
						</h2>
						<p class="mb-8 text-xl">
							{ $pageTranslations.t('v2.subscription.subtitle') }
						</p>

						{#if isSubscribed}
							<div class="rounded-xl bg-white/10 p-6">
								<div class="mb-4 text-4xl">🎉</div>
								<h3 class="mb-2 text-2xl font-bold">
									{ $pageTranslations.t('v2.subscription.success.title') }
								</h3>
								<p class="text-lg">
									{ $pageTranslations.t('v2.subscription.success.message') }
								</p>
							</div>
						{:else}
							<form onsubmit={handleSubscribe} class="mx-auto max-w-md">
								<div class="mb-4">
									<label for="email" class="sr-only">Email address</label>
									<input
										type="email"
										id="email"
										bind:value={email}
										placeholder={ $pageTranslations.t('v2.subscription.placeholder') }
										required
										class="w-full rounded-full px-6 py-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
										aria-label="Email address for updates"
									/>
								</div>
								<button
									type="submit"
									disabled={isSubmitting || !email || !isValidEmail(email)}
									class="w-full rounded-full bg-white px-6 py-4 text-lg font-bold text-[#3f6f68] shadow-lg transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isSubmitting 
										? $pageTranslations.t('v2.subscription.submitting') 
										: $pageTranslations.t('v2.subscription.button')}
								</button>
								{#if errorMessage}
									<p class="mt-4 text-red-200">{errorMessage}</p>
								{/if}
							</form>
						{/if}

						<div class="mt-8 flex flex-wrap justify-center gap-6 text-sm">
							<div class="flex items-center">
								<svg class="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{ $pageTranslations.t('v2.subscription.benefits.exclusive') }</span>
							</div>
							<div class="flex items-center">
								<svg class="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{ $pageTranslations.t('v2.subscription.benefits.early_access') }</span>
							</div>
							<div class="flex items-center">
								<svg class="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{ $pageTranslations.t('v2.subscription.benefits.special_offers') }</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Testimonials Preview -->
		<section class="py-16 md:py-24">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
						{ $pageTranslations.t('v2.testimonials.title') }
					</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-600">
						{ $pageTranslations.t('v2.testimonials.subtitle') }
					</p>
				</div>

				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					<!-- Testimonial 1 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-4 flex text-yellow-400">
							{'★'.repeat(5)}
						</div>
						<p class="mb-6 text-gray-600 italic">
							"{ $pageTranslations.t('v2.testimonials.quote1') }"
						</p>
						<div class="flex items-center">
							<div class="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
							<div>
								<p class="font-bold text-gray-900">Sarah M.</p>
								<p class="text-gray-600">Dog Parent to Max</p>
							</div>
						</div>
					</div>

					<!-- Testimonial 2 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-4 flex text-yellow-400">
							{'★'.repeat(5)}
						</div>
						<p class="mb-6 text-gray-600 italic">
							"{ $pageTranslations.t('v2.testimonials.quote2') }"
						</p>
						<div class="flex items-center">
							<div class="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
							<div>
								<p class="font-bold text-gray-900">Michael T.</p>
								<p class="text-gray-600">Cat Dad to Whiskers</p>
							</div>
						</div>
					</div>

					<!-- Testimonial 3 -->
					<div class="rounded-2xl bg-white p-8 shadow-lg">
						<div class="mb-4 flex text-yellow-400">
							{'★'.repeat(5)}
						</div>
						<p class="mb-6 text-gray-600 italic">
							"{ $pageTranslations.t('v2.testimonials.quote3') }"
						</p>
						<div class="flex items-center">
							<div class="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
							<div>
								<p class="font-bold text-gray-900">Emma R.</p>
								<p class="text-gray-600">Pet Lover</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</main>
{/if}

<style>
	/* Custom styles if needed */
</style>