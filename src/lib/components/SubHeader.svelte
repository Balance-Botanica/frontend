<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  
  export let message: string = 'Замовлення від 1000 UAH доставляются безкоштовно 📦';
</script>

<div 
  class="w-full py-3 text-center"
  style="
    background-color: {colors.main};
    color: {colors.optional};
    font-size: {typography.sizes.base};
    font-weight: {typography.weights.medium};
    line-height: {typography.styles.linkButtonMedium.lineHeight};
  "
>
  {message}
</div>
