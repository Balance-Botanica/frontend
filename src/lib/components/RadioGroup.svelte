<script lang="ts">
  import Radio from './Radio.svelte';
  
  export let options: Array<{ value: string; label: string }> = [];
  export let value: string = '';
  export let name: string = '';
  export let disabled: boolean = false;
  export let onChange: (value: string) => void = () => {};
  
  function handleRadioChange(selectedValue: string) {
    onChange(selectedValue);
  }
</script>

<div class="space-y-3">
  {#each options as option}
    <Radio
      name={name}
      value={option.value}
      label={option.label}
      checked={value === option.value}
      disabled={disabled}
      onChange={handleRadioChange}
    />
  {/each}
</div>
