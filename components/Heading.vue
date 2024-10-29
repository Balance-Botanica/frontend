<template>
  <component :is="tag" v-bind="$attrs" :class="classes">
    <slot />
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
  fontStyle: {
    type: String,
    required: false,
    default: "h1",
    validator: (value) => ["h1", "h2", "h3", "h4"].includes(value),
  },
  color: {
    type: String,
    required: false,
  },
});

const classes = computed(() => {
  const styleClasses = {
    h1: "lg:text-5xl md:text-4xl sm:text-3xl font-bold tracking-tighter leading-none",
    h2: "lg:text-4xl md:text-3xl sm:text-2xl font-bold tracking-tighter leading-none",
    h3: "lg:text-3xl md:text-2xl sm:text-xl font-extralight font-bold",
    h4: "lg:text-2xl md:text-xl sm:text-lg font-bold tracking-tighter leading-none",
  };
  return `${styleClasses[props.fontStyle]} ${props.color ? props.color : ""}`;
});
</script>

<style scoped>
/* No custom CSS needed */
</style>
