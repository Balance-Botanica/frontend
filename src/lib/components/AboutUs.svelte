<script lang="ts">
	import { t } from '../i18n';
	import featureBanner1 from '../assets/images/feature-banner1.png';
	import featureBanner2 from '../assets/images/feature-banner2.png';
	import featureBanner3 from '../assets/images/feature-banner3.png';
</script>

<section class="w-full bg-white px-4 py-20 md:px-8 lg:px-16 xl:px-24 2xl:px-32">
	<div class="mx-auto max-w-7xl">
		<!-- Main Content Container -->
		<div class="flex flex-col gap-15">
			<!-- Header Section -->
			<div class="flex flex-col items-start gap-8 lg:flex-row lg:gap-16">
				<!-- Title -->
				<h2 class="flex-shrink-0 text-4xl font-bold text-gray-900 md:text-5xl">
					{t('about_us.title')}
				</h2>

				<!-- Description Text -->
				<p class="max-w-2xl text-lg leading-relaxed text-gray-700 md:text-xl">
					{t('about_us.description')}
				</p>
			</div>

			<!-- Image Cards Row -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- Left Image Card - Cat with Dropper -->
				<div class="relative overflow-hidden rounded-2xl shadow-lg">
					<img
						src={featureBanner1}
						alt={t('about_us.image1_alt')}
						class="h-80 w-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>

				<!-- Middle Image Card - Happy Dog with Products -->
				<div class="relative overflow-hidden rounded-2xl shadow-lg">
					<img
						src={featureBanner2}
						alt={t('about_us.image2_alt')}
						class="h-80 w-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>

				<!-- Right Image Card - Hands with Dropper and Dog -->
				<div class="relative overflow-hidden rounded-2xl shadow-lg">
					<img
						src={featureBanner3}
						alt={t('about_us.image3_alt')}
						class="h-80 w-full object-cover"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>
			</div>
		</div>
	</div>
</section>
