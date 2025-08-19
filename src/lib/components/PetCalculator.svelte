<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	
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
	
	// Dosage calculation logic with appropriate coefficients for each animal type
	function calculateDosage() {
		if (!weight || parseFloat(weight) <= 0) return;
		
		const weightKg = parseFloat(weight);
		let baseDosage = 0;
		
		// Base dosage per kg based on animal type and condition
		switch (animalType) {
			case 'horse':
				switch (condition) {
					case 'wellbeing':
						baseDosage = 0.1;
						break;
					case 'anxiety':
						baseDosage = 0.15;
						break;
					case 'hard_anxiety':
						baseDosage = 0.25;
						break;
				}
				break;
			case 'dog':
				switch (condition) {
					case 'wellbeing':
						baseDosage = 0.5;
						break;
					case 'anxiety':
						baseDosage = 0.8;
						break;
					case 'hard_anxiety':
						baseDosage = 1.2;
						break;
				}
				break;
			case 'cat':
				switch (condition) {
					case 'wellbeing':
						baseDosage = 0.3;
						break;
					case 'anxiety':
						baseDosage = 0.5;
						break;
					case 'hard_anxiety':
						baseDosage = 0.8;
						break;
				}
				break;
			case 'small_animal':
				switch (condition) {
					case 'wellbeing':
						baseDosage = 0.2;
						break;
					case 'anxiety':
						baseDosage = 0.3;
						break;
					case 'hard_anxiety':
						baseDosage = 0.5;
						break;
				}
				break;
		}
		
		dosage = Math.round((weightKg * baseDosage) * 10) / 10;
		showResults = true;
		
		// Generate recommendation
		generateRecommendation();
	}
	
	function generateRecommendation() {
		const weightNum = parseFloat(weight);
		let frequency = '';
		let duration = '';
		
		if (animalType === 'horse') {
			if (weightNum < 300) {
				frequency = '1-2 times daily';
				duration = 'Start with 2-3 weeks';
			} else {
				frequency = '1 time daily';
				duration = 'Start with 3-4 weeks';
			}
		} else if (animalType === 'dog') {
			if (weightNum < 5) {
				frequency = '2-3 times daily';
				duration = 'Start with 1-2 weeks';
			} else if (weightNum < 20) {
				frequency = '2 times daily';
				duration = 'Start with 2-3 weeks';
			} else {
				frequency = '1-2 times daily';
				duration = 'Start with 3-4 weeks';
			}
		} else if (animalType === 'cat') {
			if (weightNum < 3) {
				frequency = '2 times daily';
				duration = 'Start with 1-2 weeks';
			} else {
				frequency = '1-2 times daily';
				duration = 'Start with 2-3 weeks';
			}
		} else { // small animal
			frequency = '1-2 times daily';
			duration = 'Start with 1-2 weeks';
		}
		
		recommendation = `Administer ${dosage}mg ${frequency}. ${duration} and monitor your animal's response. Consult with your veterinarian for long-term use.`;
	}
	
	function resetCalculator() {
		weight = '';
		condition = 'wellbeing';
		showResults = false;
		dosage = 0;
		recommendation = '';
	}
	
	// Get animal type display name
	function getAnimalTypeName(type: string): string {
		switch (type) {
			case 'horse': return 'Horse';
			case 'dog': return 'Dog';
			case 'cat': return 'Cat';
			case 'small_animal': return 'Small Animal';
			default: return 'Animal';
		}
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
			Calculate the optimal CBD dosage for your animal based on type, weight, and condition
		</p>
	</div>
	
	{#if !showResults}
		<!-- Calculator Form -->
		<div class="space-y-6">
			<!-- Animal Type Selection -->
			<div>
				<label class="block text-sm font-semibold text-gray-700 mb-3">
					Animal Type
				</label>
				<select
					bind:value={animalType}
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg appearance-none bg-white cursor-pointer"
				>
					<option value="horse">Horse</option>
					<option value="dog">Dog</option>
					<option value="cat">Cat</option>
					<option value="small_animal">Small Animal (Rabbit, Guinea Pig, etc.)</option>
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
					Weight (kg)
				</label>
				<input
					id="weight"
					type="number"
					bind:value={weight}
					placeholder="Enter weight in kg"
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg"
					step="0.1"
					min="0.1"
				/>
			</div>
			
			<!-- Condition Selection -->
			<div>
				<label class="block text-sm font-semibold text-gray-700 mb-3">
					Condition to be Treated
				</label>
				<select
					bind:value={condition}
					class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-main focus:border-main transition-all duration-200 text-lg appearance-none bg-white cursor-pointer"
				>
					<option value="wellbeing">General Wellbeing</option>
					<option value="anxiety">Anxiety & Stress</option>
					<option value="hard_anxiety">Hard Anxiety & Severe Stress</option>
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
				class="w-full bg-main text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-main-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
			>
				Calculate CBD Dosage
			</button>
		</div>
	{:else}
		<!-- Results Display -->
		<div class="text-center space-y-6">
			<!-- Dosage Result -->
			<div class="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8">
				<div class="text-4xl font-bold text-green-600 mb-3">
					{dosage} mg
				</div>
				<div class="text-green-700 font-semibold text-lg">
					Recommended Daily CBD Dosage
				</div>
				<div class="text-green-600 text-sm mt-2">
					For {getAnimalTypeName(animalType)} - {condition === 'wellbeing' ? 'General Wellbeing' : condition === 'anxiety' ? 'Anxiety & Stress' : 'Hard Anxiety & Severe Stress'}
				</div>
			</div>
			
			<!-- Recommendation -->
			<div class="text-left bg-gray-50 rounded-xl p-6 border border-gray-200">
				<h4 class="font-semibold text-gray-900 mb-3 text-lg">Usage Recommendation:</h4>
				<p class="text-gray-700 leading-relaxed">
					{recommendation}
				</p>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex space-x-4">
				<button
					on:click={resetCalculator}
					class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
				>
					Calculate Again
				</button>
				<button
					on:click={() => showResults = false}
					class="flex-1 bg-main text-white py-3 px-6 rounded-xl font-medium hover:bg-main-dark transition-all duration-200"
				>
					Modify Inputs
				</button>
			</div>
		</div>
	{/if}
</div>
