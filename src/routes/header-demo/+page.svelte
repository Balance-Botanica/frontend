<script lang="ts">
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Header Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen p-6" style="background-color: #F8F7F6;">
	<div class="max-w-4xl mx-auto">
		<header class="text-center mb-12">
			<h1 class="text-5xl font-semibold mb-4" style="color: #4B766E;">
				Header Component
			</h1>
			<p class="text-xl" style="color: #474747;">
				Main Navigation & Language Switcher
			</p>
		</header>
		
		<div class="space-y-8">
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Header with Navigation
				</h2>
				<div class="bg-white rounded-lg shadow-lg overflow-hidden">
					<Header />
				</div>
			</section>
			
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Features
				</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="bg-white p-6 rounded-lg shadow-lg">
						<h3 class="text-xl font-semibold mb-3" style="color: #4B766E;">
							Logo & Branding
						</h3>
						<p style="color: #474747;">
							Uses the logo-text.svg from assets/icons for consistent branding
						</p>
					</div>
					
					<div class="bg-white p-6 rounded-lg shadow-lg">
						<h3 class="text-xl font-semibold mb-3" style="color: #4B766E;">
							Navigation Menu
						</h3>
						<p style="color: #474747;">
							Center navigation with links to Shop, About, Contacts, and Blog
						</p>
					</div>
					
					<div class="bg-white p-6 rounded-lg shadow-lg">
						<h3 class="text-xl font-semibold mb-3" style="color: #4B766E;">
							Language Switcher
						</h3>
						<p style="color: #474747;">
							Toggle between Ukrainian (🇺🇦 Укр) and English (🇬🇧 En) with emoji flags
						</p>
					</div>
					
					<div class="bg-white p-6 rounded-lg shadow-lg">
						<h3 class="text-xl font-semibold mb-3" style="color: #4B766E;">
							Action Icons
						</h3>
						<p style="color: #474747;">
							Person/account and cart icons with hover effects and brand colors
						</p>
					</div>
				</div>
			</section>
			
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Design System Integration
				</h2>
				<div class="bg-white p-6 rounded-lg shadow-lg">
					<ul class="space-y-2" style="color: #474747;">
						<li>• Uses brand colors from the color palette</li>
						<li>• Typography system for consistent text styling</li>
						<li>• Responsive design with mobile considerations</li>
						<li>• Hover effects and transitions for better UX</li>
						<li>• Accessible with proper ARIA labels</li>
					</ul>
				</div>
			</section>
		</div>
	</div>
</div>
