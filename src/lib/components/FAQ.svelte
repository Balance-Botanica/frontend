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

<section class="faq-section">
	<div class="faq-container">
		<!-- Grey area inside with same border styling -->
		<div class="faq-grey-area">
			<!-- Section Header -->
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900" style="color: {colors.main}">
					{t('faq.title')}
				</h2>
				<p
					class="mx-auto max-w-2xl text-lg text-gray-600"
					style="font-size: {typography.sizes.base}"
				>
					{t('faq.subtitle')}
				</p>
			</div>

			<!-- FAQ Items -->
			<div class="space-y-4">
				{#each faqItems as item, index (index)}
					<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
						<button
							class="w-full px-6 py-4 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
							onclick={() => toggleFAQ(index)}
							onkeydown={(e) => handleKeyDown(e, index)}
							aria-expanded={openIndex === index}
							aria-controls="faq-answer-{index}"
						>
							<div class="flex items-center justify-between">
								<h3
									class="pr-4 text-lg font-medium text-gray-900"
									style="font-size: {typography.sizes.base}"
								>
									{item.question}
								</h3>
								<span class="ml-2 flex-shrink-0">
									<svg
										class="h-5 w-5 transform text-gray-500 transition-transform duration-200 {openIndex ===
										index
											? 'rotate-180'
											: ''}"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7"
										/>
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
								<p class="leading-relaxed text-gray-600">{item.answer}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- CTA Section -->
			<div class="mt-12 text-center">
				<p class="mb-6 text-lg text-gray-600" style="font-size: {typography.sizes.base}">
					{t('faq.cta.text')}
				</p>
				<Button variant="primary" size="lg">
					{t('faq.cta.button')}
				</Button>
			</div>
		</div>
	</div>
</section>

<style>
	.faq-section {
		background: white;
		padding: 6rem 0;
		margin: 4rem 0;
		width: 100%;
	}

	.faq-container {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.faq-grey-area {
		background: #f9fafb; /* bg-gray-50 equivalent */
		border-radius: 1rem; /* rounded-2xl equivalent */
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm equivalent */
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05); /* ring-1 ring-black/5 equivalent */
		padding: 3rem 2rem;
		margin: 2rem 0;
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		.faq-container {
			padding: 0 1.5rem;
		}
	}

	@media (min-width: 1024px) {
		.faq-container {
			padding: 0 2rem;
		}
	}

	@media (max-width: 768px) {
		.faq-section {
			padding: 4rem 0;
			margin: 2rem 0;
		}

		.faq-grey-area {
			padding: 2rem 1.5rem;
			margin: 1.5rem 0;
		}
	}

	@media (max-width: 480px) {
		.faq-section {
			padding: 3rem 0;
			margin: 1.5rem 0;
		}

		.faq-grey-area {
			padding: 1.5rem 1rem;
			margin: 1rem 0;
		}
	}
</style>
