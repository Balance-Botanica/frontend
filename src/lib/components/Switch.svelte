<script lang="ts">
  import { colors } from '../colors';
  
  export let checked: boolean = false;
  export let disabled: boolean = false;
  export let label: string = '';
  export let onChange: (checked: boolean) => void = () => {};
  
  function handleToggle() {
    if (!disabled) {
      onChange(!checked);
    }
  }
</script>

<div class="flex items-center space-x-3">
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-disabled={disabled}
    disabled={disabled}
    on:click={handleToggle}
    class="relative inline-flex h-8 w-13 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
    style="
      background-color: {checked ? colors.main : colors.tertiary};
      focus-ring-color: {colors.main};
    "
    class:opacity-50={disabled}
  >
    <span
      class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out"
      style="transform: translateX({checked ? '20px' : '2px'});"
    ></span>
  </button>
  
  {#if label}
    <label 
      class="text-sm font-medium cursor-pointer select-none"
      style="color: {disabled ? colors.primary : colors.text};"
      class:cursor-not-allowed={disabled}
      on:click={!disabled ? handleToggle : undefined}
    >
      {label}
    </label>
  {/if}
</div>
