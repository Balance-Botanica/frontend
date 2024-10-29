<template>
  <div class="flex flex-col px-[150px] py-[80px] space-y-[40px]">
    <!-- Title and Description Row -->
    <div
      class="flex flex-col lg:flex-row items-start lg:items-center w-full lg:justify-between"
    >
      <h1
        class="text-[48px] font-bold whitespace-nowrap mb-4 lg:mb-0 flex-none"
      >
        {{ $t("about_us_title") }}
      </h1>
      <p
        class="text-[20px] lg:flex-grow lg:max-w-[600px] lg:ml-[20px] xl:ml-[min(400px, 10vw)]"
      >
        {{ $t("about_us_description") }}
      </p>
    </div>

    <!-- Images Row (Grid for larger screens) -->
    <div class="hidden md:flex w-full gap-[24px]">
      <div class="flex-1 max-w-[300px]">
        <img
          :src="Rectangle"
          alt="Rectangle Image"
          class="w-full h-auto rounded-lg"
        />
      </div>
      <div class="flex-1 max-w-[300px]">
        <img
          :src="Rectangle"
          alt="Rectangle Image"
          class="w-full h-auto rounded-lg"
        />
      </div>
      <div class="flex-1 max-w-[300px]">
        <img
          :src="Rectangle"
          alt="Rectangle Image"
          class="w-full h-auto rounded-lg"
        />
      </div>
    </div>

    <!-- Mobile Slider -->
    <div class="md:hidden">
      <swiper :slides-per-view="1" :autoplay="true" class="w-full h-auto">
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img
            :src="image"
            alt="Rectangle Image"
            class="w-full h-auto rounded-lg"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";

import Rectangle from "assets/images/rectangle.png";

const images = [Rectangle, Rectangle, Rectangle];
</script>

<style scoped>
/* No custom CSS needed */
</style>
