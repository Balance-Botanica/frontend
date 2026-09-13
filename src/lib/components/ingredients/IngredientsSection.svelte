<script lang="ts">
	import IngredientCard from './IngredientCard.svelte';
	import { t } from '../../i18n';

	const keys = ['turmeric', 'coconut', 'ginger', 'pepper'] as const;
</script>

<section id="ingredients" class="w-full bg-gradient-to-b from-amber-50/60 via-white to-white py-14 md:py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-10 text-center">
			<span
				class="mb-4 inline-block rounded-full bg-main/10 px-4 py-1.5 text-xs font-extrabold tracking-widest text-[#b25f0e] uppercase"
			>
				🐾 Golden paste recipe
			</span>
			<h2 class="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
				{t('benefits.ingredients_title')}
			</h2>
			<div class="mx-auto mt-4 h-1.5 w-28 rounded-full bg-gradient-to-r from-turmeric-deep via-turmeric to-turmeric-deep" aria-hidden="true"></div>
			<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
				{t('benefits.ingredients_subtitle')}
			</p>
		</div>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each keys as key}
				<IngredientCard
					emoji={t(`ingredients.${key}.emoji`)}
					title={t(`ingredients.${key}.title`)}
					role={t(`ingredients.${key}.role`)}
					benefit={t(`ingredients.${key}.benefit`)}
					fact={t(`ingredients.${key}.fact`)}
				/>
			{/each}
		</div>

		<p class="mt-8 text-center text-sm text-gray-400">
			{t('benefits.ingredients_note')}
		</p>
	</div>
</section>
