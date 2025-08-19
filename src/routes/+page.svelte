<script lang="ts">
	import { onMount } from 'svelte';
	import CalculatorSection from '$lib/components/CalculatorSection.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	
	let isScrolled = false;
	
	onMount(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
	<title>Balance Botanica - Premium CBD Products</title>
	<meta name="description" content="Discover premium CBD products for wellness and relaxation" />
</svelte:head>

<!-- Full Screen Hero Banner -->
<section class="relative h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-700 to-green-600 overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		<div class="absolute inset-0 bg-white/10"></div>
	</div>
	
	<!-- Hero Content -->
	<div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
		<h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
			Balance Botanica
		</h1>
		<p class="text-xl md:text-2xl mb-8 text-green-100 max-w-2xl mx-auto">
			Premium CBD products for natural wellness and relaxation. 
			Discover the power of nature's healing properties.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a 
				href="/products" 
				class="bg-white text-green-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-300 shadow-lg"
			>
				Shop Products
			</a>
			<a 
				href="/about" 
				class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-800 transition-colors duration-300"
			>
				Learn More
			</a>
		</div>
	</div>
	
	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- Main Content -->
<main class="min-h-screen bg-white">
	<!-- Features Section -->
	<section class="py-20 px-4">
		<div class="max-w-6xl mx-auto">
			<h2 class="text-4xl font-bold text-center text-gray-900 mb-16">
				Why Choose Balance Botanica?
			</h2>
			
			<div class="grid md:grid-cols-3 gap-8">
				<!-- Feature 1 -->
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
					<p class="text-gray-600">All our products are made with the highest quality organic ingredients and third-party tested for purity.</p>
				</div>
				
				<!-- Feature 2 -->
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Acting</h3>
					<p class="text-gray-600">Our CBD products are formulated for maximum bioavailability and quick absorption.</p>
				</div>
				
				<!-- Feature 3 -->
				<div class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">Made with Love</h3>
					<p class="text-gray-600">Every product is crafted with care and attention to detail, ensuring the best experience for our customers.</p>
				</div>
			</div>
		</div>
	</section>
	
	<!-- CTA Section -->
	<section class="py-20 bg-green-50">
		<div class="max-w-4xl mx-auto text-center px-4">
			<h2 class="text-4xl font-bold text-gray-900 mb-6">
				Ready to Experience the Difference?
			</h2>
			<p class="text-xl text-gray-600 mb-8">
				Join thousands of satisfied customers who have discovered the benefits of premium CBD products.
			</p>
			<a 
				href="/products" 
				class="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-300 shadow-lg"
			>
				Start Shopping Now
			</a>
		</div>
	</section>
	
	<!-- Calculator Section -->
	<CalculatorSection />
	
	<!-- FAQ Section -->
	<FAQ />
</main> 
