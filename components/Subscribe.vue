<template>
  <div
    class="relative flex justify-center w-full h-64 pb-16 mt-14 subscribe-bg"
  >
    <Container>
      <div class="w-full mx-auto lg:w-3/6">
        <div
          class="px-10 -mt-12 text-center bg-white rounded-lg shadow-xl py-9 subscribe-box"
        >
          <Heading tag="h3" font-style="h3">{{
            $t("subscribe_subtitle")
          }}</Heading>
          <Heading tag="h2" font-style="h2">{{
            $t("subscribe_title")
          }}</Heading>
          <p class="w-full px-2 mx-auto text-center pb-7 text-brand-grey-400">
            {{ $t("subscribe_description") }}
          </p>
          <div class="flex items-center">
            <input-field type="email" class="w-3/4 mr-8" />
            <Btn class="h-full"> {{ $t("subscribe_subscribe") }}</Btn>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<style>
.subscribe-bg {
  background: url("assets/images/subscribe-pattern.png") repeat, #e9ba9e;
}
</style>
