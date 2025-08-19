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
				{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Зроблено в Україні' : 'Made in Ukraine'}
			</h2>
			
			<!-- Subtitle -->
			<p class="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
				{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'З гордістю створено українською якістю та традицією' : 'Proudly crafted with Ukrainian quality and tradition'}
			</p>
			
			<!-- Description -->
			<p class="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
				{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Наші КБД олійки — це 100% український продукт, створений з турботою та любов\'ю до ваших домашніх улюбленців. Ми горді тим, що дотримуємося всіх стандартів якості, встановлених ТУ У 10.8-36472799-003:20209-003:2020. Це забезпечує безпеку та ефективність наших продуктів, гарантуючи, що вони відповідають усім вимогам. Обираючи нашу продукцію, ви підтримуєте українського виробника та отримуєте товар, який заслуговує на довіру.' : 'Our CBD oils are 100% Ukrainian products, created with care and love for your beloved pets. We are proud to adhere to all quality standards established by ТУ У 10.8-36472799-003:20209-003:2020. This ensures the safety and effectiveness of our products, guaranteeing that they meet all requirements. By choosing our products, you support Ukrainian manufacturers and get goods that deserve trust.'}
			</p>
		</div>
		
		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
			<!-- Premium Quality -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
				<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">
					{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Преміум якість' : 'Premium Quality'}
				</h3>
			</div>
			
			<!-- Local Sourcing -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
				<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">
					{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Місцеве походження' : 'Local Sourcing'}
				</h3>
			</div>
			
			<!-- Ukrainian Expertise -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
				<div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">
					{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Українська експертиза' : 'Ukrainian Expertise'}
				</h3>
			</div>
			
			<!-- International Standards -->
			<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
				<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 mb-2">
					{(m as any)['footer.newsletter.title']().includes('Підписка') ? 'Міжнародні стандарти' : 'International Standards'}
				</h3>
			</div>
		</div>
		</div>
	</div>
</section>
