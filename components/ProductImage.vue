<template>
  <div class="bg-gray-100 shadow-xl aspect-w-1 aspect-h-1">
    <img
      :src="imageUrl"
      :alt="props.product?.attributes?.Title"
      loading="lazy"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object,
  imageUrl: String,
});

const config = useRuntimeConfig();

const imageUrl = computed(() => {
  if (!props.product) {
    return null;
  }
  return `${config.public.API_URL}${props?.product?.attributes?.Images?.data[0]?.attributes?.url}`;
});
</script>
