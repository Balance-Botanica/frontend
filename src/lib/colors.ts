/**
 * Balance Botanica Color Palette
 * Extracted from Figma design system
 */

export const colors = {
	// SWAPPED: turmeric orange leads (buy CTAs, accents). Logo stays green,
	// dark hardcoded sections (#3f6f68 etc.) keep green as the trust anchor.
	main: '#E07B12',
	mainAdditional: '#1F1F1F',

	// Supporting green (was primary) + ember red sparks
	turmeric: '#4B766E',
	turmericDeep: '#2F5A52',
	turmericSoft: '#DCE9E5',
	pine: '#2E4F49',
	cream: '#FDF4E4',
	ember: '#C0451F',
	emberDeep: '#97330F',
	emberSoft: '#F8DCD0',

	// Text colors
	heading: '#000000',
	text: '#474747',

	// UI colors
	primary: '#9A9A9A',
	secondary: '#B6B6B6',
	tertiary: '#C5C5C5',
	tertiaryAdditional: '#F7F7F7',

	// Utility colors
	optional: '#FFFFFF',
	destructive: '#FF3B30',
	stroke: '#E0E0E0',
	background: '#F8F7F6',
	foregroundPopup: '#00000080'
} as const;

// Type for color names
export type ColorName = keyof typeof colors;

// Helper function to get color value
export const getColor = (name: ColorName): string => colors[name];

// CSS custom properties for use in components
export const cssVariables = {
	'--color-main': colors.main,
	'--color-main-additional': colors.mainAdditional,
	'--color-turmeric': colors.turmeric,
	'--color-turmeric-deep': colors.turmericDeep,
	'--color-turmeric-soft': colors.turmericSoft,
	'--color-pine': colors.pine,
	'--color-cream': colors.cream,
	'--color-ember': colors.ember,
	'--color-ember-deep': colors.emberDeep,
	'--color-ember-soft': colors.emberSoft,
	'--color-heading': colors.heading,
	'--color-text': colors.text,
	'--color-primary': colors.primary,
	'--color-secondary': colors.secondary,
	'--color-tertiary': colors.tertiary,
	'--color-tertiary-additional': colors.tertiaryAdditional,
	'--color-optional': colors.optional,
	'--color-destructive': colors.destructive,
	'--color-stroke': colors.stroke,
	'--color-background': colors.background,
	'--color-foreground-popup': colors.foregroundPopup
} as const;
