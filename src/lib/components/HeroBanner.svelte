<script lang="ts">
	import { t } from '../i18n';
	import Section from './Section.svelte';

	// Props
	export let title = '';
	export let subtitle = '';
	export let shopButtonText = '';
	export let learnButtonText = '';
	export let imageUrl = '';
	export let imageAlt = 'Balance Botanica - Golden Paste for Dogs';
</script>

<Section
	id="hero"
	bg="bg-gradient-to-b from-cream via-[#fffdf6] to-white"
	pad="py-12 md:py-16 lg:py-20"
>
	{#snippet decor()}
		<!-- Warm turmeric glow decor (pure CSS, no images) -->
		<div
			class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-turmeric/20 blur-3xl"
			aria-hidden="true"
		></div>
		<div
			class="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-ember/10 blur-3xl"
			aria-hidden="true"
		></div>
	{/snippet}
	<div>
		<div class="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
			<!-- Left Column - Text Content -->
			<div class="flex-1 text-center lg:text-left">
				<h1
					class="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
				>
					{title}
				</h1>
				<p class="mb-8 text-lg text-gray-600 md:text-xl">
					{subtitle}
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
					<a
						href="/products"
						class="rounded-full bg-main px-8 py-3.5 text-center font-bold text-white shadow-xl shadow-main/30 transition-all hover:-translate-y-0.5 hover:bg-[#b25f0e]"
					>
						{shopButtonText}
					</a>
					<a
						href="/#calculator"
						class="rounded-full border-2 border-turmeric bg-white/70 px-8 py-3.5 text-center font-bold text-turmeric-deep transition-all hover:-translate-y-0.5 hover:bg-turmeric-soft"
					>
						{learnButtonText}
					</a>
				</div>
			</div>

			<!-- Right Column - Hero Image -->
			<div class="flex flex-1 justify-center">
				<div class="relative">
					<div
						class="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-turmeric/30 via-transparent to-ember/20 blur-xl"
						aria-hidden="true"
					></div>
					<img
						src={imageUrl}
						alt={imageAlt}
						class="relative h-auto max-w-full rounded-[1.75rem] shadow-2xl ring-4 ring-turmeric/25"
						loading="eager"
					/>
				</div>
			</div>
		</div>
	</div>
</Section>
