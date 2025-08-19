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
			uploadResult = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Cloudinary Test - Balance Botanica</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<div class="mb-6">
		<a href="/demo" class="text-blue-600 hover:text-blue-800 flex items-center">
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Demo
		</a>
	</div>

	<h1 class="text-3xl font-bold text-gray-900 mb-8">Cloudinary Integration Test</h1>

	<!-- Connection Status -->
	<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 mb-4">Connection Status</h2>
		<div class="text-lg font-mono">{connectionStatus}</div>
		<button 
			on:click={testConnection}
			class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
		>
			Test Connection Again
		</button>
	</div>

	<!-- Image Upload Test -->
	<div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
		<h2 class="text-xl font-semibold text-gray-900 mb-4">Image Upload Test</h2>
		
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
					class="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
				</button>
			</div>
		{/if}

		{#if uploadResult}
			<div class="mt-6 p-4 rounded-lg {uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
				<h3 class="font-semibold {uploadResult.success ? 'text-green-800' : 'text-red-800'} mb-2">
					{uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
				</h3>
				<pre class="text-sm overflow-x-auto">{JSON.stringify(uploadResult, null, 2)}</pre>
			</div>
		{/if}
	</div>

	<!-- Info Box -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
		<h3 class="text-lg font-semibold text-blue-800 mb-2">What This Tests</h3>
		<ul class="text-blue-700 space-y-1">
			<li>• Cloudinary API connection</li>
			<li>• Image upload functionality</li>
			<li>• Image optimization and transformation</li>
			<li>• Error handling and response parsing</li>
		</ul>
	</div>
</div>
