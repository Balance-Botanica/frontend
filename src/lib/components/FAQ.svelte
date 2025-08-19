<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { m } from '$lib/paraglide/messages.js';
	
	const dispatch = createEventDispatcher();
	
	// FAQ data with translation keys - first one expanded by default
	let faqItems = [
		{
			id: 1,
			questionKey: 'faq.benefits.question',
			answerKey: 'faq.benefits.answer',
			isExpanded: true // First one expanded by default
		},
		{
			id: 2,
			questionKey: 'faq.choosing.question',
			answerKey: 'faq.choosing.answer',
			isExpanded: false
		},
		{
			id: 3,
			questionKey: 'faq.testing.question',
			answerKey: 'faq.testing.answer',
			isExpanded: false
		},
		{
			id: 4,
			questionKey: 'faq.spectrum.question',
			answerKey: 'faq.spectrum.answer',
			isExpanded: false
		},
		{
			id: 5,
			questionKey: 'faq.effects.question',
			answerKey: 'faq.effects.answer',
			isExpanded: false
		}
	];
	
	function toggleFAQ(id: number) {
		faqItems = faqItems.map(item => ({
			...item,
			isExpanded: item.id === id ? !item.isExpanded : false
		}));
		
		// Dispatch event for analytics or other purposes
		const toggledItem = faqItems.find(item => item.id === id);
		dispatch('faqToggle', { id, isExpanded: toggledItem?.isExpanded });
	}
</script>

<section aria-labelledby="faq-heading" class="w-full py-20 md:py-28 bg-white relative overflow-hidden">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<h2 id="faq-heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				{(m as any)['faq.title']()}
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				{(m as any)['faq.subtitle']()}
			</p>
		</div>
		
		<!-- FAQ Items -->
		<div class="space-y-4">
			{#each faqItems as item (item.id)}
				<div class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
					<div
						class="w-full px-6 py-5 text-left flex items-center justify-between cursor-pointer"
						on:click={() => toggleFAQ(item.id)}
						aria-expanded={item.isExpanded}
						aria-controls={`faq-answer-${item.id}`}
					>
						<h3 class="text-lg font-semibold text-gray-900 pr-4">
							{(m as any)[item.questionKey]()}
						</h3>
						<div class="flex-shrink-0">
							<svg 
								class="w-6 h-6 text-main transition-transform duration-200 {item.isExpanded ? 'rotate-180' : ''}" 
								fill="none" 
								viewBox="0 0 24 24" 
								stroke="currentColor"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
					
					<!-- Animated content with smooth growing animation -->
					<div 
						class="overflow-hidden transition-all duration-300 ease-out"
						style="max-height: {item.isExpanded ? '500px' : '0px'}; opacity: {item.isExpanded ? '1' : '0'};"
					>
						<div 
							id="faq-answer-{item.id}"
							class="px-6 pb-5"
							role="region"
							aria-labelledby="faq-question-{item.id}"
						>
							<p class="text-gray-600 leading-relaxed">
								{(m as any)[item.answerKey]()}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
		
		<!-- Call to Action -->
		<div class="text-center mt-12">
			<p class="text-gray-600 mb-4">
				{(m as any)['faq.cta.text']()}
			</p>
			<a 
				href="/contacts" 
				class="inline-flex items-center px-6 py-3 bg-main text-white font-medium rounded-lg hover:bg-main-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-main"
			>
				{(m as any)['faq.cta.button']()}
				<svg class="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</div>
</section>
