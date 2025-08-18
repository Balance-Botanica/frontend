<script lang="ts">
  import { colors, type ColorName } from '../colors';
  
  const colorGroups = [
    {
      title: 'Primary Brand Colors',
      colors: [
        { name: 'main' as ColorName, description: 'Main brand color' },
        { name: 'mainAdditional' as ColorName, description: 'Main additional' }
      ]
    },
    {
      title: 'Text Colors',
      colors: [
        { name: 'heading' as ColorName, description: 'Headings' },
        { name: 'text' as ColorName, description: 'Body text' }
      ]
    },
    {
      title: 'UI Colors',
      colors: [
        { name: 'primary' as ColorName, description: 'Primary UI elements' },
        { name: 'secondary' as ColorName, description: 'Secondary UI elements' },
        { name: 'tertiary' as ColorName, description: 'Tertiary UI elements' },
        { name: 'tertiaryAdditional' as ColorName, description: 'Tertiary additional' }
      ]
    },
    {
      title: 'Utility Colors',
      colors: [
        { name: 'optional' as ColorName, description: 'Optional/white' },
        { name: 'destructive' as ColorName, description: 'Error/danger' },
        { name: 'stroke' as ColorName, description: 'Borders/strokes' },
        { name: 'background' as ColorName, description: 'Page background' },
        { name: 'foregroundPopup' as ColorName, description: 'Popup overlay' }
      ]
    }
  ];
</script>

<div class="p-6 bg-white rounded-lg shadow-lg">
  <h2 class="text-2xl font-semibold mb-6 text-center" style="color: {colors.heading}">
    Balance Botanica Color Palette
  </h2>
  
  <div class="grid gap-8 md:grid-cols-2">
    {#each colorGroups as group}
      <div>
        <h3 class="text-lg font-medium mb-4" style="color: {colors.main}">
          {group.title}
        </h3>
        <div class="space-y-3">
          {#each group.colors as color}
            <div class="flex items-center space-x-3">
              <div 
                class="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                style="background-color: {colors[color.name]}"
              ></div>
              <div>
                <div class="font-medium" style="color: {colors.text}">
                  {color.name}
                </div>
                <div class="text-sm text-gray-600">
                  {colors[color.name]}
                </div>
                <div class="text-xs text-gray-500">
                  {color.description}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  
  <div class="mt-8 p-4 bg-gray-50 rounded-lg">
    <h4 class="font-medium mb-2" style="color: {colors.main}">Usage Examples:</h4>
    <div class="text-sm space-y-2" style="color: {colors.text}">
      <p><code class="bg-gray-100 px-2 py-1 rounded">bg-[{colors.main}]</code> - Main brand background</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">text-[{colors.text}]</code> - Body text color</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">border-[{colors.stroke}]</code> - Border color</p>
      <p><code class="bg-gray-100 px-2 py-1 rounded">bg-[{colors.background}]</code> - Page background</p>
    </div>
  </div>
</div>
