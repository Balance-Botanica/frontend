<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import madeInUkraineIcon from '../assets/icons/made_in_ukraine.svg';
</script>

<section class="w-full py-16 md:py-20 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-gray-50 rounded-2xl p-12 md:p-16">
		<div class="text-center mb-12">
			<!-- Icon -->
			<div class="flex justify-center mb-6">
				<img 
					src={madeInUkraineIcon} 
					alt="Made in Ukraine" 
					class="w-20 h-20 md:w-24 md:h-24"
				/>
			</div>
			
			<!-- Title -->
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				{(m as any)['footer.company.description']().includes('Balance Botanica – одна з перших') ? 'Зроблено в Україні' : 'Made in Ukraine'}
			</h2>
			
			<!-- Description -->
			<p class="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
				{(m as any)['footer.company.description']()}
			</p>
		</div>
		

		</div>
	</div>
</section>
