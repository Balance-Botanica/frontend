<script lang="ts">
	import pawHybrid from '$lib/assets/icons/paw-hybrid.svg';

	const {
		patternCount = 25,
		opacity = 0.15,
		className = '',
		density = 'medium' // 'sparse', 'medium', 'dense'
	} = $props<{
		patternCount?: number;
		opacity?: number;
		className?: string;
		density?: 'sparse' | 'medium' | 'dense';
	}>();

	// Density configurations for different space-filling patterns
	const densityConfig = {
		sparse: { minSize: 40, maxSize: 80, overlap: 0.1 },
		medium: { minSize: 30, maxSize: 70, overlap: 0.2 },
		dense: { minSize: 20, maxSize: 60, overlap: 0.3 }
	};

	const config = densityConfig[density as keyof typeof densityConfig];

	// Generate fluffy, cloudy pattern positions with smart spacing
	const patterns = Array.from({ length: patternCount }, (_, i) => {
		// Create more natural, organic distribution
		const angle = (i / patternCount) * Math.PI * 2;
		const radius = 30 + Math.random() * 40; // Vary distance from center

		// Add some randomness to create fluffy, cloudy effect
		const randomOffset = (Math.random() - 0.5) * 20;
		const left = 50 + Math.cos(angle) * radius + randomOffset;
		const top = 50 + Math.sin(angle) * radius + randomOffset;

		return {
			id: i,
			// Smart positioning to avoid too much overlap
			left: Math.max(0, Math.min(100, left)),
			top: Math.max(0, Math.min(100, top)),
			// Varied sizes for fluffy effect
			size: config.minSize + Math.random() * (config.maxSize - config.minSize),
			// Random rotation for natural look
			rotation: Math.random() * 360,
			// Varied opacity for depth
			patternOpacity: opacity * (0.6 + Math.random() * 0.8),
			// Random scale variation for fluffy effect
			scale: 0.8 + Math.random() * 0.4,
			// Random delay for subtle animation
			delay: Math.random() * 3,
			// Random animation duration for organic movement
			duration: 4 + Math.random() * 3
		};
	});
</script>

<div class={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}>
	{#each patterns as pattern (pattern.left + pattern.top)}
		<div
			class="absolute transition-all duration-1000 ease-out"
			style="
				left: {pattern.left}%; 
				top: {pattern.top}%; 
				width: {pattern.size}px; 
				height: {pattern.size}px;
				opacity: {pattern.patternOpacity};
				transform: rotate({pattern.rotation}deg) scale({pattern.scale});
				animation-delay: {pattern.delay}s;
				animation-duration: {pattern.duration}s;
			"
		>
			<img
				src={pawHybrid}
				alt=""
				class="h-full w-full object-contain"
				style="filter: brightness(1.1) contrast(1.2) saturate(1.1);"
			/>
		</div>
	{/each}
</div>

<style>
	/* Fluffy, floating animation */
	div {
		animation: fluffyFloat ease-in-out infinite;
	}

	@keyframes fluffyFloat {
		0%,
		100% {
			transform: translateY(0px) translateX(0px) rotate(var(--rotation)) scale(var(--scale));
		}
		25% {
			transform: translateY(-8px) translateX(3px) rotate(var(--rotation)) scale(var(--scale));
		}
		50% {
			transform: translateY(-12px) translateX(-2px) rotate(var(--rotation)) scale(var(--scale));
		}
		75% {
			transform: translateY(-6px) translateX(5px) rotate(var(--rotation)) scale(var(--scale));
		}
	}
</style>
