<template>
  <Container class="pt-12">
    <div class="pb-8 text-center">
      <Heading tag="h3" font-style="h3">The Shop</Heading>
      <Heading tag="h2" font-style="h2" class="mb-2"
        >All the sick wicks</Heading
      >
      <p
        class="w-3/4 px-4 pb-4 mx-auto text-center lg:w-2/6 text-brand-grey-400"
      >
        All our candles our hand made and 100% verified to satisfy any
        pyromaniac’s itch to burn things in a safe way.
      </p>
    </div>
    <div class="grid grid-cols-2 gap-12 px-4 mb-24 md:grid-cols-4">
      <ProductTeaser
        class="col-span-1"
        v-for="product in displayedProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </Container>
</template>

<script setup>
import { useProductsStore } from "~/store/products";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const config = useRuntimeConfig();
const productsStore = useProductsStore();

// const { data: products } = await useFetch(
//   `${config.public.strapiApiUrl}/api/products?populate=*`
// );

onMounted(async () => {
  await productsStore.fetchFirebaseProducts();
});

const displayedProducts = computed(() => {
  return locale.value.startsWith("en")
    ? productsStore.productsEN
    : productsStore.productsUA;
});
</script>

<style scoped>
.header {
  height: 600px;
}
.hero-box {
  top: 100px;
  left: 0px;
  width: 100%;
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
  .header-content {
    margin-top: -10px;
  }
}
.home-head-image {
  top: -110px;
  height: 700px;
  width: 100%;
}

@screen md {
  .home-head-image {
    top: -110px;
    height: 770px;
    width: 100%;
  }
}

.hero-box {
  top: 100px;
  left: 0px;
  width: 100%;
}

@screen md {
  .hero-box {
    left: 10%;
    top: 200px;
    width: 485px;
  }
}
@screen sm {
  .shop-btn {
    /* right: -11px;
      bottom: -15px; */
  }
}
@screen md {
  .shop-btn {
    right: 20px;
    bottom: 16px;
  }
}
</style>
