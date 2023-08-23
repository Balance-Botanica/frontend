<template>
  <footer class="py-12 text-white bg-brand-grey-800 pt-20">
    <Container class="grid grid-cols-12 gap-6">
      <div class="col-span-12 md:col-span-3 lg:col-span-6">
        <img :src="LogoWhite" class="w-32" alt="Pick a Sick Wick" />
        <p class="py-4 md:w-4/5">
          {{ $t("footer_description") }}
        </p>
      </div>
      <div class="col-span-12 md:col-span-3 lg:col-span-2">
        <Heading tag="h4" font-style="h4" color="text-white">
          {{ $t("footer_useful_title") }}</Heading
        >
        <ul>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/about-cbd">{{
              $t("footer_useful_about_cbd")
            }}</nuxt-link>
          </li>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/about"> {{ $t("footer_menu_about") }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="col-span-12 md:col-span-3 lg:col-span-2">
        <Heading tag="h4" font-style="h4" color="text-white">
          {{ $t("footer_menu_title") }}</Heading
        >
        <ul>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/"> {{ $t("navbar_home") }}</nuxt-link>
          </li>

          <li class="underline list-disc list-inside">
            <nuxt-link to="/shop">{{ $t("navbar_shop") }}</nuxt-link>
          </li>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/contact">{{ $t("navbar_contact") }}</nuxt-link>
          </li>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/offert">{{ $t("footer_menu_offert") }}</nuxt-link>
          </li>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/privacy-policy">{{
              $t("footer_menu_privacy_policy")
            }}</nuxt-link>
          </li>
          <li class="underline list-disc list-inside">
            <nuxt-link to="/delivery">{{
              $t("footer_menu_payment_and_delivery")
            }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="col-span-12 md:col-span-3 lg:col-span-2">
        <Heading tag="h4" font-style="h4" color="text-white">{{
          $t("navbar_contact")
        }}</Heading>
        <p>+380660462205</p>
        <p>vss679kn@gmail.com</p>
      </div>
    </Container>
  </footer>
</template>

<script setup>
// We have to import images like this because Nuxt build doesn't incude them otherwsie
import LogoWhite from "assets/images/logo-white.svg";
</script>
