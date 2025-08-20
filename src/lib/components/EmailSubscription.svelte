<script lang="ts">
	import PawHybridPatternBG from './PawHybridPatternBG.svelte';
	import { t } from '../i18n';
	
	let { compact = false } = $props<{ compact?: boolean }>();
	const sectionPadding = compact ? 'py-8 md:py-10' : 'py-20 md:py-28';
	
	let email = $state('');
	let isSubmitting = $state(false);
	
	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!email) return;
		
		isSubmitting = true;
		// TODO: Implement actual email subscription logic
		await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
		isSubmitting = false;
		email = '';
	}
</script>

<section aria-labelledby="email-subscription-heading" class={`w-full ${sectionPadding} bg-main/5 relative overflow-hidden`}>
	<!-- Fluffy Paw Pattern Background -->
	<PawHybridPatternBG patternCount={35} opacity={0.12} density="medium" />
	
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="w-full rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
			<div class={`mx-auto max-w-4xl text-center ${compact ? 'py-8 px-6' : 'py-16 px-8'}`}>
				<!-- Main Heading -->
				<h2 id="email-subscription-heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					{t('footer.newsletter.title')}
				</h2>
				
				<!-- Description -->
				<p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
					{t('footer.newsletter.description')}
				</p>
				
				<!-- Email Subscription Form -->
				<form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
					<div class="flex-1">
						<label for="email-subscription" class="sr-only">Email address</label>
						<input
							type="email"
							id="email-subscription"
							bind:value={email}
							placeholder={t('footer.newsletter.placeholder')}
							required
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-main text-gray-900 placeholder-gray-500"
							aria-label="Email address for newsletter subscription"
						/>
					</div>
					<button
						type="submit"
						disabled={isSubmitting || !email}
						class="px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-main-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main"
					>
						{isSubmitting ? t('email_subscription.subscribing_button') : t('footer.newsletter.button')}
					</button>
				</form>
				
				<!-- Additional Benefits -->
				<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-500">
					<div class="flex items-center justify-center">
						<svg class="w-5 h-5 mr-2 text-main" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						<span>{t('email_subscription.benefits.exclusive_offers')}</span>
					</div>
					<div class="flex items-center justify-center">
						<svg class="w-5 h-5 mr-2 text-main" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						<span>{t('email_subscription.benefits.wellness_tips')}</span>
					</div>
					<div class="flex items-center justify-center">
						<svg class="w-5 h-5 mr-2 text-main" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
						<span>{t('email_subscription.benefits.new_products')}</span>
					</div>
				</div>
				
				<!-- Privacy Notice -->
				<p class="mt-6 text-xs text-gray-400">
					{t('email_subscription.privacy_notice')} 
					<a href="/privacy" class="text-main hover:underline">{t('email_subscription.privacy_policy')}</a>
				</p>
			</div>
		</div>
	</div>
</section>
