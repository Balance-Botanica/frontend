// Calculator Configuration - Easy to adjust dosage coefficients and recommendations
export interface DosageCoefficient {
	wellbeing: number;
	anxiety: number;
	hard_anxiety: number;
}

export interface WeightThreshold {
	min: number;
	max: number;
	frequency: string;
	duration: string;
}

export interface AnimalConfig {
	coefficients: DosageCoefficient;
	weightThresholds: WeightThreshold[];
}

export const CALCULATOR_CONFIG: Record<string, AnimalConfig> = {
	horse: {
		coefficients: {
			wellbeing: 0.08, // mg/kg - conservative for large animals based on research
			anxiety: 0.12, // mg/kg - moderate increase for anxiety
			hard_anxiety: 0.18 // mg/kg - higher for severe cases, within safe limits
		},
		weightThresholds: [
			{
				min: 0,
				max: 300,
				frequency: 'one_to_twice_daily',
				duration: 'start_2_3_weeks'
			},
			{
				min: 300,
				max: Infinity,
				frequency: 'once_daily',
				duration: 'start_3_4_weeks'
			}
		]
	},

	dog: {
		coefficients: {
			wellbeing: 0.4, // mg/kg - based on clinical studies (Verrico et al. 2020)
			anxiety: 0.6, // mg/kg - moderate increase for anxiety/stress
			hard_anxiety: 0.9 // mg/kg - higher for severe cases, within safety margins
		},
		weightThresholds: [
			{
				min: 0,
				max: 5,
				frequency: 'twice_daily',
				duration: 'start_1_2_weeks'
			},
			{
				min: 5,
				max: 20,
				frequency: 'one_to_twice_daily',
				duration: 'adjust_as_needed'
			},
			{
				min: 20,
				max: Infinity,
				frequency: 'once_daily',
				duration: 'start_3_4_weeks'
			}
		]
	},

	cat: {
		coefficients: {
			wellbeing: 0.25, // mg/kg - conservative for cats based on research
			anxiety: 0.4, // mg/kg - moderate increase for anxiety
			hard_anxiety: 0.6 // mg/kg - higher for severe cases
		},
		weightThresholds: [
			{
				min: 0,
				max: 3,
				frequency: 'twice_daily',
				duration: 'start_1_2_weeks'
			},
			{
				min: 3,
				max: Infinity,
				frequency: 'one_to_twice_daily',
				duration: 'start_2_3_weeks'
			}
		]
	},

	small_animal: {
		coefficients: {
			wellbeing: 0.15, // mg/kg - very conservative for small animals
			anxiety: 0.25, // mg/kg - moderate increase for anxiety
			hard_anxiety: 0.4 // mg/kg - higher for severe cases
		},
		weightThresholds: [
			{
				min: 0,
				max: 1,
				frequency: 'one_to_twice_daily',
				duration: 'start_1_week'
			},
			{
				min: 1,
				max: Infinity,
				frequency: 'one_to_twice_daily',
				duration: 'start_1_2_weeks'
			}
		]
	}
};

// Helper functions for easy access to config data
export function getDosageCoefficient(animalType: string, condition: string): number {
	const config = CALCULATOR_CONFIG[animalType];
	if (!config) return 0;

	switch (condition) {
		case 'wellbeing':
			return config.coefficients.wellbeing;
		case 'anxiety':
			return config.coefficients.anxiety;
		case 'hard_anxiety':
			return config.coefficients.hard_anxiety;
		default:
			return config.coefficients.wellbeing;
	}
}

export function getWeightRecommendation(
	animalType: string,
	weight: number
): { frequency: string; duration: string } {
	const config = CALCULATOR_CONFIG[animalType];
	if (!config) {
		return { frequency: 'once_daily', duration: 'start_2_3_weeks' };
	}

	for (const threshold of config.weightThresholds) {
		if (weight >= threshold.min && weight <= threshold.max) {
			return { frequency: threshold.frequency, duration: threshold.duration };
		}
	}

	// Fallback to first threshold if none match
	return {
		frequency: config.weightThresholds[0].frequency,
		duration: config.weightThresholds[0].duration
	};
}

// Safety and quality assurance constants based on research
export const SAFETY_LIMITS = {
	MAX_DOSAGE_MG: 100, // Maximum single dose in mg based on research
	MAX_DOSAGE_PER_KG: 2.0, // Maximum mg/kg based on safety studies
	MIN_WEIGHT_KG: 0.1, // Minimum weight for small animals
	MAX_WEIGHT_KG: 1000 // Maximum weight for large animals
};

// Validation functions
export function isValidAnimalType(animalType: string): boolean {
	return Object.keys(CALCULATOR_CONFIG).includes(animalType);
}

export function isValidCondition(condition: string): boolean {
	return ['wellbeing', 'anxiety', 'hard_anxiety'].includes(condition);
}

export function isValidWeight(weight: number): boolean {
	return weight >= SAFETY_LIMITS.MIN_WEIGHT_KG && weight <= SAFETY_LIMITS.MAX_WEIGHT_KG;
}

// Enhanced dosage validation based on research findings
export function validateDosage(
	animalType: string,
	weight: number,
	calculatedDosage: number
): {
	isValid: boolean;
	warningKey?: string;
	recommendationKey?: string;
	maxSafeDosage?: number;
} {
	const maxSafeDosage = Math.min(
		SAFETY_LIMITS.MAX_DOSAGE_MG,
		weight * SAFETY_LIMITS.MAX_DOSAGE_PER_KG
	);

	if (calculatedDosage > maxSafeDosage) {
		return {
			isValid: false,
			warningKey: 'calculator.validation.dosage_too_high',
			recommendationKey: 'calculator.validation.start_with_safe',
			maxSafeDosage: maxSafeDosage
		};
	}

	if (calculatedDosage < 0.1) {
		return {
			isValid: false,
			warningKey: 'calculator.validation.dosage_too_low',
			recommendationKey: 'calculator.validation.consult_vet'
		};
	}

	return { isValid: true };
}

// Get quality assurance tips based on research
export function getQualityAssuranceTips(animalType: string): string[] {
	const tips = [
		'Choose CBD products specifically formulated for animals',
		'Ensure products are third-party tested for purity and potency',
		'Verify THC content is below 0.3% (hemp-derived)',
		'Look for products with Certificate of Analysis (COA)',
		'Start with lower doses and gradually increase',
		"Monitor your animal's response and adjust accordingly",
		'Consult with your veterinarian before starting CBD treatment'
	];

	// Add animal-specific tips
	if (animalType === 'cat') {
		tips.push('Cats may be more sensitive to CBD - start with conservative doses');
	}
	if (animalType === 'horse') {
		tips.push('Large animals require careful titration and monitoring');
	}
	if (animalType === 'small_animal') {
		tips.push('Small animals need very precise dosing - use calibrated droppers');
	}

	return tips;
}
