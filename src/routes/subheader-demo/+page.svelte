<script lang="ts">
	import SubHeader from '$lib/components/SubHeader.svelte';
</script>

<svelte:head>
	<title>SubHeader Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen p-6" style="background-color: #F8F7F6;">
	<div class="max-w-4xl mx-auto">
		<header class="text-center mb-12">
			<h1 class="text-5xl font-semibold mb-4" style="color: #4B766E;">
				SubHeader Component
			</h1>
			<p class="text-xl" style="color: #474747;">
				Delivery Information Banner
			</p>
		</header>
		
		<div class="space-y-8">
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Default SubHeader
				</h2>
				<div class="bg-white rounded-lg p-6 shadow-lg">
					<SubHeader />
				</div>
			</section>
			
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Custom Message SubHeader
				</h2>
				<div class="bg-white rounded-lg p-6 shadow-lg">
					<SubHeader message="🚚 Швидка доставка по всій Україні! Доставка 1-2 дні 📦" />
				</div>
			</section>
			
			<section>
				<h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
					Promotional SubHeader
				</h2>
				<div class="bg-white rounded-lg p-6 shadow-lg">
					<SubHeader message="🎉 Акція! Знижка 20% на всі товари до кінця тижня! 🎉" />
				</div>
			</section>
		</div>
		
		<div class="mt-12 text-center">
			<a 
				href="/" 
				class="inline-block px-6 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
				style="color: #4B766E; border: 2px solid #4B766E;"
			>
				← Повернутися на головну
			</a>
		</div>
	</div>
</div>
