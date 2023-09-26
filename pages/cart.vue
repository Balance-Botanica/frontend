<template>
  <div>
    <!-- Header and other parts of your page -->

    <Container>
      <!-- If cart is not empty -->
      <div v-if="cartItems.length > 0">
        <Heading tag="h2" font-style="h2">Your Cart</Heading>

        <!-- List out cart items -->
        <div v-for="item in cartItems" :key="item.id">
          <!-- Display item details, like title, price, etc. -->
          {{ item.title }} - {{ item.price }}
        </div>

        <!-- Total Price and Checkout Button -->
        <div>
          Total: {{ totalPrice }}
          <Btn>Checkout</Btn>
        </div>
      </div>

      <!-- If cart is empty -->
      <div v-else>
        <Heading tag="h2" font-style="h2">Your Cart is Empty</Heading>
        <p>
          Looks like you haven't added anything to your cart yet. Start shopping
          now!
        </p>
      </div>
    </Container>

    <!-- Footer and other parts of your page -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "~/store/cart";

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);
</script>
