<script lang="ts">
	import { colors } from '../colors';

	export let type: 'text' | 'email' | 'password' | 'number' = 'text';
	export let placeholder: string = '';
	export let value: string = '';
	export let disabled: boolean = false;
	export let required: boolean = false;
	export let name: string = '';
	export let id: string = '';
	export let onChange: (value: string) => void = () => {};
	export let onInput: (event: Event) => void = () => {};

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onChange(target.value);
		onInput(event);
	}
</script>

<input
	{type}
	{placeholder}
	{value}
	{disabled}
	{required}
	{name}
	{id}
	on:input={handleInput}
	class="w-full rounded-lg border-2 px-4 py-3 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
	style="
    border-color: {colors.stroke};
    background-color: {colors.optional};
    color: {colors.text};
    focus-ring-color: {colors.main};
  "
	class:border-main={value && !disabled}
	class:border-destructive={required && !value}
/>
