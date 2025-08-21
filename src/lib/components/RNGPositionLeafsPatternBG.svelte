<script lang="ts">
	import shadowLogo1Mirrored from '$lib/assets/icons/shadow_logo_mirrored.svg';
	import shadowLogo2Mirrored from '$lib/assets/icons/shadow_logo2_mirrored.svg';

	let {
		leafCount = 8,
		opacity = 0.3,
		className = ''
	} = $props<{
		leafCount?: number;
		opacity?: number;
		className?: string;
	}>();

	// Available patterns - now using the mirrored versions
	const patterns = [shadowLogo1Mirrored, shadowLogo2Mirrored];

	// Generate random positions and rotations for leaves
	const leaves = Array.from({ length: leafCount }, (_, i) => ({
		id: i,
		// Random position within the container
		left: Math.random() * 100,
		top: Math.random() * 100,
		// Random size between 100px and 300px for fine print effect
		size: 100 + Math.random() * 200,
		// Random rotation between -45 and 45 degrees
		rotation: -45 + Math.random() * 90,
		// Random opacity variation - increased base opacity
		leafOpacity: opacity * (0.8 + Math.random() * 0.4),
		// Randomly choose between the two mirrored patterns
		pattern: patterns[Math.floor(Math.random() * patterns.length)],
		// Random delay for subtle animation
		delay: Math.random() * 2
	}));
</script>

<div class={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}>
	{#each leaves as leaf, _index}
		<div
			class="absolute transition-all duration-1000 ease-out"
			style="
				left: {leaf.left}%; 
				top: {leaf.top}%; 
				width: {leaf.size}px; 
				height: {leaf.size}px;
				opacity: {leaf.leafOpacity};
				transform: rotate({leaf.rotation}deg);
				animation-delay: {leaf.delay}s;
			"
		>
			<img
				src={leaf.pattern}
				alt=""
				class="h-full w-full object-contain"
				style="filter: brightness(1.1) contrast(1.8) saturate(1.3);"
			/>
		</div>
	{/each}
</div>

<style>
	/* Subtle floating animation */
	div {
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(var(--rotation));
		}
		50% {
			transform: translateY(-10px) rotate(var(--rotation));
		}
	}
</style>
