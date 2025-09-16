<script lang="ts">
	import { t } from '../i18n';

	// Props
	export let title = '';
	export let subtitle = '';
	export let shopButtonText = '';
	export let learnButtonText = '';
	export let imageUrl = '';
	export let imageAlt = 'Balance Botanica - Premium CBD Products';
</script>

<div id="hero" class="w-full bg-white py-12 md:py-16 lg:py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
			<!-- Left Column - Text Content -->
			<div class="flex-1 text-center lg:text-left">
				<h1 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
					{title}
				</h1>
				<p class="mb-8 text-lg text-gray-600 md:text-xl">
					{subtitle}
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
					<a
						href="/products"
						class="rounded-lg bg-[#3f6f68] px-6 py-3 text-center font-medium text-white transition-colors hover:bg-[#2d5a54]"
					>
						{shopButtonText}
					</a>
					<a
						href="/about"
						class="rounded-lg border-2 border-[#3f6f68] px-6 py-3 text-center font-medium text-[#3f6f68] transition-colors hover:bg-[#3f6f68] hover:text-white"
					>
						{learnButtonText}
					</a>
				</div>
			</div>

			<!-- Right Column - Hero Image -->
			<div class="flex flex-1 justify-center">
				<img
					src={imageUrl}
					alt={imageAlt}
					class="h-auto max-w-full rounded-xl shadow-lg"
					loading="eager"
				/>
			</div>
		</div>
	</div>
</div>
