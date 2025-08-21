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
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-6">
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Our Products</h1>
					<p class="mt-2 text-sm text-gray-600">Premium CBD products for natural wellness</p>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/auth/login" class="font-medium text-green-600 hover:text-green-700">
						Sign In
					</a>
					<a
						href="/auth/register"
						class="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
					>
						Sign Up
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if data.error}
			<div class="py-12 text-center">
				<div class="mb-4 text-red-600">
					<svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Something went wrong</h3>
				<p class="text-gray-600">{data.error}</p>
			</div>
		{:else if data.products && data.products.length > 0}
			<!-- Products Grid -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each data.products as product}
					<div
						class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
					>
						{#if product.imageUrl}
							<img src={product.imageUrl} alt={product.name} class="h-48 w-full object-cover" />
						{:else}
							<div class="flex h-48 w-full items-center justify-center bg-gray-200">
								<svg
									class="h-12 w-12 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
							</div>
						{/if}

						<div class="p-4">
							<h3 class="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
							<p class="mb-3 line-clamp-2 text-sm text-gray-600">
								{product.description || 'No description available'}
							</p>

							<div class="mb-3 flex items-center justify-between">
								<span class="text-xl font-bold text-green-600">
									${(product.price / 100).toFixed(2)}
								</span>
								<span class="text-sm text-gray-500">
									Stock: {product.stock}
								</span>
							</div>

							<div class="flex items-center justify-between">
								<span
									class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 capitalize"
								>
									{product.category}
								</span>
								<button
									class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
								>
									Add to Cart
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="py-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
					/>
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No products available</h3>
				<p class="mt-1 text-sm text-gray-500">
					We're working on adding amazing products. Check back soon!
				</p>
			</div>
		{/if}
	</div>
</div>
