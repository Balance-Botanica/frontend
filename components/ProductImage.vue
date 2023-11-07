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
  const imageObject =
    props.product?.attributes?.Images?.data[0]?.attributes?.url;

  if (!imageObject) {
    return null;
  }

  // Check if the URL starts with the Firebase storage URL
  if (imageObject.startsWith("https://firebasestorage.googleapis.com")) {
    return imageObject;
  } else {
    // If not, prepend the Strapi API URL
    return `${config.public.strapiApiUrl}${imageObject}`;
  }
});
</script>
