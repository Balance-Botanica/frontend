<template>
  <Container>
    <!-- Cart is not empty -->
    <div v-if="cartItems > 0" class="flex flex-col md:flex-row mt-20">
      <!-- Products Table -->
      <div class="w-full md:w-2/3">
        <div class="mb-4">
          <Heading tag="h2" font-style="h2">ТОВАР</Heading>
          <div class="border-b-2 py-2" v-for="item in cartItems" :key="item.id">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img :src="item.image" alt="item.title" class="h-16" />
                <span class="ml-4">{{ item.title }}</span>
              </div>
              <div>{{ item.price }} грн</div>
              <div class="flex items-center">
                <button @click="decrement(item)">-</button>
                <input
                  type="text"
                  class="mx-2 border text-center w-8"
                  v-model="item.quantity"
                />
                <button @click="increment(item)">+</button>
              </div>
              <div>{{ item.quantity * item.price }} грн</div>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <input type="text" placeholder="Промокод" class="border p-2" />
          <Btn>Застосувати промокод</Btn>
        </div>
      </div>

      <!-- Total Summary -->
      <div class="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6">
        <div class="border p-4 rounded-lg shadow-md bg-white">
          <p class="font-bold">СУМА</p>
          <div class="flex justify-between py-2">
            <span>Підсумок</span>
            <span>{{ totalPrice }} грн</span>
          </div>
          <div class="flex justify-between py-2 font-bold border-t-2">
            <span>Загалом</span>
            <span>{{ totalPrice }} грн</span>
          </div>
          <nuxt-link to="/checkout" class="mt-4">
            <Btn class="w-full">Перейти до оформлення</Btn>
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- If cart is empty -->
    <div v-else-if="cartItems == 0" class="text-center mt-20">
      <IconsCart class="w-24 mx-auto mb-4" />
      <Heading tag="h2" font-style="h2">Ваш кошик порожній.</Heading>
      <p class="mb-4">Додайте що-небудь до вашого кошика</p>
      <nuxt-link to="/shop" class="mx-auto">
        <Btn>Повернутись в магазин</Btn>
      </nuxt-link>
    </div>

    <div v-else></div>
  </Container>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "~/store/cart";

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

if (process.client) {
  cartStore.$patch((state) => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      state.items = storedCart.items;
    }
  });
}

if (cartItems.value > 0) {
  console.log("aaaaa", cartItems.value);
} else {
  console.log("bbbbb", cartItems.value);
}

console.log("cartStore.totalItems: ", cartStore.totalItems);
console.log("cartItems: ", cartItems.value);

onMounted(() => {
  console.log(cartStore.items);
});
</script>
