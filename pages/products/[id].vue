<template>
  <div>
    <!-- ... other parts of your template ... -->
    <Container class="grid grid-cols-12 gap-2 pt-32 pb-24 md:gap-12">
      <div class="col-span-12 md:col-span-6 lg:col-span-5">
        <ProductImage :product="product" />
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-7">
        <Heading tag="h2" font-style="h1">{{
          product?.attributes?.Title || ""
        }}</Heading>
        <p class="mb-6 text-2xl text-brand-grey-600">
          {{ product?.attributes?.Price || "" }}
        </p>
        <p class="pr-12 mb-6 text-brand-grey-400">
          {{ product?.attributes?.Description || "" }}
        </p>

        <div class="flex items-center">
          <input-field type="number" class="mr-4" min="1" v-model="quantity" />
          <Btn @click="addToCart">Add to basket</Btn>
        </div>
      </div>
    </Container>
    <Container>
      <div class="pb-8">
        <Heading tag="h3" font-style="h3">Related products</Heading>
        <Heading tag="h2" font-style="h2">Other sick wicks</Heading>
      </div>
      <div class="grid grid-cols-2 gap-12 md:grid-cols-4">
        <ProductTeaser
          class="col-span-1"
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <div class="flex justify-center pt-12 pb-32">
        <Btn theme="secondary">View the other sick wicks</Btn>
      </div>
    </Container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/store/products";
import { useCartStore } from "~/store/cart";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const route = useRoute();
const quantity = ref(1);

// ... other parts of your script setup ...

onMounted(async () => {
  // If products aren't available in the store, fetch them
  if (!productsStore.productsEN.length && !productsStore.productsUA.length) {
    await productsStore.fetchProducts();
  }
});

const product = computed(() => {
  console.log(
    "Selected Product ID in ID page:",
    productsStore.selectedProductId
  );
  // If the product is already stored in the state, use it
  if (productsStore.currentProduct) {
    return productsStore.currentProduct;
  }

  // Otherwise, fetch the product using the route ID
  const productId = parseInt(route.params.id, 10);
  return locale.value.startsWith("en")
    ? productsStore.productsEN.find((p) => p.id === productId)
    : productsStore.productsUA.find((p) => p.id === productId);
});

const displayedProducts = computed(() => {
  return locale.value.startsWith("en")
    ? productsStore.productsEN
    : productsStore.productsUA;
});

const addToCart = () => {
  const productToAdd = {
    id: product.value.id,
    title: product.value.attributes.Title,
    price: product.value.attributes.Price,
    quantity: quantity.value,
  };
  console.log("Adding product to cart:", productToAdd);
  cartStore.addToCart(productToAdd);
};

console.log("Selected Product ID in ID page:", productsStore.selectedProductId);
</script>

<style scoped>
.product-image {
  width: 545px;
}
</style>
