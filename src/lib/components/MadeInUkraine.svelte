<script lang="ts">
	import { t } from '../i18n';
	import madeInUkraineIcon from '../assets/icons/made_in_ukraine.svg';
</script>

<section class="w-full py-16 md:py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-gray-50 rounded-2xl p-12 md:p-16">
			<div class="flex flex-col lg:flex-row items-center justify-center gap-12">
				<!-- Left side: Flag Icon -->
				<div class="flex-shrink-0">
					<div class="flex flex-col items-center">
						<!-- Ukrainian Flag Icon with barcode design -->
						<div class="w-32 h-28 md:w-40 md:h-36 mb-4">
							<img src={madeInUkraineIcon} alt={t('made_in_ukraine.title')} class="w-full h-full object-contain" />
						</div>
					</div>
				</div>
				
				<!-- Right side: Content -->
				<div class="flex-1 text-center lg:text-left">
					<!-- Title -->
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
						{t('made_in_ukraine.title')}
					</h2>
					
					<!-- Subtitle -->
					<p class="text-lg text-gray-600 mb-4">
						{t('made_in_ukraine.subtitle')}
					</p>
					
					<!-- Description -->
					<p class="text-lg text-gray-700 leading-relaxed">
						{t('made_in_ukraine.description')}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
