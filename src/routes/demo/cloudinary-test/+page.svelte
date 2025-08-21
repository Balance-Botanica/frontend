<script lang="ts">
	import { onMount } from 'svelte';
	import ImageUpload from '$lib/components/ImageUpload.svelte';

	let connectionStatus = 'Testing...';
	let uploadResult: any = null;
	let isUploading = false;
	let selectedImage: File | null = null;
	let imagePreview: string | null = null;

	onMount(async () => {
		await testConnection();
	});

	async function testConnection() {
		try {
			const response = await fetch('/api/cloudinary/test');
			const result = await response.json();

			if (result.success) {
				connectionStatus = '✅ Connected to Cloudinary!';
			} else {
				connectionStatus = `❌ Connection failed: ${result.error}`;
			}
		} catch (error) {
			connectionStatus = `❌ Test failed: ${error}`;
		}
	}

	function handleImageUpload(event: CustomEvent<{ file: File; preview: string }>) {
		selectedImage = event.detail.file;
		imagePreview = event.detail.preview;
	}

	function handleImageRemove() {
		selectedImage = null;
		imagePreview = null;
		uploadResult = null;
	}

	async function uploadImage() {
		if (!selectedImage) return;

		isUploading = true;
		try {
			const formData = new FormData();
			formData.append('image', selectedImage);

			const response = await fetch('/api/cloudinary/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			uploadResult = result;
		} catch (error) {
			uploadResult = {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Cloudinary Test - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-6">
		<a href="/demo" class="flex items-center text-blue-600 hover:text-blue-800">
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Demo
		</a>
	</div>

	<h1 class="mb-8 text-3xl font-bold text-gray-900">Cloudinary Integration Test</h1>

	<!-- Connection Status -->
	<div class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
		<h2 class="mb-4 text-xl font-semibold text-gray-900">Connection Status</h2>
		<div class="font-mono text-lg">{connectionStatus}</div>
		<button
			on:click={testConnection}
			class="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
		>
			Test Connection Again
		</button>
	</div>

	<!-- Image Upload Test -->
	<div class="mb-8 rounded-lg border border-gray-200 bg-white p-6">
		<h2 class="mb-4 text-xl font-semibold text-gray-900">Image Upload Test</h2>

		<ImageUpload
			on:upload={handleImageUpload}
			on:remove={handleImageRemove}
			previewUrl={imagePreview}
			disabled={isUploading}
		/>

		{#if selectedImage}
			<div class="mt-6">
				<button
					on:click={uploadImage}
					disabled={isUploading}
					class="rounded-md bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
				</button>
			</div>
		{/if}

		{#if uploadResult}
			<div
				class="mt-6 rounded-lg p-4 {uploadResult.success
					? 'border border-green-200 bg-green-50'
					: 'border border-red-200 bg-red-50'}"
			>
				<h3 class="font-semibold {uploadResult.success ? 'text-green-800' : 'text-red-800'} mb-2">
					{uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
				</h3>
				<pre class="overflow-x-auto text-sm">{JSON.stringify(uploadResult, null, 2)}</pre>
			</div>
		{/if}
	</div>

	<!-- Info Box -->
	<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
		<h3 class="mb-2 text-lg font-semibold text-blue-800">What This Tests</h3>
		<ul class="space-y-1 text-blue-700">
			<li>• Cloudinary API connection</li>
			<li>• Image upload functionality</li>
			<li>• Image optimization and transformation</li>
			<li>• Error handling and response parsing</li>
		</ul>
	</div>
</div>
