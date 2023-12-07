<template>
  <Container>
    <!-- Cart is not empty -->
    <div
      v-if="cartStore.totalItems > 0"
      class="flex flex-col md:flex-row mt-20"
    >
      <!-- Products Table -->
      <div class="w-full md:w-2/3">
        <div class="mb-4">
          <Heading tag="h2" font-style="h2">ТОВАР</Heading>
          <div
            class="border-b-2 py-2"
            v-for="item in cartStore.items"
            :key="item.id"
          >
            <div class="grid grid-cols-12 gap-4 items-center">
              <div class="col-span-2">
                <img :src="item.image" alt="item.title" class="h-16" />
              </div>
              <div class="col-span-3">
                <span>{{ item.title }}</span>
              </div>
              <div class="col-span-2">{{ item.price }} грн</div>
              <div class="col-span-3 flex items-center">
                <button @click="updateQuantity(item, item.quantity - 1)">
                  -
                </button>
                <span class="mx-2">{{ item.quantity }}</span>
                <button @click="updateQuantity(item, item.quantity + 1)">
                  +
                </button>
              </div>
              <div class="col-span-2">{{ item.quantity * item.price }} грн</div>
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
    <div v-else class="text-center mt-20">
      <IconsCart class="w-24 mx-auto mb-4" />
      <Heading tag="h2" font-style="h2">Ваш кошик порожній.</Heading>
      <p class="mb-4">Додайте що-небудь до вашого кошика</p>
      <nuxt-link to="/shop" class="mx-auto">
        <Btn>Повернутись в магазин</Btn>
      </nuxt-link>
    </div>
  </Container>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "~/store/cart";

const cartStore = useCartStore();

if (process.client) {
  cartStore.$patch((state) => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      state.items = storedCart.items;
    }
  });
}

if (cartStore.totalItems.value > 0) {
  console.log("aaaaa", cartStore.totalItems.value);
} else {
  console.log("bbbbb", cartStore.totalItems.value);
}

console.log("cartStore.totalItems: ", cartStore.totalItems);
console.log("cartStore.totalItems: ", cartStore.totalItems.value);

onMounted(() => {
  console.log(cartStore.items);
});
</script>
