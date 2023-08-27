<template>
  <article @click="handleProductClick(props.product)">
    <nuxt-link :to="`/products/${props.product.id}`" class="group">
      <ProductImage
        :product="props.product"
        class="mb-6 transition-transform transform shadow-xl group-hover:scale-105"
      />
      <Heading tag="h3" font-style="h4">
        {{ props.product?.attributes?.Title || "Default Title" }}
      </Heading>
      <p class="text-lg text-brand-grey-400">
        ${{ props.product?.attributes?.Price || 0 }}
      </p>
    </nuxt-link>
  </article>
</template>

<script setup>
import { useProductsStore } from "~/store/products";

const props = defineProps({
  product: Object,
});
const productsStore = useProductsStore();

function handleProductClick(product) {
  productsStore.selectProduct(product);
}
</script>
