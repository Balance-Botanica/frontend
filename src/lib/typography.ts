/**
 * Balance Botanica Typography System
 * Extracted from Figma design system
 */

export const typography = {
	// Font weights
	weights: {
		regular: 400,
		medium: 500,
		semibold: 600
	},

	// Font sizes
	sizes: {
		xs: '12px', // P4 Text
		sm: '14px', // P3 Text, link-button-Small
		base: '16px', // P2 Text, H6 Text, link-button-Medium
		lg: '18px', // P1 Text, H5 Text, link-button-Large
		xl: '20px', // H4 Text
		'2xl': '22px', // H3 Text
		'3xl': '24px', // H2 Text
		'4xl': '28px', // H1 Text
		'5xl': '36px' // H1-special Text
	},

	// Predefined text styles
	styles: {
		// Headings
		h1: {
			fontSize: '28px',
			fontWeight: 600,
			lineHeight: '1.2',
			color: 'var(--color-heading)'
		},
		h1Special: {
			fontSize: '36px',
			fontWeight: 600,
			lineHeight: '1.1',
			color: 'var(--color-heading)'
		},
		h2: {
			fontSize: '24px',
			fontWeight: 600,
			lineHeight: '1.3',
			color: 'var(--color-heading)'
		},
		h3: {
			fontSize: '22px',
			fontWeight: 500,
			lineHeight: '1.3',
			color: 'var(--color-heading)'
		},
		h4: {
			fontSize: '20px',
			fontWeight: 600,
			lineHeight: '1.4',
			color: 'var(--color-heading)'
		},
		h5: {
			fontSize: '18px',
			fontWeight: 600,
			lineHeight: '1.4',
			color: 'var(--color-heading)'
		},
		h6: {
			fontSize: '16px',
			fontWeight: 600,
			lineHeight: '1.5',
			color: 'var(--color-heading)'
		},

		// Body text
		p1: {
			fontSize: '18px',
			fontWeight: 400,
			lineHeight: '1.6',
			color: 'var(--color-text)'
		},
		p2: {
			fontSize: '16px',
			fontWeight: 400,
			lineHeight: '1.6',
			color: 'var(--color-text)'
		},
		p3: {
			fontSize: '14px',
			fontWeight: 400,
			lineHeight: '1.5',
			color: 'var(--color-text)'
		},
		p4: {
			fontSize: '12px',
			fontWeight: 400,
			lineHeight: '1.4',
			color: 'var(--color-text)'
		},

		// Interactive elements
		linkButtonSmall: {
			fontSize: '14px',
			fontWeight: 500,
			lineHeight: '1.4',
			color: 'var(--color-main)'
		},
		linkButtonMedium: {
			fontSize: '16px',
			fontWeight: 500,
			lineHeight: '1.4',
			color: 'var(--color-main)'
		},
		linkButtonLarge: {
			fontSize: '18px',
			fontWeight: 500,
			lineHeight: '1.4',
			color: 'var(--color-main)'
		}
	}
} as const;

// Type for typography style names
export type TypographyStyle = keyof typeof typography.styles;

// Helper function to get typography style
export const getTypographyStyle = (style: TypographyStyle) => typography.styles[style];

// CSS custom properties for typography
export const typographyCSSVariables = {
	'--font-weight-regular': typography.weights.regular,
	'--font-weight-medium': typography.weights.medium,
	'--font-weight-semibold': typography.weights.semibold,
	'--font-size-xs': typography.sizes.xs,
	'--font-size-sm': typography.sizes.sm,
	'--font-size-base': typography.sizes.base,
	'--font-size-lg': typography.sizes.lg,
	'--font-size-xl': typography.sizes.xl,
	'--font-size-2xl': typography.sizes['2xl'],
	'--font-size-3xl': typography.sizes['3xl'],
	'--font-size-4xl': typography.sizes['4xl'],
	'--font-size-5xl': typography.sizes['5xl']
} as const;

// Tailwind utility classes mapping
export const tailwindClasses = {
	// Font weights
	'font-regular': `font-[400]`,
	'font-medium': `font-[500]`,
	'font-semibold': `font-[600]`,

	// Font sizes
	'text-xs': `text-[12px]`,
	'text-sm': `text-[14px]`,
	'text-base': `text-[16px]`,
	'text-lg': `text-[18px]`,
	'text-xl': `text-[20px]`,
	'text-2xl': `text-[22px]`,
	'text-3xl': `text-[24px]`,
	'text-4xl': `text-[28px]`,
	'text-5xl': `text-[36px]`
} as const;
