<script lang="ts">
	import { colors } from '../colors';

	const {
		type = 'text',
		placeholder = '',
		value = '',
		disabled = false,
		required = false,
		name = '',
		id = '',
		onChange = (() => {}),
		onInput = ((event: Event) => {})
	} = $props<{
		type?: 'text' | 'email' | 'password' | 'number';
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
		onChange?: (value: string) => void;
		onInput?: (event: Event) => void;
	}>();

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