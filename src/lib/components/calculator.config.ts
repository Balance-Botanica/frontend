// Calculator Configuration - Evidence-based dosing for curcumin (turmeric) pet treats
//
// RESEARCH BASIS (dogs):
// - Colitti et al. 2012 (Vet Immunol Immunopathol, PMID 22591841): curcumin phytosome (CurcuVET) 4 mg/kg BID, 20 days -> leukocyte gene-expression changes comparable to NSAID.
// - Innes et al. 2003 (Vet Rec, PMID 12723628): P54FP turmeric extract, RCT - subjective improvement, no force-plate change.
// - Comblain et al. 2017 (BMC Vet Res, PMID 29262825): curcuminoids + collagen + green tea in diet - modest pain reduction.
// - Caterino et al. 2021 (PLoS One, PMID 34048452): CurcuVET + boswellia as a multimodal osteoarthritis adjunct.
// Practical 95% curcumin + piperine range: ~15-20 mg/kg/day (upper band). Start at half the dose for 7-10 days.
//
export interface DosageCoefficient {
	maintenance: number; // mg/kg/day - daily joint + antioxidant support
	active: number; // mg/kg/day - active joint support (upper evidence band)
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
	dog: {
		coefficients: {
			maintenance: 12, // mg/kg/day - conservative daily support
			active: 18 // mg/kg/day - upper evidence band for active joint support
		},
		weightThresholds: [
			{
				min: 0,
				max: 10,
				frequency: 'once_daily',
				duration: 'four_to_eight_weeks'
			},
			{
				min: 10,
				max: 25,
				frequency: 'twice_daily',
				duration: 'four_to_eight_weeks'
			},
			{
				min: 25,
				max: Infinity,
				frequency: 'twice_daily',
				duration: 'four_to_eight_weeks'
			}
		]
	},

	cat: {
		coefficients: {
			maintenance: 10, // mg/kg/day - cats are more sensitive
			active: 15 // mg/kg/day
		},
		weightThresholds: [
			{
				min: 0,
				max: 5,
				frequency: 'once_daily',
				duration: 'four_to_eight_weeks'
			},
			{
				min: 5,
				max: Infinity,
				frequency: 'once_daily',
				duration: 'four_to_eight_weeks'
			}
		]
	}
};

// Helper functions for easy access to config data
export function getDosageCoefficient(animalType: string, condition: string): number {
	const config = CALCULATOR_CONFIG[animalType];
	if (!config) return 0;

	switch (condition) {
		case 'maintenance':
			return config.coefficients.maintenance;
		case 'active':
			return config.coefficients.active;
		default:
			return config.coefficients.maintenance;
	}
}

export function getWeightRecommendation(
	animalType: string,
	weight: number
): { frequency: string; duration: string } {
	const config = CALCULATOR_CONFIG[animalType];
	if (!config) {
		return { frequency: 'once_daily', duration: 'four_to_eight_weeks' };
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

// Golden paste: ~60mg of 95% curcumin extract per teaspoon (~5g, paste is weighed) — printed on every jar.
// Jars: TRIAL 30g (~6 tsp) · WEEK 100g (~20 tsp) · HALF 250g (~50 tsp) · MONTH 500g (~100 tsp)
export const MG_PER_TSP = 60;

export const JAR_TSP = {
	trial: 6, // 30 g
	week: 20, // 100 g
	half: 50, // 250 g
	month: 100 // 500 g
} as const;

export type JarKey = keyof typeof JAR_TSP;

export function getTspPerDay(dailyMg: number): number {
	if (dailyMg <= 0) return 0;
	return Math.max(0.25, Math.round((dailyMg / MG_PER_TSP) * 4) / 4);
}

// Baseline value anchor: TRIAL jar (129 UAH / 6 tsp). Savings badges ("-42%")
// are computed against it. If TRIAL price changes, update this number.
export const BASELINE_PER_TSP = 21.5;

export function savingsVsTrial(perTsp: number): number | null {
	if (!perTsp || perTsp <= 0) return null;
	const pct = Math.round((1 - perTsp / BASELINE_PER_TSP) * 100);
	return pct > 0 ? pct : null;
}

export function getJarDays(tspPerDay: number): Record<JarKey, number> {
	const perDay = Math.max(tspPerDay, 0.25);
	return {
		trial: Math.floor((JAR_TSP.trial / perDay) * 10) / 10,
		week: Math.floor((JAR_TSP.week / perDay) * 10) / 10,
		half: Math.floor((JAR_TSP.half / perDay) * 10) / 10,
		month: Math.floor((JAR_TSP.month / perDay) * 10) / 10
	};
}

// Legacy cubes (kept for reference — shop is paste jars now)
export const MG_PER_TREAT = {
	S: 25, // up to 10 kg
	M: 60, // 10-25 kg
	L: 120 // 25+ kg
} as const;

export function getPawSize(weightKg: number): 'S' | 'M' | 'L' {
	if (weightKg <= 10) return 'S';
	if (weightKg <= 25) return 'M';
	return 'L';
}

export function getTreatsPerDay(dailyMg: number, weightKg: number): { size: 'S' | 'M' | 'L'; count: number } {
	const size = getPawSize(weightKg);
	const perTreat = MG_PER_TREAT[size];
	return { size, count: Math.max(1, Math.round((dailyMg / perTreat) * 2) / 2) };
}

// Safety and quality assurance constants based on peer-reviewed research
export const SAFETY_LIMITS = {
	MAX_DOSAGE_MG: 750, // Practical upper daily dose of 95% curcumin (large dogs)
	MAX_DOSAGE_PER_KG: 20, // Upper evidence band mg/kg/day for 95% curcumin + piperine
	MIN_WEIGHT_KG: 0.5, // Minimum weight (kitten / small dog)
	MAX_WEIGHT_KG: 100 // Maximum weight (giant breeds)
};

// Validation functions
export function isValidAnimalType(animalType: string): boolean {
	return Object.keys(CALCULATOR_CONFIG).includes(animalType);
}

export function isValidCondition(condition: string): boolean {
	return ['maintenance', 'active'].includes(condition);
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

// Get quality assurance tips based on peer-reviewed research
export function getQualityAssuranceTips(animalType: string): string[] {
	const tips = [
		'Choose a standardized 95% curcumin extract, not raw kitchen turmeric powder',
		'Always give curcumin with fat (coconut oil) plus a pinch of piperine for absorption',
		'Ask for a Certificate of Analysis (COA) with heavy-metal results (Pb, Cd, As, Hg)',
		'Start with half the dose for 7-10 days and watch the stool',
		"Yellow-ish stool is normal - it's the turmeric, not a problem",
		'Curcumin supports mobility and comfort - it is not a replacement for prescribed NSAIDs',
		'Consult your veterinarian before use, especially on medication or before surgery',
		'Do not give to pregnant animals or puppies/kittens under 12 weeks without a vet'
	];

	// Add animal-specific research-based tips
	if (animalType === 'cat') {
		tips.push('Cats (incl. Scottish Fold) need lower doses - start with the minimum and monitor');
		tips.push('Cats are more sensitive to piperine - keep the pepper amount minimal');
	}
	if (animalType === 'dog') {
		tips.push('For dogs over 25 kg, split the daily dose between two meals');
		tips.push('Evidence shows curcumin is a modest anti-inflammatory adjuvant, strongest for comfort/mobility');
	}

	return tips;
}
