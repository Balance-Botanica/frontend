<script lang="ts">
	import { colors } from '../colors';

	const { variant = 'primary', size = 'md', disabled = false, type = 'button', onClick = (() => {}) } = $props<{
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onClick?: () => void;
	}>();

	const sizeClasses = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-4 py-3 text-base',
		lg: 'px-6 py-4 text-lg'
	};

	const variantStyles = {
		primary: {
			backgroundColor: colors.main,
			color: colors.optional,
			borderColor: colors.main
		},
		secondary: {
			backgroundColor: colors.tertiary,
			color: colors.text,
			borderColor: colors.tertiary
		},
		outline: {
			backgroundColor: 'transparent',
			color: colors.main,
			borderColor: colors.main
		},
		ghost: {
			backgroundColor: 'transparent',
			color: colors.text,
			borderColor: 'transparent'
		}
	};

	const currentStyle = variantStyles[variant];
</script>

<button
	{type}
	{disabled}
	on:click={onClick}
	class="inline-flex items-center justify-center rounded-lg border-2 font-medium transition-all duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer {sizeClasses[
		size
	]} {disabled ? 'cursor-not-allowed opacity-50' : ''}"
	style="
    background-color: {currentStyle.backgroundColor};
    color: {currentStyle.color};
    border-color: {currentStyle.borderColor};
  "
>
	<slot />
</button>