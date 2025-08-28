<script lang="ts">
	import { t } from '../i18n';
	import PetCalculator from './PetCalculator.svelte';
</script>

<div id="calculator" class="relative w-full overflow-hidden py-20 md:py-28 bg-gray-50">
	<!-- Background Image with Green Overlay -->
	<div class="absolute inset-0">
		<img
			src="/images/calculator-bg-1.jpg"
			alt="Calculator background"
			class="h-full w-full object-cover"
		/>
		<!-- Green overlay for semi-transparent effect -->
		<div class="absolute inset-0 bg-main/70"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold text-white md:text-4xl">
				{t('calculator.title')}
			</h2>
			<p class="mx-auto max-w-3xl text-lg text-green-100">
				{t('calculator.subtitle')}
			</p>
		</div>

		<!-- Description and Benefits -->
		<div class="mb-16 grid items-center gap-12 lg:grid-cols-2">
			<div class="text-white">
				<h3 class="mb-6 text-2xl font-bold">
					{t('calculator.benefits.title')}
				</h3>
				<div class="space-y-4">
					<div class="flex items-start">
						<div
							class="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500"
						>
							<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.precise')}
						</p>
					</div>
					<div class="flex items-start">
						<div
							class="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500"
						>
							<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.safe')}
						</p>
					</div>
					<div class="flex items-start">
						<div
							class="mt-0.5 mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500"
						>
							<svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<p class="text-green-100">
							{t('calculator.benefits.personalized')}
						</p>
					</div>
				</div>

				<div class="mt-8 rounded-xl border border-green-500 bg-green-700 p-6">
					<h4 class="mb-3 text-lg font-semibold text-white">
						{t('calculator.disclaimer.title')}
					</h4>
					<p class="text-sm leading-relaxed text-green-100">
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
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-sm">
					{t('calculator.additional_info')}
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	@media (max-width: 1100px) {
		div .relative.z-10.mx-auto.max-w-7xl {
			padding-left: 3rem !important;
			padding-right: 3rem !important;
		}
	}
	
	@media (max-width: 768px) {
		div .relative.z-10.mx-auto.max-w-7xl {
			padding-left: 3rem !important;
			padding-right: 3rem !important;
		}
	}
	
	@media (max-width: 640px) {
		div .relative.z-10.mx-auto.max-w-7xl {
			padding-left: 3rem !important;
			padding-right: 3rem !important;
		}
	}
	
	@media (max-width: 480px) {
		div .relative.z-10.mx-auto.max-w-7xl {
			padding-left: 3rem !important;
			padding-right: 3rem !important;
		}
	}
	
	@media (max-width: 400px) {
		div .relative.z-10.mx-auto.max-w-7xl {
			padding-left: 3rem !important;
			padding-right: 3rem !important;
		}
	}
</style>