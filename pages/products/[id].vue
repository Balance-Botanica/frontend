<template>
  <div>
    <!-- <div>asdasd</div>
    <div>{{ JSON.stringify(product) }}</div>
    <div>asdasd !!!!!!!!!!!!!!!!!!!!!</div> -->
    <Container class="grid grid-cols-12 gap-2 pt-32 pb-24 md:gap-12">
      <div class="col-span-12 md:col-span-6 lg:col-span-5">
        <ProductImage :product="product" />
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-7">
        <Heading tag="h2" font-style="h1">{{
          product?.attributes?.Title || "Default title"
        }}</Heading>
        <p class="mb-6 text-2xl text-brand-grey-600">
          ${{ product?.attributes?.Price || 0 }}
        </p>
        <p class="pr-12 mb-6 text-brand-grey-400">
          {{ product?.attributes?.Description || "Description" }}
        </p>

        <div class="flex items-center">
          <input-field type="number" class="mr-4" min="1" v-model="quantity" />
          <!-- <Btn
            class="snipcart-add-item"
            :data-item-id="product.attributes?.id"
            :data-item-price="product.attributes?.Price"
            :data-item-description="product.attributes?.Description"
            :data-item-name="product.attributes.Title"
            :data-item-image="imageUrl"
            :data-item-quantity="quantity"
            :modelValue="pageTitle"
            @update:modelValue="pageTitle = $event"
            >Add to basket</Btn
          > -->
          <Btn class="">Add to basket</Btn>
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
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useProductsStore } from "~/store/products";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const productsStore = useProductsStore();
const route = useRoute();

const displayedProducts = computed(() => {
  return locale.value.startsWith("en")
    ? productsStore.productsEN
    : productsStore.productsUA;
});

const product = computed(() => {
  if (!productsStore.productsEN.length && !productsStore.productsUA.length) {
    return null; // Return null if products data is not ready yet.
  }

  const productId = parseInt(route.params.id, 10);
  console.log("Searching for product with ID:", productId);

  let foundProduct = null;
  if (locale.value.startsWith("en")) {
    foundProduct = productsStore.productsEN.find((p) => p.id === productId);
  } else {
    foundProduct = productsStore.productsUA.find((p) => p.id === productId);
  }

  console.log("Found product:", foundProduct);
  return foundProduct;
});
</script>

<style scoped>
.product-image {
  width: 545px;
}
</style>
