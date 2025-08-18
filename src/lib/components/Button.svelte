<script lang="ts">
  import { colors } from '../colors';
  import { typography } from '../typography';
  
  export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let onClick: () => void = () => {};
  
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
  class="inline-flex items-center justify-center font-medium rounded-lg border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed {sizeClasses[size]} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
  style="
    background-color: {currentStyle.backgroundColor};
    color: {currentStyle.color};
    border-color: {currentStyle.borderColor};
    focus-ring-color: {colors.main};
  "
>
  <slot />
</button>
