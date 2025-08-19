<script lang="ts">
	import FAQ from '$lib/components/FAQ.svelte';
</script>

<svelte:head>
	<title>FAQ Component Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
			FAQ Component Demo
		</h1>
		
		<div class="mb-8">
			<h2 class="text-xl font-semibold text-gray-800 mb-4">Interactive FAQ Section</h2>
			<p class="text-gray-600 mb-6">
				This demo shows the FAQ component with the first item expanded by default. 
				Click on any question to expand/collapse it. Only one item can be expanded at a time.
			</p>
		</div>
		
		<!-- FAQ Component Demo -->
		<FAQ />
		
		<!-- Component Information -->
		<div class="mt-16 bg-white rounded-lg shadow-lg p-6">
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Component Features</h3>
			<div class="space-y-3 text-sm text-gray-600">
				<ul class="list-disc list-inside space-y-1 ml-4">
					<li><strong>Accordion Behavior:</strong> Only one FAQ item can be expanded at a time</li>
					<li><strong>Default State:</strong> First item is expanded by default</li>
					<li><strong>Accessibility:</strong> Full ARIA support with proper labels and controls</li>
					<li><strong>Responsive Design:</strong> Works perfectly on all screen sizes</li>
					<li><strong>Event Handling:</strong> Dispatches events for analytics and tracking</li>
					<li><strong>Hover Effects:</strong> Smooth transitions and interactive feedback</li>
				</ul>
				
				<p class="mt-4"><strong>Usage:</strong></p>
				<pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<FAQ />

<!-- With custom event handling -->
<FAQ on:faqToggle={(event) => {
  console.log('FAQ toggled:', event.detail);
}} />`}</pre>
			</div>
		</div>
	</div>
</div>
