<script lang="ts">
	import { t } from '../i18n';
	import {
		getDosageCoefficient,
		getWeightRecommendation,
		validateDosage,
		getTspPerDay,
		getJarDays,
		MG_PER_TSP,
		type JarKey
	} from './calculator.config.js';

	let {
		animalType = 'dog',
		weight = '',
		condition = 'maintenance',
		showResults = false,
		dosage = 0,
		recommendation = ''
	} = $props<{
		animalType?: 'dog' | 'cat';
		weight?: string;
		condition?: 'maintenance' | 'active';
		showResults?: boolean;
		dosage?: number;
		recommendation?: string;
	}>();

	let localDosage = $state(0);
	let localRecommendation = $state('');
	let validation = $state<any>(null);
	let tspPerDay = $state(0);
	let jarDays = $state<Record<JarKey, number> | null>(null);

	let weightNum = $derived(parseFloat(weight) || 0);
	let previewTsp = $derived(weightNum > 0 ? getTspPerDay(weightNum * (condition === 'active' ? 18 : 12)) : 0);
	let canCalculate = $derived(weightNum > 0 && weightNum <= 100);

	function calculateDosage() {
		if (!canCalculate) return;
		const weightKg = weightNum;
		const baseDosage = getDosageCoefficient(animalType, condition);
		localDosage = Math.round(weightKg * baseDosage * 10) / 10;
		tspPerDay = getTspPerDay(localDosage);
		jarDays = getJarDays(tspPerDay);
		validation = validateDosage(animalType, weightKg, localDosage);
		generateRecommendation();
		showResults = true;
	}

	function generateRecommendation() {
		const { frequency, duration } = getWeightRecommendation(animalType, weightNum);
		if (localDosage > 0) {
			try {
				localRecommendation = t('calculator.results.administer_text', {
					dosage: localDosage,
					frequency: t(`calculator.frequency.${frequency}`),
					duration: t(`calculator.duration.${duration}`)
				});
			} catch {
				localRecommendation = `${localDosage} mg, ${frequency}, ${duration}`;
			}
		}
	}

	function resetCalculator() {
		weight = '';
		condition = 'maintenance';
		showResults = false;
		localDosage = 0;
		localRecommendation = '';
		validation = null;
		tspPerDay = 0;
		jarDays = null;
	}

	function getDosageUnit(): string {
		return /[а-яіїєґ]/i.test(t('calculator.title')) ? 'мг' : 'mg';
	}

	const QUICK_WEIGHTS = [5, 10, 20, 30];
</script>

<div
	class="mx-auto w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-[0_24px_70px_-24px_rgba(63,111,104,0.4)] ring-1 ring-black/5 sm:p-8"
>
	<!-- Header -->
	<div class="mb-6 flex items-center gap-4">
		<div
			class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-main to-[#b25f0e] text-3xl shadow-lg"
		>
			🐾
		</div>
		<div>
			<h3 class="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
				{t('calculator.title')}
			</h3>
			<p class="mt-0.5 text-sm leading-snug text-gray-500">{t('calculator.subtitle')}</p>
		</div>
	</div>

	{#if !showResults}
		<div class="space-y-6">
			<!-- Animal segmented -->
			<div>
				<p class="mb-2.5 text-sm font-bold text-gray-700">{t('calculator.form.animal_type')}</p>
				<div class="grid grid-cols-2 gap-2 rounded-full bg-gray-100 p-1.5">
					<button
						type="button"
						onclick={() => (animalType = 'dog')}
						class="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-base font-bold transition-all duration-200 {animalType ===
						'dog'
							? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						<span class="text-xl">🐶</span>
						{t('calculator.animal_types.dog')}
					</button>
					<button
						type="button"
						onclick={() => (animalType = 'cat')}
						class="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-base font-bold transition-all duration-200 {animalType ===
						'cat'
							? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						<span class="text-xl">🐱</span>
						{t('calculator.animal_types.cat')}
					</button>
				</div>
			</div>

			<!-- Weight -->
			<div>
				<div class="mb-2.5 flex items-end justify-between">
					<label for="weight" class="text-sm font-bold text-gray-700">
						{t('calculator.form.weight')} (кг)
					</label>
					{#if previewTsp > 0}
						<span
							class="rounded-full bg-main/10 px-3 py-1 text-xs font-extrabold text-[#b25f0e]"
						>
							🥄 ≈ {previewTsp} tsp/day · {MG_PER_TSP}mg/tsp
						</span>
					{/if}
				</div>
				<div class="flex items-center gap-3">
					<input
						id="weight"
						type="number"
						bind:value={weight}
						placeholder={t('calculator.form.weight_placeholder')}
						step="0.5"
						min="1"
						max="100"
						class="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-4 text-center text-2xl font-extrabold text-gray-900 transition-all outline-none placeholder:text-base placeholder:font-normal placeholder:text-gray-400 focus:border-main focus:bg-white focus:ring-4 focus:ring-main/15"
					/>
				</div>
				<input
					type="range"
					min="2"
					max="50"
					step="0.5"
					value={weightNum || 10}
					oninput={(e) => (weight = (e.target as HTMLInputElement).value)}
					class="mt-3 w-full accent-main"
					aria-label="weight slider"
				/>
				<div class="mt-2 flex gap-2">
					{#each QUICK_WEIGHTS as w}
						<button
							type="button"
							onclick={() => (weight = String(w))}
							class="flex-1 rounded-full border px-3 py-1.5 text-sm font-bold transition-all {weightNum ===
							w
							? 'border-main bg-main text-white shadow'
							: 'border-gray-200 bg-white text-gray-600 hover:border-main/50'}"
						>
							{w} кг
						</button>
					{/each}
				</div>
			</div>

			<!-- Condition cards -->
			<div>
				<p class="mb-2.5 text-sm font-bold text-gray-700">{t('calculator.form.condition')}</p>
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => (condition = 'maintenance')}
						class="rounded-3xl border-2 p-4 text-left transition-all duration-200 {condition ===
						'maintenance'
						? 'border-main bg-main/5 shadow-md'
						: 'border-gray-100 bg-gray-50 hover:border-gray-200'}"
					>
						<div class="text-2xl">🌿</div>
						<div class="mt-1 text-sm font-extrabold text-gray-900">
							{t('calculator.conditions.maintenance')}
						</div>
						<div class="text-xs text-gray-500">12 mg/kg · daily</div>
					</button>
					<button
						type="button"
						onclick={() => (condition = 'active')}
						class="rounded-3xl border-2 p-4 text-left transition-all duration-200 {condition ===
						'active'
						? 'border-main bg-main/5 shadow-md'
						: 'border-gray-100 bg-gray-50 hover:border-gray-200'}"
					>
						<div class="text-2xl">💪</div>
						<div class="mt-1 text-sm font-extrabold text-gray-900">
							{t('calculator.conditions.active')}
						</div>
						<div class="text-xs text-gray-500">18 mg/kg · upper band</div>
					</button>
				</div>
			</div>

			<button
				onclick={calculateDosage}
				disabled={!canCalculate}
				class="w-full rounded-full bg-gradient-to-r from-main to-[#b25f0e] px-6 py-4 text-lg font-extrabold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
			>
				🐾 {t('calculator.form.calculate_button')}
			</button>
			<p class="text-center text-xs text-gray-400">{t('calculator.additional_info')}</p>
		</div>
	{:else}
		<!-- RESULT -->
		<div class="space-y-4">
			<div
				class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-main via-[#c96a12] to-[#b25f0e] p-7 text-center text-white shadow-xl"
			>
				<div class="pointer-events-none absolute -top-6 -right-6 text-[120px] opacity-10">🐾</div>
				<div class="pointer-events-none absolute -bottom-8 -left-4 text-[90px] opacity-10">🐾</div>

				{#if tspPerDay > 0}
					<div
						class="mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-extrabold backdrop-blur"
					>
						🥄 Golden paste · {MG_PER_TSP} mg / tsp
					</div>
					<div class="text-6xl font-black tracking-tight">
						≈ {tspPerDay}
					</div>
					<div class="mt-1 text-lg font-bold text-white/90">tsp / day</div>
				{/if}
				<div class="mt-3 inline-block rounded-full bg-black/20 px-4 py-1 text-sm font-semibold">
					{localDosage} {getDosageUnit()} total · {t(`calculator.conditions.${condition}`)}
				</div>
			</div>

			<div class="rounded-3xl bg-gray-50 p-5 ring-1 ring-black/5">
				<p class="text-sm leading-relaxed font-medium text-gray-700">{localRecommendation}</p>
				<p class="mt-2 text-xs text-gray-500">
					1 tsp ≈ {MG_PER_TSP}mg extract. Start at ½ for 7–10 days, with food.
				</p>
				{#if jarDays}
					<div class="mt-3 grid grid-cols-4 gap-2 text-center">
						<div class="rounded-2xl bg-white px-2 py-2.5 ring-1 ring-black/5">
							<div class="text-[11px] font-extrabold text-gray-400">TRIAL</div>
							<div class="text-sm font-black text-gray-900">~{jarDays.trial}d</div>
						</div>
						<div class="rounded-2xl bg-white px-2 py-2.5 ring-1 ring-black/5">
							<div class="text-[11px] font-extrabold text-gray-400">WEEK</div>
							<div class="text-sm font-black text-gray-900">~{jarDays.week}d</div>
						</div>
						<div class="rounded-2xl bg-white px-2 py-2.5 ring-1 ring-black/5">
							<div class="text-[11px] font-extrabold text-gray-400">HALF</div>
							<div class="text-sm font-black text-gray-900">~{jarDays.half}d</div>
						</div>
						<div class="rounded-2xl bg-main px-2 py-2.5">
							<div class="text-[11px] font-extrabold text-white/70">MONTH</div>
							<div class="text-sm font-black text-white">~{jarDays.month}d</div>
						</div>
					</div>
				{/if}
			</div>

			{#if validation && !validation.isValid}
				<div class="rounded-3xl border-2 border-amber-200 bg-amber-50 p-5">
					<p class="font-extrabold text-amber-900">⚠️ {t(validation.warningKey)}</p>
					{#if validation.recommendationKey}
						<p class="mt-1 text-sm text-amber-800">{t(validation.recommendationKey)}</p>
					{/if}
				</div>
			{/if}

			<details class="group rounded-3xl bg-blue-50/60 p-5 ring-1 ring-blue-100">
				<summary class="cursor-pointer text-sm font-extrabold text-blue-900">
					💡 {t('calculator.quality_assurance.title')}
				</summary>
				<ul class="mt-3 space-y-1.5 text-[13px] leading-snug text-blue-900/80">
					{#each (t('calculator.quality_assurance.tips.general') as unknown as string[]).slice(0, 4) as tip}
						<li class="flex gap-2"><span>•</span><span>{tip}</span></li>
					{/each}
				</ul>
			</details>

			<div class="flex gap-3">
				<button
					onclick={resetCalculator}
					class="flex-1 rounded-full bg-gray-100 px-6 py-3.5 font-bold text-gray-700 transition-all hover:bg-gray-200"
				>
					{t('calculator.actions.calculate_again')}
				</button>
				<a
					href="/products"
					class="flex-1 rounded-full bg-main px-6 py-3.5 text-center font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#b25f0e]"
				>
					🫙 Shop paste
				</a>
			</div>
			<button
				onclick={() => (showResults = false)}
				class="w-full text-center text-sm font-semibold text-gray-400 hover:text-gray-600"
			>
				{t('calculator.actions.modify_inputs')}
			</button>
		</div>
	{/if}
</div>
