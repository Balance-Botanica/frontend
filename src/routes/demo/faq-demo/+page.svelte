<script lang="ts">
	import FAQ from '$lib/components/FAQ.svelte';
</script>

<svelte:head>
	<title>FAQ Component Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">FAQ Component Demo</h1>

		<div class="mb-8">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Interactive FAQ Section</h2>
			<p class="mb-6 text-gray-600">
				This demo shows the FAQ component with the first item expanded by default. Click on any
				question to expand/collapse it. Only one item can be expanded at a time.
			</p>
		</div>

		<!-- FAQ Component Demo -->
		<FAQ />

		<!-- Component Information -->
		<div class="mt-16 rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-4 text-lg font-semibold text-gray-800">Component Features</h3>
			<div class="space-y-3 text-sm text-gray-600">
				<ul class="ml-4 list-inside list-disc space-y-1">
					<li><strong>Accordion Behavior:</strong> Only one FAQ item can be expanded at a time</li>
					<li><strong>Default State:</strong> First item is expanded by default</li>
					<li><strong>Accessibility:</strong> Full ARIA support with proper labels and controls</li>
					<li><strong>Responsive Design:</strong> Works perfectly on all screen sizes</li>
					<li><strong>Event Handling:</strong> Dispatches events for analytics and tracking</li>
					<li><strong>Hover Effects:</strong> Smooth transitions and interactive feedback</li>
				</ul>

				<p class="mt-4"><strong>Usage:</strong></p>
				<pre class="overflow-x-auto rounded bg-gray-100 p-3 text-xs">
{`<FAQ />

<!-- With custom event handling -->
<FAQ on:faqToggle={(event) => {
  console.log('FAQ toggled:', event.detail);
}} />`}</pre>
			</div>
		</div>
	</div>
</div>
