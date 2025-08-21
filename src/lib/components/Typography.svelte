<script lang="ts">
	import { typography, type TypographyStyle } from '../typography';
	import { colors } from '../colors';

	const headingStyles = [
		{
			name: 'H1 Special',
			style: 'h1Special' as TypographyStyle,
			description: 'Hero headings, main titles'
		},
		{ name: 'H1', style: 'h1' as TypographyStyle, description: 'Page headings' },
		{ name: 'H2', style: 'h2' as TypographyStyle, description: 'Section headings' },
		{ name: 'H3', style: 'h3' as TypographyStyle, description: 'Subsection headings' },
		{ name: 'H4', style: 'h4' as TypographyStyle, description: 'Card headings' },
		{ name: 'H5', style: 'h5' as TypographyStyle, description: 'Small headings' },
		{ name: 'H6', style: 'h6' as TypographyStyle, description: 'Tiny headings' }
	];

	const bodyStyles = [
		{ name: 'P1', style: 'p1' as TypographyStyle, description: 'Large body text' },
		{ name: 'P2', style: 'p2' as TypographyStyle, description: 'Standard body text' },
		{ name: 'P3', style: 'p3' as TypographyStyle, description: 'Small body text' },
		{ name: 'P4', style: 'p4' as TypographyStyle, description: 'Caption text' }
	];

	const interactiveStyles = [
		{
			name: 'Link Button Small',
			style: 'linkButtonSmall' as TypographyStyle,
			description: 'Small interactive elements'
		},
		{
			name: 'Link Button Medium',
			style: 'linkButtonMedium' as TypographyStyle,
			description: 'Medium interactive elements'
		},
		{
			name: 'Link Button Large',
			style: 'linkButtonLarge' as TypographyStyle,
			description: 'Large interactive elements'
		}
	];
</script>

<div class="rounded-lg bg-white p-6 shadow-lg">
	<h2 class="mb-6 text-center text-2xl font-semibold" style="color: {colors.heading}">
		Balance Botanica Typography System
	</h2>

	<div class="space-y-8">
		<!-- Headings -->
		<div>
			<h3 class="mb-4 text-lg font-medium" style="color: {colors.main}">Headings</h3>
			<div class="space-y-4">
				{#each headingStyles as item, _index (item.name)}
					<div class="border-l-4 pl-4" style="border-left-color: {colors.main}">
						<div class="mb-2">
							<div class="text-sm font-medium" style="color: {colors.text}">
								{item.name}
							</div>
							<div class="text-xs" style="color: {colors.primary}">
								{item.description}
							</div>
						</div>
						<div
							style="
              font-size: {typography.styles[item.style].fontSize};
              font-weight: {typography.styles[item.style].fontWeight};
              line-height: {typography.styles[item.style].lineHeight};
              color: {typography.styles[item.style].color};
            "
						>
							The quick brown fox jumps over the lazy dog
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Body Text -->
		<div>
			<h3 class="mb-4 text-lg font-medium" style="color: {colors.main}">Body Text</h3>
			<div class="space-y-4">
				{#each bodyStyles as item, _index (item.name)}
					<div class="border-l-4 pl-4" style="border-left-color: {colors.secondary}">
						<div class="mb-2">
							<div class="text-sm font-medium" style="color: {colors.text}">
								{item.name}
							</div>
							<div class="text-xs" style="color: {colors.primary}">
								{item.description}
							</div>
						</div>
						<div
							style="
              font-size: {typography.styles[item.style].fontSize};
              font-weight: {typography.styles[item.style].fontWeight};
              line-height: {typography.styles[item.style].lineHeight};
              color: {typography.styles[item.style].color};
            "
						>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua.
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Interactive Elements -->
		<div>
			<h3 class="mb-4 text-lg font-medium" style="color: {colors.main}">Interactive Elements</h3>
			<div class="space-y-4">
				{#each interactiveStyles as item, _index (item.name)}
					<div class="border-l-4 pl-4" style="border-left-color: {colors.tertiary}">
						<div class="mb-2">
							<div class="text-sm font-medium" style="color: {colors.text}">
								{item.name}
							</div>
							<div class="text-xs" style="color: {colors.primary}">
								{item.description}
							</div>
						</div>
						<div
							style="
              font-size: {typography.styles[item.style].fontSize};
              font-weight: {typography.styles[item.style].fontWeight};
              line-height: {typography.styles[item.style].lineHeight};
              color: {typography.styles[item.style].color};
            "
						>
							Click here to learn more
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mt-8 rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-medium" style="color: {colors.main}">Usage Examples:</h4>
		<div class="space-y-2 text-sm" style="color: {colors.text}">
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">text-[28px] font-semibold</code> - H1 heading
			</p>
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">text-[18px] font-normal</code> - P1 body text
			</p>
			<p>
				<code class="rounded bg-gray-100 px-2 py-1">text-[14px] font-medium</code> - Small link button
			</p>
		</div>
	</div>
</div>
