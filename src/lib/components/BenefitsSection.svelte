<script lang="ts">
	import BenefitIcon from './BenefitIcon.svelte';
	import { t } from '../i18n';

	// Locale can be passed to the component
	export let locale = 'uk-ua';
</script>

<div id="benefits" class="relative w-full overflow-hidden bg-gradient-to-b from-[#182720] to-[#101b17] py-12 md:py-16 lg:py-20">
	<!-- Warm breath on near-black pine: amber glow, content stays readable AAA -->
	<div
		class="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-turmeric/15 blur-3xl"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 id="benefits-heading" class="mb-4 text-center text-2xl font-bold text-white md:text-3xl">
			{t('benefits.title')}
		</h2>
		<div class="mx-auto mb-12 h-1.5 w-28 rounded-full bg-gradient-to-r from-turmeric-deep via-turmeric to-turmeric-deep" aria-hidden="true"></div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
		<!-- Left Column - Golden Paste recipe -->
		<article class="rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8" aria-labelledby="golden-paste-heading">
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

				<!-- Перець: ключик засвоєння -->
				<div class="flex items-start gap-4">
					<BenefitIcon emoji="🌶️" />
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

		<!-- Right Column - Why it works -->
		<article class="rounded-2xl bg-white/[0.07] p-6 ring-1 ring-white/10 backdrop-blur-sm md:p-8" aria-labelledby="cbd-oil-heading">
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

			<!-- Прозора доза -->
			<div class="mb-5 flex items-start gap-4">
				<BenefitIcon emoji="🥄" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.two_flavors.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.two_flavors.description')}
						</p>
					</div>
				</div>

			<!-- Безпечний склад -->
			<div class="mb-5 flex items-start gap-4">
				<BenefitIcon emoji="🛡️" />
					<div>
						<h4 class="mb-1 text-lg font-semibold text-white">
							{t('benefits.cbd_oil.convenient_dropper.title')}
						</h4>
						<p class="text-sm text-white/80">
							{t('benefits.cbd_oil.convenient_dropper.description')}
						</p>
					</div>
				</div>

			<!-- Лабораторний тест -->
			<div class="flex items-start gap-4">
				<BenefitIcon emoji="🧪" />
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
					? 'Золота паста — доповнюючий корм для собак. Не є ветпрепаратом, не замінює призначені НПЗЗ. Щоб обрати дозу в ложках, <a href="#calculator" class="text-green-300 hover:text-green-200 underline font-medium transition-colors">використайте калькулятор</a> та проконсультуйтеся з ветеринаром.'
					: 'Golden paste is a complementary feed for dogs. Not a medicine, not an NSAID replacement. To pick your spoon dose, <a href="#calculator" class="text-green-300 hover:text-green-200 underline font-medium transition-colors">use the calculator</a> and consult your vet.'}
			</p>
		</footer>
	</div>
</div>
