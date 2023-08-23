<template>
  <nav>
    <ul
      class="flex flex-col items-center justify-center gap-6 text-center md:flex-row"
    >
      <li
        class="text-xl font-bold tracking-tighter transition-colors text-brand-grey-800 font-heading hover:text-brand-orange"
      >
        <nuxt-link to="/">{{ $t("navbar_home") }}</nuxt-link>
      </li>
      <li
        class="text-xl font-bold tracking-tighter transition-colors text-brand-grey-800 font-heading hover:text-brand-orange"
      >
        <nuxt-link to="/shop">{{ $t("navbar_shop") }}</nuxt-link>
      </li>
      <li
        class="text-xl font-bold tracking-tighter transition-colors text-brand-grey-800 font-heading hover:text-brand-orange"
      >
        <nuxt-link to="/contact">{{ $t("navbar_contact") }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.router-link-active {
  @apply text-brand-orange;
}
</style>
