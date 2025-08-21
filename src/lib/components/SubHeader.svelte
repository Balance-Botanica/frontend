<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { t } from '../i18n';

	let isVisible = $state(true);

	function handleClose() {
		isVisible = false;
	}
</script>

{#if isVisible}
	<div
		class="sticky top-0 z-50 w-full py-3 text-center relative"
		style="
      background-color: {colors.main};
      color: {colors.optional};
      font-size: {typography.sizes.base};
      font-weight: {typography.weights.medium};
      line-height: {typography.styles.linkButtonMedium.lineHeight};
    "
	>
		{t('subheader.delivery_message')}
		
		<!-- Close button -->
		<button
			onclick={handleClose}
			class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
			aria-label="Close delivery message"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
{/if}
