<script lang="ts">
	import { colors } from '../colors';

	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let label: string = '';
	export let onChange: (checked: boolean) => void = () => {};

	function handleChange() {
		if (!disabled) {
			onChange(!checked);
		}
	}
</script>

<div class="flex items-center space-x-3">
	<button
		type="button"
		role="checkbox"
		aria-checked={checked}
		aria-disabled={disabled}
		{disabled}
		on:click={handleChange}
		class="relative inline-flex h-6 w-6 items-center justify-center rounded border-2 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
		style="
      border-color: {checked ? colors.main : colors.stroke};
      background-color: {checked ? colors.main : 'transparent'};
      focus-ring-color: {colors.main};
    "
		class:opacity-50={disabled}
	>
		{#if checked}
			<svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
			</svg>
		{/if}
	</button>

	{#if label}
		<label
			class="cursor-pointer text-sm font-medium select-none"
			style="color: {disabled ? colors.primary : colors.text};"
			class:cursor-not-allowed={disabled}
			on:click={!disabled ? handleChange : undefined}
		>
			{label}
		</label>
	{/if}
</div>
