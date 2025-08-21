<script lang="ts">
	import { colors } from '../colors';
	import { typography } from '../typography';
	import { t } from '../i18n';
</script>

<div
	class="sticky top-0 z-50 w-full py-3 text-center"
	style="
    background-color: {colors.main};
    color: {colors.optional};
    font-size: {typography.sizes.base};
    font-weight: {typography.weights.medium};
    line-height: {typography.styles.linkButtonMedium.lineHeight};
  "
>
	{t('subheader.delivery_message')}
</div>
