<script lang="ts">
	import { t } from '../i18n';
	import madeInUkraineIcon from '../assets/icons/made_in_ukraine.svg';
</script>

<section class="w-full bg-white py-16 md:py-20">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-gray-50 p-12 md:p-16">
			<div class="flex flex-col items-center justify-center gap-12 lg:flex-row">
				<!-- Left side: Flag Icon -->
				<div class="flex-shrink-0">
					<div class="flex flex-col items-center">
						<!-- Ukrainian Flag Icon with barcode design -->
						<div class="mb-4 h-28 w-32 md:h-36 md:w-40">
							<img
								src={madeInUkraineIcon}
								alt={t('made_in_ukraine.title')}
								class="h-full w-full object-contain"
							/>
						</div>
					</div>
				</div>

				<!-- Right side: Content -->
				<div class="flex-1 text-center lg:text-left">
					<!-- Title -->
					<h2 class="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
						{t('made_in_ukraine.title')}
					</h2>

					<!-- Subtitle -->
					<p class="mb-4 text-lg text-gray-600">
						{t('made_in_ukraine.subtitle')}
					</p>

					<!-- Description -->
					<p class="text-lg leading-relaxed text-gray-700">
						{t('made_in_ukraine.description')}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
