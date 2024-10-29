<template>
  <div class="relative">
    <HeaderSection />
    <div class="min-h-[600px]">
      <slot />
    </div>
    <subscribe />
    <FooterSection />
  </div>
</template>

<style scoped>
body {
  -webkit-font-smoothing: antialiased;
}
</style>
