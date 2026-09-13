<script lang="ts">
	import type { Snippet } from 'svelte';

	// THE standard page section. Backgrounds always stretch full-bleed,
	// content always sits in .shell (capped at 1920px). Full-bleed decor
	// (glows, blobs) goes into the `decor` snippet so it never fights layout.
	const {
		id = undefined,
		bg = 'bg-transparent',
		pad = 'py-12 md:py-16 lg:py-20',
		labelledby = undefined,
		decor,
		children
	}: {
		id?: string;
		bg?: string;
		pad?: string;
		labelledby?: string;
		decor?: Snippet;
		children: Snippet;
	} = $props();
</script>

<section {id} aria-labelledby={labelledby} class="relative w-full overflow-hidden {bg} {pad}">
	{#if decor}
		{@render decor()}
	{/if}
	<div class="shell relative">
		{@render children()}
	</div>
</section>
