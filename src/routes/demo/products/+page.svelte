<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Products Demo - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Products Demo</h1>
	
	<!-- Data Source Info -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
		<div class="flex items-center">
			<div class="flex-shrink-0">
				<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium text-blue-800">
					Currently using: <span class="font-bold">{data.dataSource.toUpperCase()}</span>
				</h3>
				<div class="mt-2 text-sm text-blue-700">
					<p>Total products: {data.totalProducts}</p>
					<p>PocketBase is currently disabled for initial development</p>
				</div>
			</div>
		</div>
	</div>

	{#if data.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error loading products</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{data.error}</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Products List -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each data.products as product}
				<div class="bg-white rounded-lg shadow-md overflow-hidden">
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
						<p class="text-gray-600 text-sm mb-3">{product.description || 'No description available'}</p>
						<div class="flex justify-between items-center">
							<span class="text-lg font-bold text-green-600">${(product.price / 100).toFixed(2)}</span>
							<span class="text-sm text-gray-500">Stock: {product.stock}</span>
						</div>
						<div class="mt-2">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								{product.category}
							</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="col-span-full text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
					<p class="mt-1 text-sm text-gray-500">Get started by adding some products to your database.</p>
					<div class="mt-6">
						<a href="/demo/products/add" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
							Add Product
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- Categories Summary -->
		{#if Object.keys(data.categories).length > 0}
			<div class="mt-8">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Categories Summary</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each Object.entries(data.categories) as [category, products]}
						<div class="bg-gray-50 rounded-lg p-4">
							<h3 class="font-medium text-gray-900 capitalize">{category.replace('-', ' ')}</h3>
							<p class="text-sm text-gray-600">{products.length} products</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Low Stock Alert -->
		{#if data.lowStock.length > 0}
			<div class="mt-8">
				<h2 class="text-xl font-semibold text-red-900 mb-4">Low Stock Alert</h2>
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">
						{data.lowStock.length} products have low stock (≤10 items)
					</p>
				</div>
			</div>
		{/if}
	{/if}
</div>
