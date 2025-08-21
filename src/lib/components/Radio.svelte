<script lang="ts">
	import { colors } from '../colors';

	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let label: string = '';
	export let name: string = '';
	export let value: string = '';
	export let onChange: (value: string) => void = () => {};

	function handleChange() {
		if (!disabled) {
			onChange(value);
		}
	}
</script>

<div class="flex items-center space-x-3">
	<button
		type="button"
		role="radio"
		aria-checked={checked}
		aria-disabled={disabled}
		{disabled}
		on:click={handleChange}
		class="relative inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
		style="
      border-color: {checked ? colors.main : colors.stroke};
      focus-ring-color: {colors.main};
    "
		class:opacity-50={disabled}
	>
		{#if checked}
			<div class="h-2 w-2 rounded-full" style="background-color: {colors.main};"></div>
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
