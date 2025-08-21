<script lang="ts">
	import { t } from '../i18n';
	import {
		getDosageCoefficient,
		getWeightRecommendation,
		validateDosage
	} from './calculator.config.js';

	let {
		animalType = 'dog',
		weight = '',
		condition = 'wellbeing',
		showResults = false,
		dosage = 0,
		recommendation = ''
	} = $props<{
		animalType?: 'horse' | 'dog' | 'cat' | 'small_animal';
		weight?: string;
		condition?: 'wellbeing' | 'anxiety' | 'hard_anxiety';
		showResults?: boolean;
		dosage?: number;
		recommendation?: string;
	}>();

	// Initialize local variables to ensure they're reactive
	let localDosage = $state(0);
	let localRecommendation = $state('');
	let validation = $state<any>(null);

	// Dosage calculation logic using config file with safety validation
	function calculateDosage() {
		if (!weight || parseFloat(weight) <= 0) return;

		const weightKg = parseFloat(weight);
		const baseDosage = getDosageCoefficient(animalType, condition);

		// Calculate and set dosage
		localDosage = Math.round(weightKg * baseDosage * 10) / 10;

		// Validate dosage for safety
		validation = validateDosage(animalType, weightKg, localDosage);
		if (!validation.isValid) {
			// Show warning but still display results
			const warningMessage = validation.warningKey ? t(validation.warningKey) : '';
			console.warn(warningMessage);
		}

		// Generate recommendation after dosage is set
		generateRecommendation();

		// Show results after everything is calculated
		showResults = true;
	}

	function generateRecommendation() {
		const weightNum = parseFloat(weight);
		const { frequency, duration } = getWeightRecommendation(animalType, weightNum);

		// Ensure dosage is available before generating recommendation
		if (localDosage > 0) {
			try {
				// Use the working i18n system for frequency and duration
				const localizedFrequency = t(`calculator.frequency.${frequency}`);
				const localizedDuration = t(`calculator.duration.${duration}`);

				localRecommendation = t('calculator.results.administer_text', {
					dosage: localDosage,
					frequency: localizedFrequency,
					duration: localizedDuration
				});
			} catch (error) {
				console.error('Error generating recommendation:', error);
				// Fallback recommendation
				localRecommendation = t('calculator.results.administer_text', {
					dosage: localDosage,
					frequency: frequency,
					duration: duration
				});
			}
		} else {
			localRecommendation = '';
		}
	}

	function resetCalculator() {
		weight = '';
		condition = 'wellbeing';
		showResults = false;
		localDosage = 0;
		localRecommendation = '';
		validation = null;
	}

	// Get animal type display name from messages
	function getAnimalTypeName(type: string): string {
		return t(`calculator.animal_types.${type}`);
	}

	// Get condition display name from messages
	function getConditionName(cond: string): string {
		return t(`calculator.conditions.${cond}`);
	}

	// Get proper unit based on locale
	function getDosageUnit(): string {
		// Check if we're in Ukrainian locale by looking at the messages
		const title = t('calculator.title');
		const isUkrainian = title && title.includes('КБД');
		return isUkrainian ? 'мг' : 'mg';
	}

	// Get animal icon
	function getAnimalIcon(type: string): string {
		switch (type) {
			case 'horse':
				return `<svg class="w-6 h-6 text-main" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>`;
			case 'dog':
				return `<svg class="w-6 h-6 text-main" fill="currentColor" viewBox="0 0 24 24">
					<path d="M18 4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2 3c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2zm-8 0c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2zm-2-3c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
				</svg>`;
			case 'cat':
				return `<svg class="w-6 h-6 text-main" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>`;
			case 'small_animal':
				return `<svg class="w-6 h-6 text-main" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>`;
			default:
				return `<svg class="w-6 h-6 text-main" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
				</svg>`;
		}
	}
</script>

<div class="mx-auto rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
	<!-- Header -->
	<div class="mb-8 text-center">
		<div class="mb-4 text-center">
			<h3 class="text-2xl font-bold text-gray-900">
				{t('calculator.title')}
			</h3>
		</div>
		<p class="text-sm leading-relaxed text-gray-600">
			{t('calculator.subtitle')}
		</p>
	</div>

	{#if !showResults}
		<!-- Calculator Form -->
		<div class="space-y-6">
			<!-- Animal Type Selection -->
			<div>
				<label for="animalType" class="mb-3 block text-sm font-semibold text-gray-700">
					{t('calculator.form.animal_type')}
				</label>
				<select
					id="animalType"
					bind:value={animalType}
					class="w-full cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-lg transition-all duration-200 focus:border-main focus:ring-2 focus:ring-main"
				>
					<option value="horse">{t('calculator.animal_types.horse')}</option>
					<option value="dog">{t('calculator.animal_types.dog')}</option>
					<option value="cat">{t('calculator.animal_types.cat')}</option>
					<option value="small_animal">{t('calculator.animal_types.small_animal')}</option>
				</select>
				<!-- Custom dropdown arrow -->
				<div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>

			<!-- Weight Input -->
			<div>
				<label for="weight" class="mb-3 block text-sm font-semibold text-gray-700">
					{t('calculator.form.weight')}
				</label>
				<input
					id="weight"
					type="number"
					bind:value={weight}
					placeholder={t('calculator.form.weight_placeholder')}
					class="w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-lg transition-all duration-200 focus:border-main focus:ring-2 focus:ring-main"
					step="0.1"
					min="0.1"
				/>
			</div>

			<!-- Condition Selection -->
			<div>
				<label for="condition" class="mb-3 block text-sm font-semibold text-gray-700">
					{t('calculator.form.condition')}
				</label>
				<select
					id="condition"
					bind:value={condition}
					class="w-full cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-white px-4 py-4 text-lg transition-all duration-200 focus:border-main focus:ring-2 focus:ring-main"
				>
					<option value="wellbeing">{t('calculator.conditions.wellbeing')}</option>
					<option value="anxiety">{t('calculator.conditions.anxiety')}</option>
					<option value="hard_anxiety">{t('calculator.conditions.hard_anxiety')}</option>
				</select>
				<!-- Custom dropdown arrow -->
				<div class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>

			<!-- Calculate Button -->
			<button
				onclick={calculateDosage}
				disabled={!weight || parseFloat(weight) <= 0}
				class="hover:bg-main-dark w-full cursor-pointer rounded-xl bg-main px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{t('calculator.form.calculate_button')}
			</button>
		</div>
	{:else}
		<!-- Results Display -->
		<div class="space-y-6 text-center">
			<!-- Dosage Result -->
			<div
				class="rounded-2xl border-2 border-main/30 bg-gradient-to-br from-main/10 to-main/20 p-8"
			>
				<div class="mb-3 text-4xl font-bold text-main">
					{localDosage}
					{getDosageUnit()}
				</div>
				<div class="text-lg font-semibold text-main">
					{t('calculator.results.title')}
				</div>
				<div class="mt-2 text-sm text-main/80">
					{t('calculator.results.for_animal', {
						animalType: getAnimalTypeName(animalType),
						condition: getConditionName(condition)
					})}
				</div>
			</div>

			<!-- Recommendation -->
			<div class="rounded-xl border border-gray-200 bg-gray-50 p-6 text-left">
				<h4 class="mb-3 text-lg font-semibold text-gray-900">
					{t('calculator.results.usage_recommendation')}
				</h4>
				<p class="leading-relaxed text-gray-700">
					{localRecommendation}
				</p>
			</div>

			<!-- Validation Warning (if any) -->
			{#if validation && !validation.isValid}
				<div class="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-left">
					<h4 class="mb-3 text-lg font-semibold text-yellow-900">⚠️ {t(validation.warningKey)}</h4>
					<p class="leading-relaxed text-yellow-800">
						{validation.recommendationKey ? t(validation.recommendationKey) : ''}
					</p>
				</div>
			{/if}

			<!-- Quality Assurance Tips - Only show if tips are available -->
			{#if t('calculator.quality_assurance.tips.general') && t('calculator.quality_assurance.tips.general').length > 0}
				<div class="rounded-xl border border-blue-200 bg-blue-50 p-6 text-left">
					<h4 class="mb-3 text-lg font-semibold text-blue-900">
						{t('calculator.quality_assurance.title')}
					</h4>
					<ul class="space-y-2 text-sm text-blue-800">
						{#each t('calculator.quality_assurance.tips.general') as tip, _index}
							<li class="flex items-start">
								<span class="mr-2 text-blue-600">•</span>
								<span>{tip}</span>
							</li>
						{/each}
						{#if animalType === 'cat' && t('calculator.quality_assurance.tips.cat')}
							<li class="flex items-start">
								<span class="mr-2 text-blue-600">•</span>
								<span>{t('calculator.quality_assurance.tips.cat')}</span>
							</li>
						{:else if animalType === 'horse' && t('calculator.quality_assurance.tips.horse')}
							<li class="flex items-start">
								<span class="mr-2 text-blue-600">•</span>
								<span>{t('calculator.quality_assurance.tips.horse')}</span>
							</li>
						{:else if animalType === 'small_animal' && t('calculator.quality_assurance.tips.small_animal')}
							<li class="flex items-start">
								<span class="mr-2 text-blue-600">•</span>
								<span>{t('calculator.quality_assurance.tips.small_animal')}</span>
							</li>
						{/if}
					</ul>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="flex space-x-4">
				<button
					onclick={resetCalculator}
					class="flex-1 rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-300"
				>
					{t('calculator.actions.calculate_again')}
				</button>
				<button
					onclick={() => (showResults = false)}
					class="hover:bg-main-dark flex-1 rounded-xl bg-main px-6 py-3 font-medium text-white transition-all duration-200"
				>
					{t('calculator.actions.modify_inputs')}
				</button>
			</div>
		</div>
	{/if}
</div>
