<script lang="ts">
	import BenefitIcon from './BenefitIcon.svelte';
	import { t } from '../i18n';

	// Locale can be passed to the component
	export let locale = 'uk-ua';
</script>

<div id="benefits" class="w-full bg-[#3f6f68] py-12 md:py-16 lg:py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 id="benefits-heading" class="mb-12 text-center text-2xl font-bold text-white md:text-3xl">
			{t('benefits.title')}
		</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
			<!-- Left Column - Golden Paste CBD -->
			<article class="rounded-xl bg-white/10 p-6 md:p-8" aria-labelledby="golden-paste-heading">
				<h3
					id="golden-paste-heading"
					class="mb-6 text-center text-xl font-bold text-white md:text-2xl"
				>
					{t('benefits.golden_paste.title')}
				</h3>

				<!-- Куркума -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="🟡" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.golden_paste.turmeric.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.turmeric.description')}
						</p>
					</div>
				</div>

				<!-- Імбир -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="🟠" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.golden_paste.ginger.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.ginger.description')}
						</p>
					</div>
				</div>

				<!-- Кокосове масло -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="🥥" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.golden_paste.coconut_oil.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.coconut_oil.description')}
						</p>
					</div>
				</div>

				<!-- CBD для собак -->
				<div class="flex items-start gap-4">
					<BenefitIcon emoji="🐕" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.golden_paste.cbd_for_dogs.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.cbd_for_dogs.description')}
						</p>
					</div>
				</div>
			</article>

			<!-- Right Column - CBD Oil -->
			<article class="rounded-xl bg-white/10 p-6 md:p-8" aria-labelledby="cbd-oil-heading">
				<h3 id="cbd-oil-heading" class="mb-6 text-center text-xl font-bold text-white md:text-2xl">
					{t('benefits.cbd_oil.title')}
				</h3>

				<!-- MCT Oil основа -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="🥥" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.mct_base.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.mct_base.description')}
						</p>
					</div>
				</div>

				<!-- Два смаки -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="🍖" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.two_flavors.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.two_flavors.description')}
						</p>
					</div>
				</div>

				<!-- Зручний дозатор -->
				<div class="mb-5 flex items-start gap-4">
					<BenefitIcon emoji="💧" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.convenient_dropper.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.convenient_dropper.description')}
						</p>
					</div>
				</div>

				<!-- Швидка дія -->
				<div class="flex items-start gap-4">
					<BenefitIcon emoji="⚡" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.fast_action.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.fast_action.description')}
						</p>
					</div>
				</div>
			</article>
		</div>

		<!-- Bottom recommendation text -->
		<footer class="mt-12 border-t border-white/20 pt-8 text-center">
			<p class="text-sm text-white/70">
				{@html locale === 'uk-ua'
					? 'Обидва продукти можна давати як собакам, так і котам. Щоб правильно обрати продукт та дозування, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">використайте наш калькулятор</a> та проконсультуватися з ветеринаром.'
					: 'Both products can be given to both dogs and cats. To properly choose a product and dosage, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">use our calculator</a> and consult with your veterinarian.'}
			</p>
		</footer>
	</div>
</div>
