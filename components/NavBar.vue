<template>
  <nav>
    <ul
      class="flex flex-col items-center justify-center gap-6 text-center md:flex-row"
    >
      <li
        class="text-[18px] tracking-tighter transition-colors hover:text-secondary-green"
      >
        <nuxt-link to="/shop">{{ $t("navbar_shop") }}</nuxt-link>
      </li>
      <li
        class="text-[18px] tracking-tighter transition-colors hover:text-secondary-green"
      >
        <nuxt-link to="/about">{{ $t("navbar_about") }}</nuxt-link>
      </li>
      <li
        class="text-[18px] tracking-tighter transition-colors hover:text-secondary-green"
      >
        <nuxt-link to="/contact">{{ $t("navbar_contact") }}</nuxt-link>
      </li>
      <li
        class="text-[18px] tracking-tighter transition-colors hover:text-secondary-green"
      >
        <nuxt-link to="">{{ $t("navbar_blog") }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-secondary-green;
}
</style>
