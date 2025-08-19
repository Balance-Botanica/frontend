<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { getDosageCoefficient, getWeightRecommendation, validateDosage, getQualityAssuranceTips } from './calculator.config.js';
	
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
	let localDosage = 0;
	let localRecommendation = '';
	
	// Dosage calculation logic using config file with safety validation
	function calculateDosage() {
		if (!weight || parseFloat(weight) <= 0) return;
		
		const weightKg = parseFloat(weight);
		const baseDosage = getDosageCoefficient(animalType, condition);
		
		// Calculate and set dosage
		localDosage = Math.round((weightKg * baseDosage) * 10) / 10;
		
		// Validate dosage for safety
		const validation = validateDosage(animalType, weightKg, localDosage);
		if (!validation.isValid) {
			// Show warning but still display results
			console.warn(validation.warning);
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
			localRecommendation = (m as any)['calculator.results.administer_text']({
				dosage: localDosage,
				frequency: frequency,
				duration: duration
			});
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
	}
	
	// Get animal type display name from messages
	function getAnimalTypeName(type: string): string {
		return (m as any)[`calculator.animal_types.${type}`]();
	}
	
	// Get condition display name from messages
	function getConditionName(cond: string): string {
		return (m as any)[`calculator.conditions.${cond}`]();
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

<div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-md mx-auto">
	<!-- Header -->
	<div class="text-center mb-8">
		<div class="flex items-center justify-center mb-4">
			<div class="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center mr-4">
				{@html getAnimalIcon(animalType)}
			</div>
			<h3 class="text-2xl font-bold text-gray-900">
				Animal CBD Calculator
			</h3>
		</div>
		<p class="text-gray-600 text-sm leading-relaxed">
			{(m as any)['calculator.subtitle']()}
		</p>
	</div>
	
	{#if !showResults}
		<!-- Calculator Form -->
		<div class="space-y-6">
			<!-- Animal Type Selection -->
			<div>
				<label class="block text-sm font-semibold text-gray-700 mb-3">
					{(m as any)['calculator.form.animal_type']()}
				</label>
				<select
					bind:value={animalType}
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg appearance-none bg-white cursor-pointer"
				>
					<option value="horse">{(m as any)['calculator.animal_types.horse']()}</option>
					<option value="dog">{(m as any)['calculator.animal_types.dog']()}</option>
					<option value="cat">{(m as any)['calculator.animal_types.cat']()}</option>
					<option value="small_animal">{(m as any)['calculator.animal_types.small_animal']()}</option>
				</select>
				<!-- Custom dropdown arrow -->
				<div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
					<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</div>
			</div>
			
			<!-- Weight Input -->
			<div>
				<label for="weight" class="block text-sm font-semibold text-gray-700 mb-3">
					{(m as any)['calculator.form.weight']()}
				</label>
				<input
					id="weight"
					type="number"
					bind:value={weight}
					placeholder={(m as any)['calculator.form.weight_placeholder']()}
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg"
					step="0.1"
					min="0.1"
				/>
			</div>
			
			<!-- Condition Selection -->
			<div>
				<label class="block text-sm font-semibold text-gray-700 mb-3">
					{(m as any)['calculator.form.condition']()}
				</label>
				<select
					bind:value={condition}
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg appearance-none bg-white cursor-pointer"
				>
					<option value="wellbeing">{(m as any)['calculator.conditions.wellbeing']()}</option>
					<option value="anxiety">{(m as any)['calculator.conditions.anxiety']()}</option>
					<option value="hard_anxiety">{(m as any)['calculator.conditions.hard_anxiety']()}</option>
				</select>
				<!-- Custom dropdown arrow -->
				<div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
					<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
					</svg>
				</div>
			</div>
			
			<!-- Calculate Button -->
			<button
				on:click={calculateDosage}
				disabled={!weight || parseFloat(weight) <= 0}
				class="w-full bg-main text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:bg-main-dark hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 cursor-pointer"
			>
				{(m as any)['calculator.form.calculate_button']()}
			</button>
		</div>
	{:else}
		<!-- Results Display -->
		<div class="text-center space-y-6">
			<!-- Dosage Result -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8">
				<div class="text-4xl font-bold text-green-600 mb-3">
					{localDosage} mg
				</div>
				<div class="text-green-700 font-semibold text-lg">
					{(m as any)['calculator.results.title']()}
				</div>
				<div class="text-green-600 text-sm mt-2">
					{(m as any)['calculator.results.for_animal']({
						animalType: getAnimalTypeName(animalType),
						condition: getConditionName(condition)
					})}
				</div>
			</div>
			
			<!-- Recommendation -->
			<div class="text-left bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h4 class="font-semibold text-gray-900 mb-3 text-lg">{(m as any)['calculator.results.usage_recommendation']()}</h4>
				<p class="text-gray-700 leading-relaxed">
					{localRecommendation}
				</p>
			</div>
			
			<!-- Quality Assurance Tips -->
			<div class="text-left bg-blue-50 rounded-xl p-6 border border-blue-200">
				<h4 class="font-semibold text-blue-900 mb-3 text-lg">{(m as any)['calculator.quality_assurance.title']}</h4>
				<ul class="text-blue-800 text-sm space-y-2">
					{#each getQualityAssuranceTips(animalType) as tip}
						<li class="flex items-start">
							<span class="text-blue-600 mr-2">•</span>
							<span>{tip}</span>
						</li>
					{/each}
				</ul>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex space-x-4">
				<button
					on:click={resetCalculator}
					class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
				>
					{(m as any)['calculator.actions.calculate_again']()}
				</button>
				<button
					on:click={() => showResults = false}
					class="flex-1 bg-main text-white py-3 px-6 rounded-xl font-medium hover:bg-main-dark transition-all duration-200"
				>
					{(m as any)['calculator.actions.modify_inputs']()}
				</button>
			</div>
		</div>
	{/if}
</div>
