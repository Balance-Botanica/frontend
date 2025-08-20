<script lang="ts">
	import { t } from '../i18n';
	import PetCalculator from './PetCalculator.svelte';
</script>

<section id="calculator" class="w-full py-20 md:py-28 relative overflow-hidden">
	<!-- Background Image with Green Overlay -->
	<div class="absolute inset-0">
		<img 
			src="/images/calculator-bg-1.jpg" 
			alt="Calculator background" 
			class="w-full h-full object-cover"
		/>
		<!-- Green overlay for semi-transparent effect -->
		<div class="absolute inset-0 bg-main/70"></div>
	</div>
	
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<!-- Section Header -->
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
				{t('calculator.title')}
			</h2>
			<p class="text-lg text-green-100 max-w-3xl mx-auto">
				{t('calculator.subtitle')}
			</p>
		</div>
		
		<!-- Description and Benefits -->
		<div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
			<div class="text-white">
				<h3 class="text-2xl font-bold mb-6">
					{t('calculator.benefits.title')}
				</h3>
				<div class="space-y-4">
					<div class="flex items-start">
						<div class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.precise')}
						</p>
					</div>
					<div class="flex items-start">
						<div class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.safe')}
						</p>
					</div>
					<div class="flex items-start">
						<div class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.personalized')}
						</p>
					</div>
				</div>
				
				<div class="mt-8 p-6 bg-green-700 rounded-xl border border-green-500">
					<h4 class="text-lg font-semibold text-white mb-3">
						{t('calculator.disclaimer.title')}
					</h4>
					<p class="text-green-100 text-sm leading-relaxed">
						{t('calculator.disclaimer.text')}
					</p>
				</div>
			</div>
			
			<!-- Calculator Widget -->
			<div class="flex justify-center">
				<PetCalculator />
			</div>
		</div>
		
		<!-- Additional Information -->
		<div class="text-center">
			<div class="inline-flex items-center space-x-2 text-green-100">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
				</svg>
				<span class="text-sm">
					{t('calculator.additional_info')}
				</span>
			</div>
		</div>
	</section>
