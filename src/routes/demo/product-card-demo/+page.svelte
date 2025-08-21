<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		addToCart: { productId: string; product: any };
		imageClick: { productId: string; imageUrl: string; index: number };
	}>();

	// Demo products with different image configurations
	const demoProducts = [
		{
			id: '1',
			name: 'CBD Oil для собак - Premium',
			description:
				"Високоякісна CBD олія для собак з натуральними інгредієнтами. Допомагає зменшити тривожність та покращити загальний стан здоров'я вашого улюбленця.",
			price: 80000, // 800.00 грн
			stock: 15,
			category: 'CBD для собак',
			imageUrls: JSON.stringify([
				'https://images.unsplash.com/photo-1601758228041-3a9aa03e1206?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop'
			])
		},
		{
			id: '2',
			name: 'CBD Oil для кішок - Calm',
			description:
				'Спеціально розроблена формула для кішок, що допомагає зменшити стрес та забезпечити спокійний сон.',
			price: 65000, // 650.00 грн
			stock: 8,
			category: 'CBD для кішок',
			imageUrls: JSON.stringify([
				'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
				'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop'
			])
		},
		{
			id: '3',
			name: 'CBD Oil для коней - Performance',
			description:
				'Професійна CBD олія для коней, що підтримує фізичну активність та допомагає відновитися після тренувань.',
			price: 120000, // 1200.00 грн
			stock: 5,
			category: 'CBD для коней',
			imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5f?w=400&h=300&fit=crop'
		},
		{
			id: '4',
			name: 'CBD Oil для малих тварин',
			description: "М'яка формула для кроликів, хом'яків та інших малих домашніх тварин.",
			price: 45000, // 450.00 грн
			stock: 12,
			category: 'CBD для малих тварин',
			imageUrls: JSON.stringify([
				'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'
			])
		}
	];

	function handleAddToCart(event: CustomEvent) {
		dispatch('addToCart', event.detail);
		console.log('Add to cart:', event.detail);
		// Here you would typically add to cart state or send to backend
	}

	function handleImageClick(event: CustomEvent) {
		dispatch('imageClick', event.detail);
		console.log('Image clicked:', event.detail);
		// Here you could open image modal or navigate to product detail
	}
</script>

<svelte:head>
	<title>Product Card Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-[#f8f7f6]">
	<!-- Header Section -->
	<div class="border-b border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<h1 class="font-poppins text-4xl font-semibold text-black">Product Card Demo</h1>
			<p class="mt-2 text-gray-600">Тестування різних конфігурацій карточки товару</p>
		</div>
	</div>

	<!-- Demo Controls -->
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Конфігурації для тестування</h2>
			<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
				<div class="rounded bg-blue-50 p-3">
					<strong>Продукт 1:</strong> 3 зображення (слайдер)
				</div>
				<div class="rounded bg-green-50 p-3">
					<strong>Продукт 2:</strong> 2 зображення (слайдер)
				</div>
				<div class="rounded bg-yellow-50 p-3">
					<strong>Продукт 3:</strong> 1 зображення (legacy imageUrl)
				</div>
				<div class="rounded bg-purple-50 p-3">
					<strong>Продукт 4:</strong> 1 зображення (масив з 1 елементом)
				</div>
			</div>
		</div>
	</div>

	<!-- Products Grid -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each demoProducts as product}
				<ProductCard {product} on:addToCart={handleAddToCart} on:imageClick={handleImageClick} />
			{/each}
		</div>
	</div>

	<!-- Event Log -->
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-xl font-semibold">Лог подій</h2>
			<div class="rounded bg-gray-50 p-4 font-mono text-sm">
				<p>Відкрийте консоль браузера для перегляду подій</p>
				<p>• addToCart - при натисканні кнопки "До кошика"</p>
				<p>• imageClick - при кліку на зображення</p>
			</div>
		</div>
	</div>
</div>

<style>
	.font-poppins {
		font-family: 'Poppins', sans-serif;
	}
</style>
