<template>
  <header class="z-50 w-full">
    <div
      class="w-full flex items-center justify-center border-b border-[#E0E0E0] text-center text-[16px, #000000] leading-[24px] py-[12px]"
    >
      {{ $t("delivery_header_info") }}
    </div>
    <div class="grid items-center w-full grid-cols-12 px-[150px] mx-auto">
      <div class="col-span-3">
        <nuxt-link to="/">
          <IconsLogo class="h-20 py-2" />
        </nuxt-link>
      </div>
      <div class="col-span-6">
        <NavBar class="hidden md:block" />
      </div>
      <div class="flex items-center justify-end col-span-3">
        <LangSwitcher />
        <CartInfo />

        <button title="Menu" class="p-1 ml-4" @click="mobileMenuOpen = true">
          <svg
            class="w-6 h-6 md:hidden text-brand-grey-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
    <transition name="menu">
      <MobileMenu v-if="mobileMenuOpen" @close="mobileMenuOpen = false" />
    </transition>
  </header>
</template>

<script setup>
const mobileMenuOpen = ref(false);
</script>

<style scoped>
header {
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.5s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
