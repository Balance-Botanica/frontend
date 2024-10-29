<template>
  <NuxtLayout>
    <Title> {{ $t("title") }}</Title>
    <NuxtPage
  /></NuxtLayout>
</template>

<style>
body {
  @apply font-body
  /* @apply text-brand-grey bg-primary-beige; */;
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
