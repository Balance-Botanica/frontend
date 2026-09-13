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

// Golden paste dosing in jar fractions — no spoons anywhere in the UI.
// Paste carries ~60mg of 95% curcumin extract per ~5g (≈12mg per gram, density ≈ 1).
// A daily portion is written as 1/N of a jar, small jar first: e.g. 1/6 of 30g … 1/100 of 500g.
export const MG_PER_TSP = 60; // kept for mg math only (1 tsp ≈ 5g), never shown
export const MG_PER_G = 12;

export const JAR_G = [30, 100, 250, 500] as const;
export type JarKey = 'g30' | 'g100' | 'g250' | 'g500';

const JAR_LABEL: Record<JarKey, string> = { g30: '30 г', g100: '100 г', g250: '250 г', g500: '500 г' };
export function jarLabel(key: JarKey, locale: string = 'uk-ua'): string {
	if (locale === 'en') return JAR_LABEL[key].replace('г', 'g');
	return JAR_LABEL[key];
}

// Kitchen-friendly denominators for 1/N portions (no 1/53 in the UI)
const FRIENDLY_DENOMS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500];

export function portionDenom(dailyMg: number, jarG: number): number {
	if (dailyMg <= 0) return FRIENDLY_DENOMS[FRIENDLY_DENOMS.length - 1];
	const raw = (jarG * MG_PER_G) / dailyMg;
	let best = FRIENDLY_DENOMS[0];
	for (const d of FRIENDLY_DENOMS) {
		if (Math.abs(d - raw) <= Math.abs(best - raw)) best = d;
	}
	return best;
}

export interface JarPortion {
	key: JarKey;
	grams: number;
	denom: number; // daily portion = 1/denom of this jar (1 = the whole jar)
	days: number; // how many days this jar lasts at the daily dose
}

export function getPortionsPerDay(dailyMg: number): JarPortion[] {
	return (JAR_G as readonly number[]).map((g, i) => {
		const key = (['g30', 'g100', 'g250', 'g500'] as JarKey[])[i];
		const denom = portionDenom(dailyMg, g);
		return { key, grams: g, denom, days: Math.floor(denom * 10) / 10 };
	});
}

// Baseline value anchor: 30g jar (129 UAH / 6 tsp ≈ 21.5 UAH per 5g).
// Savings badges ("-42%") are computed against it. If the 30g price changes, update this.
export const BASELINE_PER_TSP = 21.5;

export function savingsVsTrial(perTsp: number): number | null {
	if (!perTsp || perTsp <= 0) return null;
	const pct = Math.round((1 - perTsp / BASELINE_PER_TSP) * 100);
	return pct > 0 ? pct : null;
}

export function getJarDays(tspPerDay: number): Record<JarKey, number> {
	const perDay = Math.max(tspPerDay, 0.25);
	// 1 tsp ≈ 5g; jar grams / (tsp per day * 5)
	return {
		g30: Math.floor((30 / (perDay * 5)) * 10) / 10,
		g100: Math.floor((100 / (perDay * 5)) * 10) / 10,
		g250: Math.floor((250 / (perDay * 5)) * 10) / 10,
		g500: Math.floor((500 / (perDay * 5)) * 10) / 10
	};
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
