<template>
  <NuxtLayout>
    <Title>Balance Botanica - CBD Gummies made in Ukraine</Title>
    <NuxtPage
  /></NuxtLayout>
</template>

<style>
body {
  @apply text-brand-grey bg-brand-beige-300;
}

.snipcart-modal__container {
  z-index: 100;
}
</style>

<script setup>
const router = useRouter();

// Scroll to top after each navigation
router.afterEach(() => {
  window.scrollTo(0, 0);
});
</script>
