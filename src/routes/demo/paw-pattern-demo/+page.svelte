<script lang="ts">
	import PawHybridPatternBG from '$lib/components/PawHybridPatternBG.svelte';
</script>

<svelte:head>
	<title>Paw Pattern Background Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
			Paw Pattern Background Demo
		</h1>
		
		<div class="space-y-8">
			<!-- Sparse Density Demo -->
			<div class="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
				<PawHybridPatternBG patternCount={15} opacity={0.1} density="sparse" />
				<div class="relative z-10 p-6">
					<h2 class="text-xl font-semibold text-gray-800 mb-2">Sparse Density</h2>
					<p class="text-gray-600">Light, airy pattern with minimal overlap</p>
				</div>
			</div>
			
			<!-- Medium Density Demo -->
			<div class="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
				<PawHybridPatternBG patternCount={35} opacity={0.12} density="medium" />
				<div class="relative z-10 p-6">
					<h2 class="text-xl font-semibold text-gray-800 mb-2">Medium Density</h2>
					<p class="text-gray-600">Balanced pattern with moderate coverage</p>
				</div>
			</div>
			
			<!-- Dense Density Demo -->
			<div class="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
				<PawHybridPatternBG patternCount={50} opacity={0.08} density="dense" />
				<div class="relative z-10 p-6">
					<h2 class="text-xl font-semibold text-gray-800 mb-2">Dense Density</h2>
					<p class="text-gray-600">Rich, full pattern with maximum coverage</p>
				</div>
			</div>
			
			<!-- Custom Configuration Demo -->
			<div class="relative h-64 bg-white rounded-lg shadow-lg overflow-hidden">
				<PawHybridPatternBG patternCount={40} opacity={0.15} density="medium" />
				<div class="relative z-10 p-6">
					<h2 class="text-xl font-semibold text-gray-800 mb-2">Custom Configuration</h2>
					<p class="text-gray-600">40 patterns with 0.15 opacity for rich texture</p>
				</div>
			</div>
		</div>
		
		<!-- Usage Instructions -->
		<div class="mt-12 bg-white rounded-lg shadow-lg p-6">
			<h3 class="text-lg font-semibold text-gray-800 mb-4">Usage Instructions</h3>
			<div class="space-y-3 text-sm text-gray-600">
				<p><strong>Props:</strong></p>
				<ul class="list-disc list-inside space-y-1 ml-4">
					<li><code>patternCount</code>: Number of paw patterns (default: 25)</li>
					<li><code>opacity</code>: Base opacity (default: 0.15)</li>
					<li><code>density</code>: 'sparse', 'medium', or 'dense' (default: 'medium')</li>
					<li><code>className</code>: Additional CSS classes</li>
				</ul>
				
				<p class="mt-4"><strong>Example:</strong></p>
				<pre class="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`<PawHybridPatternBG 
  patternCount={35} 
  opacity={0.12} 
  density="medium" 
/>`}</pre>
			</div>
		</div>
	</div>
</div>
