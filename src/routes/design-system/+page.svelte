<script lang="ts">
  import ColorPalette from '$lib/components/ColorPalette.svelte';
  import Typography from '$lib/components/Typography.svelte';
</script>

<svelte:head>
  <title>Design System - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen p-6" style="background-color: #F8F7F6;">
  <div class="max-w-6xl mx-auto">
    <header class="text-center mb-12">
      <h1 class="text-5xl font-semibold mb-4" style="color: #4B766E;">
        Balance Botanica
      </h1>
      <p class="text-xl" style="color: #474747;">
        Design System & Component Library
      </p>
    </header>
    
    <div class="space-y-12">
      <section>
        <h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
          Color Palette
        </h2>
        <ColorPalette />
      </section>
      
      <section>
        <h2 class="text-3xl font-semibold mb-6" style="color: #1F1F1F;">
          Typography System
        </h2>
        <Typography />
      </section>
    </div>
  </div>
</div>
