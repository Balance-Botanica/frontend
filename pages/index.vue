<template>
  <div>
    <section
      class="relative mb-20 -mt-24 border-b-4 md:mb-10 header border-brand-beige"
    >
      <div class="absolute inset-0 z-0 overflow-hidden">
        <img
          :src="HeaderBg"
          class="object-cover w-full h-full"
          alt="Pick a sick wick"
        />
      </div>

      <div class="relative z-20 h-full header-content">
        <div class="absolute flex flex-col justify-center p-8 mx-auto hero-box">
          <div class="relative px-6 py-8 bg-white rounded-lg drop-shadow-2xl">
            <Heading tag="h3" font-style="h3">{{
              $t("action_subtitle")
            }}</Heading>
            <Heading tag="h2" font-style="h2">
              {{ $t("action_title") }}</Heading
            >
            <p class="pb-4 pr-4 text-brand-gray font-body">
              {{ $t("action_description") }}
            </p>
            <nuxt-link to="/shop">
              <Btn class="absolute md:-right-3 md:-bottom-3">{{
                $t("action_shop_now")
              }}</Btn></nuxt-link
            >
          </div>
        </div>
      </div>
    </section>

    <section class="mb-28">
      <Container>
        <div class="w-full mx-auto mb-12 text-center md:w-2/3 lg:w-2/3">
          <Heading tag="h2" font-style="h3">{{
            $t("all_products_subtitle")
          }}</Heading>
          <Heading tag="h3" font-style="h2" class="mb-2">{{
            $t("all_products_title")
          }}</Heading>
          <p>
            {{ $t("all_products_description") }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12 md:grid-cols-4 asdasd">
          <ProductTeaser
            class="col-span-1"
            v-for="product in displayedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- <div>{{ JSON.stringify(displayedProducts) }}</div> -->

        <div class="flex justify-center mt-10">
          <Btn theme="secondary">{{ $t("all_products_view_all") }}</Btn>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
import { useNuxtApp } from "#app";
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/store/products";
import { useNovaPoshtaStore } from "~/store/nova-poshta";
import HeaderBg from "assets/images/header-bg.jpg";
import { logEvent } from "firebase/analytics";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const { locale } = useI18n();
const productsStore = useProductsStore();
const novaPoshtaStore = useNovaPoshtaStore();

const analytics = nuxtApp.$analytics;
const firebaseApp = nuxtApp.$firebaseApp;

// Fetch products when the component is mounted
onMounted(async () => {
  await productsStore.fetchProducts();

  if (process.client) {
    logEvent(analytics, "index page opened");
  }

  // await novaPoshtaStore.fetchWarehouses();
});

// console.log("novaPoshtaStore.allCargoTypes:", novaPoshtaStore.allCargoTypes);

// Determine which products to display based on the current locale
const displayedProducts = computed(() => {
  return locale.value.startsWith("en")
    ? productsStore.productsEN
    : productsStore.productsUA;
});

// console.log(
//   "Products fetched in Index:",
//   productsStore.productsEN,
//   productsStore.productsUA
// );
</script>

<style scoped>
.header {
  height: 600px;
  /* margin-top: -106px;   */
}

@screen md {
  .hero-box {
    left: 10%;
    top: 175px;
    width: 485px;
  }
}
@screen md {
  .header {
    height: 700px;
  }
}

@screen md {
  .home-head-image {
    top: -110px;
    height: 770px;
    width: 100%;
  }
}

.hero-box {
  bottom: -50px;
  left: 0px;
  width: 100%;
}

@screen md {
  .hero-box {
    left: 10%;
    top: 100px;
    width: 485px;
  }
}
</style>
