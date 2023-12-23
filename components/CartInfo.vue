<template>
  <div class="relative">
    <button class="flex items-center snipcart-checkout relative">
      <nuxt-link to="/cart">
        <IconsCart class="w-10 pr-2 ml-3" />
        <!-- Badge for the cart item count -->
        <span
          class="cart-badge absolute top-0 right-3 rounded-full bg-secondary-green text-white px-2 py-1 text-xs"
        >
          {{ totalItems }}
        </span>
      </nuxt-link>
    </button>

    <!-- Tooltip container -->
    <div
      class="tooltip absolute right-0 z-10 p-4 bg-white border border-gray-300 rounded shadow-lg"
      v-if="totalItems > 0"
      @mouseover="showTooltip = true"
      @mouseleave="showTooltip = false"
    >
      <ul class="space-y-2">
        <li
          v-for="item in cartItems"
          :key="item.id"
          class="grid grid-cols-4 items-center gap-2"
        >
          <span class="col-span-2">{{ item.title }}</span>
          <div class="flex items-center justify-center col-span-1">
            <button @click="updateQuantity(item, item.quantity - 1)">-</button>
            <span class="px-2">{{ item.quantity }}</span>
            <button @click="updateQuantity(item, item.quantity + 1)">+</button>
          </div>
          <span class="justify-self-end col-span-1"
            >{{ item.quantity }} x {{ item.price }}</span
          >
        </li>
      </ul>
      <div class="mt-4 grid grid-cols-4">
        <strong class="col-span-3">Total:</strong>
        <span class="justify-self-end col-span-1">{{ totalPrice }}</span>
      </div>
      <div class="flex justify-end mt-2 space-x-2">
        <nuxt-link to="/cart" class="btn-view-cart">View Cart</nuxt-link>
        <nuxt-link to="/checkout" class="btn-checkout">Checkout</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCartStore } from "~/store/cart";

const cartStore = useCartStore();
const showTooltip = ref(false);

const cartItems = computed(() => cartStore.items);

console.log("CartInfo.vue: cartItems computed - ", cartItems.value);
const totalPrice = computed(() => cartStore.totalPrice);
const totalItems = computed(() => cartStore.totalItems);

function updateQuantity(item, newQuantity) {
  cartStore.updateQuantity(item.id, newQuantity);
}

onMounted(() => {});
</script>

<style scoped>
.cart-badge {
  @apply flex items-center justify-center;
  min-width: 20px;
  height: 20px;
  top: -10px;
  right: -10px;
  font-size: 0.75rem;
  font-weight: bold;
}

.tooltip {
  display: none;
  width: 400px;
  top: 100%;
  right: 0;
}

.tooltip:hover,
button:hover + .tooltip {
  display: block;
}

.btn-view-cart,
.btn-checkout {
  @apply bg-blue-500 text-white py-2 px-4 rounded;
}

.btn-view-cart:hover,
.btn-checkout:hover {
  @apply bg-blue-700;
}
</style>
