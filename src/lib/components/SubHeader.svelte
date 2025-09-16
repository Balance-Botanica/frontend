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
		class="relative sticky top-0 z-50 w-full py-3 text-center"
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
			class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-white/80 transition-colors duration-200 hover:text-white"
			aria-label="Close delivery message"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	</div>
{/if}
