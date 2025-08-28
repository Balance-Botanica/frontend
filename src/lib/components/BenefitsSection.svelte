<script lang="ts">
	import BenefitIcon from './BenefitIcon.svelte';
	import { t } from '../i18n';

	// Locale can be passed to the component
	export let locale = 'uk-ua';
</script>

<div id="benefits" class="w-full bg-[#3f6f68] py-12 md:py-16 lg:py-20">
	<div class="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
		<h2 id="benefits-heading" class="text-2xl md:text-3xl font-bold text-white text-center mb-12">
			{t('benefits.title')}
		</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
			<!-- Left Column - Golden Paste CBD -->
			<article class="bg-white/10 rounded-xl p-6 md:p-8" aria-labelledby="golden-paste-heading">
				<h3 id="golden-paste-heading" class="text-xl md:text-2xl font-bold text-white text-center mb-6">
					{t('benefits.golden_paste.title')}
				</h3>

				<!-- Куркума -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="🟡" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
							{t('benefits.golden_paste.turmeric.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.turmeric.description')}
						</p>
					</div>
				</div>

				<!-- Імбир -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="🟠" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
							{t('benefits.golden_paste.ginger.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.ginger.description')}
						</p>
					</div>
				</div>

				<!-- Кокосове масло -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="🥥" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
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
						<h4 class="text-lg font-semibold text-white mb-1">
							{t('benefits.golden_paste.cbd_for_dogs.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.golden_paste.cbd_for_dogs.description')}
						</p>
					</div>
				</div>
			</article>

			<!-- Right Column - CBD Oil -->
			<article class="bg-white/10 rounded-xl p-6 md:p-8" aria-labelledby="cbd-oil-heading">
				<h3 id="cbd-oil-heading" class="text-xl md:text-2xl font-bold text-white text-center mb-6">
					{t('benefits.cbd_oil.title')}
				</h3>

				<!-- MCT Oil основа -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="🥥" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
							{t('benefits.cbd_oil.mct_base.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.mct_base.description')}
						</p>
					</div>
				</div>

				<!-- Два смаки -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="🍖" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
							{t('benefits.cbd_oil.two_flavors.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.two_flavors.description')}
						</p>
					</div>
				</div>

				<!-- Зручний дозатор -->
				<div class="flex items-start gap-4 mb-5">
					<BenefitIcon emoji="💧" />
					<div>
						<h4 class="text-lg font-semibold text-white mb-1">
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
						<h4 class="text-lg font-semibold text-white mb-1">
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
		<footer class="mt-12 pt-8 text-center border-t border-white/20">
			<p class="text-sm text-white/70">
				{@html locale === 'uk-ua'
					? 'Обидва продукти можна давати як собакам, так і котам. Щоб правильно обрати продукт та дозування, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">використайте наш калькулятор</a> та проконсультуватися з ветеринаром.'
					: 'Both products can be given to both dogs and cats. To properly choose a product and dosage, <a href="#calculator" class="text-green-400 hover:text-green-300 underline font-medium transition-colors">use our calculator</a> and consult with your veterinarian.'}
			</p>
		</footer>
	</div>
</div>