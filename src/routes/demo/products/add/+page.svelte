<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let { form }: { form: ActionData } = $props();

	let selectedImage: File | null = null;
	let imagePreview: string | null = null;
	let isSubmitting = $state(false);

	function handleImageUpload(event: CustomEvent<{ file: File; preview: string }>) {
		console.log('Image upload event received:', event.detail);
		selectedImage = event.detail.file;
		imagePreview = event.detail.preview;
		console.log('Selected image:', selectedImage);
		console.log('Image preview:', imagePreview);
	}

	function handleImageRemove() {
		selectedImage = null;
		imagePreview = null;
	}
</script>

<svelte:head>
	<title>Add Product - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<div class="mb-6">
		<a href="/demo/products" class="flex items-center text-blue-600 hover:text-blue-800">
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Products
		</a>
	</div>

	<h1 class="mb-8 text-3xl font-bold text-gray-900">Add New Product</h1>

	{#if form?.message}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<div class="mt-2 text-sm text-red-700">
						<p>{form.message}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<form
		method="post"
		action="?/addProduct"
		enctype="multipart/form-data"
		class="space-y-6"
		use:enhance={() => {
			return async ({ formData }) => {
				isSubmitting = true;

				// If there's a selected image, add it to the form data
				if (selectedImage) {
					formData.delete('image'); // Remove any existing image data
					formData.append('image', selectedImage);
				}
			};
		}}
	>
		<div>
			<label for="name" class="mb-2 block text-sm font-medium text-gray-700">
				Product Name *
			</label>
			<input
				type="text"
				id="name"
				name="name"
				required
				minlength="2"
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="e.g., CBD Oil 1000mg"
			/>
		</div>

		<div>
			<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
				Description
			</label>
			<textarea
				id="description"
				name="description"
				rows="3"
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				placeholder="Product description..."
			></textarea>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div>
				<label for="price" class="mb-2 block text-sm font-medium text-gray-700">
					Price (UAH) *
				</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<span class="text-gray-500 sm:text-sm">₴</span>
					</div>
					<input
						type="number"
						id="price"
						name="price"
						required
						min="0"
						step="0.01"
						class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="29.99"
					/>
				</div>
			</div>

			<div>
				<label for="stock" class="mb-2 block text-sm font-medium text-gray-700">
					Stock Quantity *
				</label>
				<input
					type="number"
					id="stock"
					name="stock"
					required
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					placeholder="100"
				/>
			</div>
		</div>

		<div>
			<label for="category" class="mb-2 block text-sm font-medium text-gray-700">
				Category *
			</label>
			<select
				id="category"
				name="category"
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="">Select a category</option>
				<option value="cbd-oils">CBD Oils</option>
				<option value="cbd-topicals">CBD Topicals</option>
				<option value="cbd-edibles">CBD Edibles</option>
				<option value="cbd-cosmetics">CBD Cosmetics</option>
				<option value="accessories">Accessories</option>
				<option value="other">Other</option>
			</select>
		</div>

		<!-- Image Upload Field -->
		<div>
			<label for="image-upload" class="mb-2 block text-sm font-medium text-gray-700">
				Product Image
			</label>
			<ImageUpload
				id="image-upload"
				on:upload={handleImageUpload}
				on:remove={handleImageRemove}
				previewUrl={imagePreview}
				disabled={isSubmitting}
			/>
		</div>

		<div class="flex justify-end space-x-3">
			<a
				href="/demo/products"
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Cancel
			</a>
			<button
				type="submit"
				disabled={isSubmitting}
				class="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Creating...' : 'Create Product'}
			</button>
		</div>
	</form>

	<!-- Info Box -->
	<div class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<div class="ml-3">
				<h3 class="text-sm font-medium text-blue-800">Currently using Drizzle</h3>
				<div class="mt-2 text-sm text-blue-700">
					<p>Products are being stored in your local SQLite database via Drizzle ORM.</p>
					<p>PocketBase is disabled for initial development.</p>
				</div>
			</div>
		</div>
	</div>
</div>
