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

<div class="rounded-lg bg-white p-6 shadow-lg">
	<h2 class="mb-6 text-center text-2xl font-semibold" style="color: {colors.heading}">
		Balance Botanica Color Palette
	</h2>

	<div class="grid gap-8 md:grid-cols-2">
		{#each colorGroups as group, _groupIndex}
			<div>
				<h3 class="mb-4 text-lg font-medium" style="color: {colors.main}">
					{group.title}
				</h3>
				<div class="space-y-3">
					{#each group.colors as color, _colorIndex}
						<div class="flex items-center space-x-3">
							<div
								class="h-12 w-12 rounded-lg border border-gray-200 shadow-sm"
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

	<div class="mt-8 rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-medium" style="color: {colors.main}">Usage Examples:</h4>
		<div class="space-y-2 text-sm" style="color: {colors.text}">
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">bg-[{colors.main}]</code> - Main brand background
			</p>
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">text-[{colors.text}]</code> - Body text color
			</p>
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">border-[{colors.stroke}]</code> - Border color
			</p>
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">bg-[{colors.background}]</code> - Page background
			</p>
		</div>
	</div>
</div>
