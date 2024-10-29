<template>
  <div class="flex flex-wrap items-center px-[150px] py-[60px]">
    <!-- Text Section -->
    <div
      class="w-full md:w-1/2 text-center md:text-left md:mb-[60px] md:pr-[30px]"
    >
      <h1 class="text-2xl font-bold mb-[24px]">{{ $t("main_title") }}</h1>
      <p class="mb-[40px]">{{ $t("main_description") }}</p>
      <button
        class="bg-black py-[15.5px] px-[54.5px] text-white rounded-action-btn"
      >
        {{ $t("action_shop_now") }}
      </button>
    </div>

    <!-- Image Section -->
    <div class="w-full md:w-1/2 md:pl-[30px]">
      <img :src="Rectangle" alt="Image" class="w-full h-auto" />
    </div>
  </div>
</template>

<script setup>
import Rectangle from "assets/images/rectangle.png";
</script>

<style scoped>
/* No custom CSS needed */
</style>
