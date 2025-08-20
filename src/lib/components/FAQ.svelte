<script lang="ts">
	import { t } from '../i18n';
	import { colors } from '../colors';
	import { typography } from '../typography';
	import Button from './Button.svelte';

	interface FAQItem {
		question: string;
		answer: string;
	}

	const faqItems: FAQItem[] = [
		{
			question: t('faq.benefits.question'),
			answer: t('faq.benefits.answer')
		},
		{
			question: t('faq.choosing.question'),
			answer: t('faq.choosing.answer')
		},
		{
			question: t('faq.testing.question'),
			answer: t('faq.testing.answer')
		},
		{
			question: t('faq.spectrum.question'),
			answer: t('faq.spectrum.answer')
		},
		{
			question: t('faq.effects.question'),
			answer: t('faq.effects.answer')
		}
	];

	let openIndex: number | null = null;

	function toggleFAQ(index: number) {
		openIndex = openIndex === index ? null : index;
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleFAQ(index);
		}
	}
</script>

<section class="py-16 bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold text-gray-900 mb-4" style="color: {colors.main}">
				{t('faq.title')}
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto" style="font-size: {typography.sizes.base}">
				{t('faq.subtitle')}
			</p>
		</div>

		<!-- FAQ Items -->
		<div class="space-y-4">
			{#each faqItems as item, index}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
					<button
						class="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
						onclick={() => toggleFAQ(index)}
						onkeydown={(e) => handleKeyDown(e, index)}
						aria-expanded={openIndex === index}
						aria-controls="faq-answer-{index}"
					>
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-medium text-gray-900 pr-4" style="font-size: {typography.sizes.base}">
								{item.question}
							</h3>
							<span class="flex-shrink-0 ml-2">
								<svg
									class="w-5 h-5 text-gray-500 transform transition-transform duration-200 {openIndex === index ? 'rotate-180' : ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</span>
						</div>
					</button>

					{#if openIndex === index}
						<div
							id="faq-answer-{index}"
							class="px-6 pb-4"
							style="font-size: {typography.sizes.base}"
						>
							<p class="text-gray-600 leading-relaxed">{item.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- CTA Section -->
		<div class="text-center mt-12">
			<p class="text-lg text-gray-600 mb-6" style="font-size: {typography.sizes.base}">
				{t('faq.cta.text')}
			</p>
			<Button variant="primary" size="lg">
				{t('faq.cta.button')}
			</Button>
		</div>
	</div>
</section>
