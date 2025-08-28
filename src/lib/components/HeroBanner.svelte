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
	<div class="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
		<div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
			<!-- Left Column - Text Content -->
			<div class="flex-1 text-center lg:text-left">
				<h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
					{title}
				</h1>
				<p class="text-lg md:text-xl text-gray-600 mb-8">
					{subtitle}
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
					<a href="/products" class="px-6 py-3 bg-[#3f6f68] text-white font-medium rounded-lg hover:bg-[#2d5a54] transition-colors text-center">
						{shopButtonText}
					</a>
					<a href="/about" class="px-6 py-3 border-2 border-[#3f6f68] text-[#3f6f68] font-medium rounded-lg hover:bg-[#3f6f68] hover:text-white transition-colors text-center">
						{learnButtonText}
					</a>
				</div>
			</div>

			<!-- Right Column - Hero Image -->
			<div class="flex-1 flex justify-center">
				<img src={imageUrl} alt={imageAlt} class="rounded-xl shadow-lg max-w-full h-auto" loading="eager" />
			</div>
		</div>
	</div>
</div>