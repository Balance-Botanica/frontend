<template>
  <select v-model="language">
    <option
      v-for="item in locales"
      :key="typeof item === 'object' ? item.code : item"
      :value="typeof item === 'object' ? item.code : item"
    >
      {{ typeof item === "object" ? item.code : item }}
    </option>
  </select>
</template>

<script setup>
import { useProductsStore } from "~/store/products";
import { useI18n } from "vue-i18n";

const { locales, locale, setLocale } = useI18n();
const productsStore = useProductsStore();

const language = computed({
  get: () => locale.value,
  set: async (value) => {
    // const { data: products } = await useFetch(
    //   `${config.public.strapiApiUrl}/api/products?populate=*&locale=${locale.value}`
    // );

    // console.log("yo, after locale change!");

    // await productsStore.fetchProducts();
    setLocale(value);
  },
});
</script>
