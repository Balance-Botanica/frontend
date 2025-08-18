<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  import { m } from '$lib/paraglide/messages.js';
</script>

<div 
  class="w-full py-3 text-center sticky top-0 z-50"
  style="
    background-color: {colors.main};
    color: {colors.optional};
    font-size: {typography.sizes.base};
    font-weight: {typography.weights.medium};
    line-height: {typography.styles.linkButtonMedium.lineHeight};
  "
>
  {m['subheader.delivery_message']()}
</div>
