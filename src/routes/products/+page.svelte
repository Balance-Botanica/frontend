<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Products - Balance Botanica</title>
	<meta name="description" content="Browse our premium CBD products for wellness and relaxation" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<div class="bg-white shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Our Products</h1>
					<p class="mt-2 text-sm text-gray-600">
						Premium CBD products for natural wellness
					</p>
				</div>
				<div class="flex items-center space-x-4">
					<a 
						href="/auth/login" 
						class="text-green-600 hover:text-green-700 font-medium"
					>
						Sign In
					</a>
					<a 
						href="/auth/register" 
						class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
					>
						Sign Up
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if data.error}
			<div class="text-center py-12">
				<div class="text-red-600 mb-4">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
				<p class="text-gray-600">{data.error}</p>
			</div>
		{:else if data.products && data.products.length > 0}
			<!-- Products Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.products as product}
					<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="w-full h-48 object-cover" />
						{:else}
							<div class="w-full h-48 bg-gray-200 flex items-center justify-center">
								<svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						{/if}
						
						<div class="p-4">
							<h3 class="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
							<p class="text-gray-600 text-sm mb-3 line-clamp-2">
								{product.description || 'No description available'}
							</p>
							
							<div class="flex justify-between items-center mb-3">
								<span class="text-xl font-bold text-green-600">
									${(product.price / 100).toFixed(2)}
								</span>
								<span class="text-sm text-gray-500">
									Stock: {product.stock}
								</span>
							</div>
							
							<div class="flex justify-between items-center">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
									{product.category}
								</span>
								<button class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
									Add to Cart
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No products available</h3>
				<p class="mt-1 text-sm text-gray-500">
					We're working on adding amazing products. Check back soon!
				</p>
			</div>
		{/if}
	</div>
</div>
