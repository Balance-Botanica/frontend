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
			wellbeing: 0.1, // mg/kg for general wellbeing
			anxiety: 0.15, // mg/kg for anxiety & stress
			hard_anxiety: 0.25 // mg/kg for hard anxiety & severe stress
		},
		weightThresholds: [
			{
				min: 0,
				max: 300,
				frequency: '1-2 times daily',
				duration: 'Start with 2-3 weeks'
			},
			{
				min: 300,
				max: Infinity,
				frequency: '1 time daily',
				duration: 'Start with 3-4 weeks'
			}
		]
	},

	dog: {
		coefficients: {
			wellbeing: 0.5, // mg/kg for general wellbeing
			anxiety: 0.8, // mg/kg for anxiety & stress
			hard_anxiety: 1.2 // mg/kg for hard anxiety & severe stress
		},
		weightThresholds: [
			{
				min: 0,
				max: 5,
				frequency: '2-3 times daily',
				duration: 'Start with 1-2 weeks'
			},
			{
				min: 5,
				max: 20,
				frequency: '2 times daily',
				duration: 'Start with 2-3 weeks'
			},
			{
				min: 20,
				max: Infinity,
				frequency: '1-2 times daily',
				duration: 'Start with 3-4 weeks'
			}
		]
	},

	cat: {
		coefficients: {
			wellbeing: 0.3, // mg/kg for general wellbeing
			anxiety: 0.5, // mg/kg for anxiety & stress
			hard_anxiety: 0.8 // mg/kg for hard anxiety & severe stress
		},
		weightThresholds: [
			{
				min: 0,
				max: 3,
				frequency: '2 times daily',
				duration: 'Start with 1-2 weeks'
			},
			{
				min: 3,
				max: Infinity,
				frequency: '1-2 times daily',
				duration: 'Start with 2-3 weeks'
			}
		]
	},

	small_animal: {
		coefficients: {
			wellbeing: 0.2, // mg/kg for general wellbeing
			anxiety: 0.3, // mg/kg for anxiety & stress
			hard_anxiety: 0.5 // mg/kg for hard anxiety & severe stress
		},
		weightThresholds: [
			{
				min: 0,
				max: Infinity,
				frequency: '1-2 times daily',
				duration: 'Start with 1-2 weeks'
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
		return { frequency: '1 time daily', duration: 'Start with 2-3 weeks' };
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

// Validation functions
export function isValidAnimalType(animalType: string): boolean {
	return Object.keys(CALCULATOR_CONFIG).includes(animalType);
}

export function isValidCondition(condition: string): boolean {
	return ['wellbeing', 'anxiety', 'hard_anxiety'].includes(condition);
}

export function isValidWeight(weight: number): boolean {
	return weight > 0 && weight < 999; // Reasonable range for animal weights
}
