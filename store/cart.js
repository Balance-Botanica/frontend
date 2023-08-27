// cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),
  getters: {
    totalItems(state) {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    },
    totalPrice(state) {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  actions: {
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        this.items.push(product);
      }
      console.log("Product added to cart:", this.items);
    },
    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
    },
    updateQuantity(productId, quantity) {
      const existingItem = this.items.find((item) => item.id === productId);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart() {
      this.items = [];
    },
  },
});
