<script lang="ts">
	import { colors } from '../colors';

	export let checked: boolean = false;
	export let disabled: boolean = false;
	export let label: string = '';
	export let onChange: (checked: boolean) => void = () => {};
	export let variant: 'default' | 'cookie' = 'default';

	// Generate a unique ID for accessibility
	const switchId = 'switch-' + Math.random().toString(36).substr(2, 9);

	function handleToggle() {
		if (!disabled) {
			onChange(!checked);
		}
	}

	// Add keyboard event handler for accessibility
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleToggle();
		}
	}
</script>

<div class="flex items-center space-x-3">
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-disabled={disabled}
		aria-labelledby={label ? switchId + '-label' : undefined}
		{disabled}
		onclick={handleToggle}
		onkeydown={handleKeyDown}
		class="relative inline-flex h-8 w-[52px] cursor-pointer items-center rounded-full transition-all duration-200 ease-in-out"
		style="
      background-color: {variant === 'cookie'
			? checked
				? '#f97316'
				: '#4b5563'
			: checked
				? colors.main
				: colors.tertiary};
    "
		class:opacity-50={disabled}
		class:cursor-not-allowed={disabled}
	>
		<!-- Background -->
		<div
			class="absolute inset-0 rounded-full transition-colors duration-200 ease-in-out"
			style="background-color: {variant === 'cookie'
				? checked
					? '#f97316'
					: '#4b5563'
				: checked
					? colors.main
					: colors.tertiary};"
		></div>

		<!-- Knob -->
		<div
			class="absolute top-1/2 size-6 rounded-full bg-white shadow-md transition-all duration-200 ease-in-out"
			style="
				left: {checked ? '26px' : '2px'};
				transform: translateY(-50%);
			"
		></div>
	</button>

	{#if label}
		<label
			id={switchId + '-label'}
			class="cursor-pointer text-sm font-medium transition-colors duration-200 select-none"
			style="color: {disabled ? colors.primary : colors.text};"
			class:cursor-not-allowed={disabled}
		>
			{label}
		</label>
	{/if}
</div>

<style>
	/* Полностью убираем все focus стили */
	button:focus {
		outline: none !important;
		box-shadow: none !important;
		ring: none !important;
	}

	/* Убираем любые возможные focus кольца от Tailwind */
	button:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
</style>
