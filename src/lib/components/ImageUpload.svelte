<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher<{
		upload: { file: File; preview: string };
		remove: void;
	}>();

	export let accept = 'image/*';
	export let maxSize = 5 * 1024 * 1024; // 5MB
	export let maxWidth = 2000;
	export let maxHeight = 2000;
	export let previewUrl: string | null = null;
	export let disabled = false;
	export let id: string | undefined = undefined;

	let dragOver = false;
	let fileInput: HTMLInputElement;
	let errorMessage = '';

	// Sync external previewUrl with internal state
	$: if (previewUrl !== undefined) {
		// This will update when the external previewUrl changes
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			handleFile(target.files[0]);
		}
	}

	function handleFile(file: File) {
		errorMessage = '';

		// Validate file type
		if (!file.type.startsWith('image/')) {
			errorMessage = 'Please select an image file';
			return;
		}

		// Validate file size
		if (file.size > maxSize) {
			errorMessage = `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`;
			return;
		}

		// Create preview and validate dimensions
		const img = new Image();
		const reader = new FileReader();

		reader.onload = (e) => {
			img.src = e.target?.result as string;
			img.onload = () => {
				if (img.width > maxWidth || img.height > maxHeight) {
					errorMessage = `Image dimensions must be less than ${maxWidth}x${maxHeight}px`;
					return;
				}

				// Set preview immediately for better UX
				previewUrl = e.target?.result as string;
				console.log('Preview set:', previewUrl);

				// File is valid, dispatch upload event
				dispatch('upload', { file, preview: e.target?.result as string });
			};
		};

		reader.readAsDataURL(file);
	}

	function removeImage() {
		previewUrl = null;
		dispatch('remove');
	}

	function openFileDialog() {
		fileInput?.click();
	}
</script>

<div class="space-y-4">
	<!-- Image Preview -->
	{#if previewUrl}
		<div class="relative">
			<img
				src={previewUrl}
				alt="Product preview"
				class="h-48 w-full rounded-lg border border-gray-300 object-cover"
			/>
			<button
				type="button"
				on:click={removeImage}
				class="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
				aria-label="Remove image"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{:else}
		<!-- Upload Area -->
		<div
			class="rounded-lg border-2 border-dashed border-stroke p-8 text-center transition-colors {dragOver
				? 'border-main bg-main/5'
				: 'hover:border-main/50'}"
			class:opacity-50={disabled}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			on:drop={handleDrop}
		>
			<svg
				class="mx-auto mb-4 h-12 w-12 text-gray-400"
				stroke="currentColor"
				fill="none"
				viewBox="0 0 48 48"
			>
				<path
					d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>

			<div class="mb-4 text-sm text-gray-600">
				<label
					for="file-upload"
					class="relative cursor-pointer rounded-md font-medium text-main hover:text-main/80"
				>
					<span>Upload an image</span>
					<input
						id="file-upload"
						bind:this={fileInput}
						name="file-upload"
						type="file"
						class="sr-only"
						{accept}
						on:change={handleFileSelect}
						{disabled}
					/>
				</label>
				<p class="pl-1">or drag and drop</p>
			</div>

			<p class="text-xs text-gray-500">
				PNG, JPG, GIF up to {(maxSize / 1024 / 1024).toFixed(1)}MB
			</p>
		</div>
	{/if}

	<!-- Error Message -->
	{#if errorMessage}
		<div class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
			{errorMessage}
		</div>
	{/if}

	<!-- Upload Button (when no image) -->
	{#if !previewUrl}
		<Button type="button" variant="outline" size="sm" on:click={openFileDialog} {disabled}>
			<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
			Choose Image
		</Button>
	{/if}
</div>
