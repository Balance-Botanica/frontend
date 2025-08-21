<script lang="ts">
	import hybridLogo from '$lib/assets/icons/hybrid-logo.svg';

	let { size = 'default', className = '' } = $props<{
		size?: 'small' | 'default' | 'large' | 'custom';
		className?: string;
	}>();

	// Size configurations
	const sizeConfig = {
		small: { width: '120px', height: '35px' },
		default: { width: '180px', height: '53px' },
		large: { width: '240px', height: '71px' },
		custom: { width: 'auto', height: 'auto' }
	};

	const currentSize = sizeConfig[size as keyof typeof sizeConfig];
</script>

<img
	src={hybridLogo}
	alt="Balance Botanica"
	class="inline-block {className}"
	style="width: {currentSize.width}; height: {currentSize.height};"
	aria-label="Balance Botanica Logo"
/>
