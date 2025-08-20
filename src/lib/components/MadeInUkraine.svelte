<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import madeInUkraineIcon from '../assets/icons/made_in_ukraine.svg';
</script>

<section class="w-full py-16 md:py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-gray-50 rounded-2xl p-12 md:p-16">
			<div class="flex flex-col lg:flex-row items-start gap-12">
				<!-- Left side: Flag Icon -->
				<div class="flex-shrink-0">
					<div class="flex flex-col items-center">
						<!-- Ukrainian Flag Icon -->
						<div class="w-16 h-24 md:w-20 md:h-28 mb-4">
							<div class="w-full h-full flex flex-col">
								<!-- Blue stripe (top) -->
								<div class="h-1/2 bg-blue-600"></div>
								<!-- Yellow stripe (bottom) -->
								<div class="h-1/2 bg-yellow-400"></div>
							</div>
						</div>
						
						<!-- "ЗРОБЛЕНО В УКРАЇНІ" text below flag -->
						<div class="text-center">
							<div class="text-sm md:text-base font-medium text-gray-900 uppercase tracking-wide">
								ЗРОБЛЕНО
							</div>
							<div class="text-sm md:text-base font-medium text-gray-900 uppercase tracking-wide">
								В УКРАЇНІ
							</div>
						</div>
					</div>
				</div>
				
				<!-- Right side: Content -->
				<div class="flex-1">
					<!-- Title -->
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
						{(m as any)['footer.company.description']().includes('Balance Botanica – одна з перших') ? 'Зроблено в Україні' : 'Made in Ukraine'}
					</h2>
					
					<!-- Description -->
					<p class="text-lg text-gray-700 leading-relaxed">
						{(m as any)['footer.company.description']()}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
