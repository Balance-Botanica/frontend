<template>
  <MainTitleSection />
  <AboutUsSection />
  <FeaturesSection />
  <!-- <div>
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
            <p class="pb-4 pr-4 text-brand-gray">
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

   
    <section class="relative mb-20 md:mb-10 border-primary-beige h-auto">
      <div class="features-background h-auto absolute left-0 right-0">
        <FeaturesBackground class="w-full sm:scale-y-[350%] top-[500px]" />
      </div>
     
      <Container class="relative pt-[100px]">
        <div class="w-full mb-12 text-left">
          <FeaturesHeading tag="h1" font-style="h1">
            {{ $t("features_title") }}
          </FeaturesHeading>
        </div>

        <div class="feature-list">
          
          <div class="feature">
            <FeaturesHeading tag="h2" font-style="h2">{{
              $t("feature_no_sugar")
            }}</FeaturesHeading>
            <p>{{ $t("feature_no_sugar_description") }}</p>
          </div>

        
          <div class="feature">
            <FeaturesHeading tag="h2" font-style="h2">{{
              $t("feature_vegan")
            }}</FeaturesHeading>
            <p>{{ $t("feature_vegan_description") }}</p>
          </div>

         
          <div class="feature">
            <FeaturesHeading tag="h2" font-style="h2">{{
              $t("feature_no_restricted")
            }}</FeaturesHeading>
            <p>{{ $t("feature_no_restricted_description") }}</p>
          </div>

        
          <div class="feature">
            <FeaturesHeading tag="h2" font-style="h2">{{
              $t("feature_effective_dosage")
            }}</FeaturesHeading>
            <p>{{ $t("feature_effective_dosage_description") }}</p>
          </div>

          <div class="feature">
            <FeaturesHeading tag="h2" font-style="h2">{{
              $t("feature_made_in_Ukraine")
            }}</FeaturesHeading>
            <p>{{ $t("feature_made_in_Ukraine_description") }}</p>
          </div>
        </div>
      </Container>
     
        :src="featuresBackgroundBottom"
        class="object-cover w-full h-full absolute"
        alt="Pick a sick wick"
      /> 
    </section>

    <section class="mb-28 mt-[200px]">
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

     

        <div class="flex justify-center mt-10">
          <Btn theme="secondary">{{ $t("all_products_view_all") }}</Btn>
        </div>
      </Container>
    </section>
  </div> -->
</template>

<script setup>
import { useNuxtApp } from "#app";
import { computed, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/store/products";
import { useNovaPoshtaStore } from "~/store/nova-poshta";
import { useCartStore } from "~/store/cart";
import MainTitleSection from "~/components/MainTitleSection.vue";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const { locale } = useI18n();
const productsStore = useProductsStore();
const novaPoshtaStore = useNovaPoshtaStore();
const cartStore = useCartStore();

const analytics = nuxtApp.$analytics;
const firebaseApp = nuxtApp.$firebaseApp;

function clearCartAndStorage() {
  cartStore.clearCart();
  localStorage.removeItem("cart");
}

// Fetch products when the component is mounted
onMounted(async () => {
  // await productsStore.fetchProducts();
  // clearCartAndStorage();

  await productsStore.fetchFirebaseProducts();

  // if (process.client) {
  //   logEvent(analytics, "index page opened");
  // }

  console.log("localStorage.getItem(cart)", localStorage.getItem("cart"));

  cartStore.$patch((state) => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      state.items = storedCart.items;
    }
  });

  this.adjustSvgHeight();
  window.onresize = this.adjustSvgHeight;

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

function adjustSvgHeight() {
  const featureList = document.querySelector(".feature-list"); // Replace with your text block's selector
  const svgElement = document.querySelector(".features-background");
  if (featureList && svgElement) {
    const textHeight = featureList.offsetHeight;
    svgElement.setAttribute("height", textHeight + "px");
  }
}

// window.onload = adjustSvgHeight;
// window.onresize = adjustSvgHeight;
</script>

<style scoped>
.header {
  height: 600px;
  /* margin-top: -106px;   */
}

.features-background {
  width: 100vw; /* Full viewport width */
  height: auto; /* Keep aspect ratio */
}

.feature-list {
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
