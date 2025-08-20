<script lang="ts">
	export let emoji: string;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	
	$: iconClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16'
	};
	
	$: innerClasses = {
		sm: 'w-6 h-6',
		md: 'w-8 h-8',
		lg: 'w-12 h-12'
	};
	
	$: textClasses = {
		sm: 'text-sm',
		md: 'text-lg',
		lg: 'text-xl'
	};
</script>

<div class="rounded-full bg-white/20 flex items-center justify-center {iconClasses[size]} flex-shrink-0">
	<div class="rounded-full bg-white flex items-center justify-center {innerClasses[size]}">
		<span class="{textClasses[size]}">{emoji}</span>
	</div>
</div>
