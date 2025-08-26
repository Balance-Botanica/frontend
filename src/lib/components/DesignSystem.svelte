<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import Switcher from './Switcher.svelte';
	import ProductGrid from './ProductGrid.svelte';
	
	// Sample products data for ProductGrid example
	let products = [
		{
			id: '1',
			name: 'CBD Oil 5%',
			description: 'High-quality CBD oil for daily wellness',
			price: 59900,
			stock: 15,
			size: '30ml',
			flavor: 'Natural',
			categories: JSON.stringify(['oils', 'wellness']),
			imageUrls: JSON.stringify([
				'https://placehold.co/400x400/4b766e/white?text=CBD+Oil+1'
			]),
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: '2',
			name: 'CBD Capsules',
			description: 'Convenient CBD capsules for on-the-go wellness',
			price: 74900,
			stock: 8,
			size: '60 capsules',
			flavor: 'Neutral',
			categories: JSON.stringify(['capsules', 'wellness']),
			imageUrls: JSON.stringify([
				'https://placehold.co/400x400/4b766e/white?text=CBD+Capsules+1'
			]),
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: '3',
			name: 'CBD Cream',
			description: 'Relief cream for targeted comfort',
			price: 44900,
			stock: 12,
			size: '100ml',
			flavor: 'Lavender',
			categories: JSON.stringify(['topicals', 'relief']),
			imageUrls: JSON.stringify([
				'https://placehold.co/400x400/4b766e/white?text=CBD+Cream+1'
			]),
			createdAt: new Date(),
			updatedAt: new Date()
		}
	];
</script>

<div class="design-system">
	<div class="ui-kit-wireframes">
		<div class="wireframe-container">
			<!-- Typography Scale -->
			<section class="typography-scale">
				<h2 class="section-title">{t('design_system.typography.title')}</h2>
				
				<div class="typography-examples">
					<h1 class="display-1">Display 1</h1>
					<h2 class="display-2">Display 2</h2>
					<h1 class="heading-1">Heading 1</h1>
					<h2 class="heading-2">Heading 2</h2>
					<h3 class="heading-3">Heading 3</h3>
					<h4 class="heading-4">Heading 4</h4>
					<p class="body-large">Body Large - For important text and introductory paragraphs</p>
					<p class="body-medium">Body Medium - Standard body text for most content</p>
					<p class="body-small">Body Small - For captions, helper text, and secondary information</p>
					<p class="body-large"><strong>Body Large Bold</strong> - Emphasized text with strong importance</p>
					<p class="body-medium"><strong>Body Medium Bold</strong> - Standard bold text for emphasis</p>
					<p class="body-small"><strong>Body Small Bold</strong> - Small bold text for labels and highlights</p>
				</div>
			</section>

			<!-- Color Palette -->
			<section class="color-palette">
				<h2 class="section-title">{t('design_system.colors.title')}</h2>
				
				<div class="color-grid">
					<div class="color-group">
						<h3>Primary Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch bg-primary-main">
								<span class="color-name">Primary Main</span>
								<span class="color-value">#4b766e</span>
							</div>
							<div class="color-swatch bg-primary-dark">
								<span class="color-name">Primary Dark</span>
								<span class="color-value">#3d5f58</span>
							</div>
							<div class="color-swatch bg-primary-light">
								<span class="color-name">Primary Light</span>
								<span class="color-value">#e8f1f0</span>
							</div>
						</div>
					</div>
					
					<div class="color-group">
						<h3>Secondary Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch bg-secondary-main">
								<span class="color-name">Secondary Main</span>
								<span class="color-value">#1f1f1f</span>
							</div>
							<div class="color-swatch bg-secondary-dark">
								<span class="color-name">Secondary Dark</span>
								<span class="color-value">#000000</span>
							</div>
							<div class="color-swatch bg-secondary-light">
								<span class="color-name">Secondary Light</span>
								<span class="color-value">#4a4a4a</span>
							</div>
						</div>
					</div>
					
					<div class="color-group">
						<h3>Neutral Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch bg-white">
								<span class="color-name">White</span>
								<span class="color-value">#ffffff</span>
							</div>
							<div class="color-swatch bg-gray-50">
								<span class="color-name">Gray 50</span>
								<span class="color-value">#f8f7f6</span>
							</div>
							<div class="color-swatch bg-gray-100">
								<span class="color-name">Gray 100</span>
								<span class="color-value">#e7e5e4</span>
							</div>
							<div class="color-swatch bg-gray-200">
								<span class="color-name">Gray 200</span>
								<span class="color-value">#d6d3d1</span>
							</div>
							<div class="color-swatch bg-gray-300">
								<span class="color-name">Gray 300</span>
								<span class="color-value">#a8a29e</span>
							</div>
							<div class="color-swatch bg-gray-400">
								<span class="color-name">Gray 400</span>
								<span class="color-value">#78716c</span>
							</div>
							<div class="color-swatch bg-gray-500">
								<span class="color-name">Gray 500</span>
								<span class="color-value">#57534e</span>
							</div>
							<div class="color-swatch bg-gray-600">
								<span class="color-name">Gray 600</span>
								<span class="color-value">#44403c</span>
							</div>
							<div class="color-swatch bg-gray-700">
								<span class="color-name">Gray 700</span>
								<span class="color-value">#292524</span>
							</div>
							<div class="color-swatch bg-black">
								<span class="color-name">Black</span>
								<span class="color-value">#000000</span>
							</div>
						</div>
					</div>
					
					<div class="color-group">
						<h3>Accent Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch bg-accent-green">
								<span class="color-name">Accent Green</span>
								<span class="color-value">#e5dcd3</span>
							</div>
							<div class="color-swatch bg-accent-beige">
								<span class="color-name">Accent Beige</span>
								<span class="color-value">#f0f0f0</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Spacing System -->
			<section class="spacing-system">
				<h2 class="section-title">{t('design_system.spacing.title')}</h2>
				
				<div class="spacing-grid">
					<div class="spacing-item spacing-4">
						<span class="spacing-label">4px (0.25rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-8">
						<span class="spacing-label">8px (0.5rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-12">
						<span class="spacing-label">12px (0.75rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-16">
						<span class="spacing-label">16px (1rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-24">
						<span class="spacing-label">24px (1.5rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-32">
						<span class="spacing-label">32px (2rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-48">
						<span class="spacing-label">48px (3rem)</span>
						<div class="spacing-visual"></div>
					</div>
					<div class="spacing-item spacing-64">
						<span class="spacing-label">64px (4rem)</span>
						<div class="spacing-visual"></div>
					</div>
				</div>
			</section>

			<!-- Component Examples -->
			<section class="component-examples">
				<h2 class="section-title">{t('design_system.components.title')}</h2>
				
				<div class="component-grid">
					<!-- Buttons -->
					<div class="component-group">
						<h3>Buttons</h3>
						<div class="button-examples">
							<button class="btn btn-primary">Primary Button</button>
							<button class="btn btn-secondary">Secondary Button</button>
							<button class="btn btn-outline">Outline Button</button>
							<button class="btn btn-ghost">Ghost Button</button>
							<button class="btn btn-primary btn-sm">Small</button>
							<button class="btn btn-primary btn-lg">Large</button>
						</div>
					</div>

					<!-- Form Elements -->
					<div class="component-group">
						<h3>Form Elements</h3>
						<div class="form-examples">
							<input type="text" placeholder="Text Input" class="form-input" />
							<select class="form-select">
								<option>Select Option</option>
								<option>Option 1</option>
								<option>Option 2</option>
							</select>
							<textarea placeholder="Textarea" class="form-textarea"></textarea>
							<label class="form-checkbox">
								<input type="checkbox" />
								<span>Checkbox Label</span>
							</label>
						</div>
					</div>

					<!-- Switchers -->
					<div class="component-group">
						<h3>Switchers</h3>
						<div class="switcher-examples">
							<div class="switcher-item">
								<span class="switcher-label">Default (Off)</span>
								<Switcher checked={false} onChange={() => {}} />
							</div>
							<div class="switcher-item">
								<span class="switcher-label">Default (On)</span>
								<Switcher checked={true} onChange={() => {}} />
							</div>
							<div class="switcher-item">
								<span class="switcher-label">Disabled</span>
								<Switcher checked={false} disabled={true} onChange={() => {}} />
							</div>
							<div class="switcher-item">
								<span class="switcher-label">Cookie Variant (Off)</span>
								<Switcher checked={false} variant="cookie" onChange={() => {}} />
							</div>
							<div class="switcher-item">
								<span class="switcher-label">Cookie Variant (On)</span>
								<Switcher checked={true} variant="cookie" onChange={() => {}} />
							</div>
						</div>
					</div>

					<!-- Cards -->
					<div class="component-group">
						<h3>Cards</h3>
						<div class="card-examples">
							<div class="card card-default">
								<div class="card-header">
									<h4>Card Title</h4>
								</div>
								<div class="card-body">
									<p>This is a basic card component with header and body sections.</p>
								</div>
								<div class="card-footer">
									<button class="btn btn-primary">Action</button>
								</div>
							</div>
						</div>
					</div>

					<!-- Product Grid -->
					<div class="component-group">
						<h3>Product Grid</h3>
						<div class="product-grid-examples">
							<p>Product grids display products in a responsive grid layout.</p>
							<ProductGrid 
								{products} 
								columns={3} 
								gap="gap-6" 
								cardClassName="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
							/>
						</div>
					</div>

					<!-- Alerts -->
					<div class="component-group">
						<h3>Alerts</h3>
						<div class="alert-examples">
							<div class="alert alert-info">
								<span>This is an info alert</span>
							</div>
							<div class="alert alert-success">
								<span>This is a success alert</span>
							</div>
							<div class="alert alert-warning">
								<span>This is a warning alert</span>
							</div>
							<div class="alert alert-error">
								<span>This is an error alert</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Grid System -->
			<section class="grid-system">
				<h2 class="section-title">{t('design_system.grid.title')}</h2>
				
				<div class="grid-examples">
					<div class="grid-row">
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
						<div class="grid-col grid-col-1">1</div>
					</div>
					<div class="grid-row">
						<div class="grid-col grid-col-6">6</div>
						<div class="grid-col grid-col-6">6</div>
					</div>
					<div class="grid-row">
						<div class="grid-col grid-col-4">4</div>
						<div class="grid-col grid-col-4">4</div>
						<div class="grid-col grid-col-4">4</div>
					</div>
					<div class="grid-row">
						<div class="grid-col grid-col-3">3</div>
						<div class="grid-col grid-col-3">3</div>
						<div class="grid-col grid-col-3">3</div>
						<div class="grid-col grid-col-3">3</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.design-system {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.ui-kit-wireframes {
		position: relative;
		width: 100%;
		background: #E7E7E7;
		border-radius: 40px;
		padding: 3rem;
		margin-bottom: 2rem;
	}

	.wireframe-container {
		background: white;
		border-radius: 24px;
		padding: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.section-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid #e5e5e5;
		padding-bottom: 0.5rem;
	}

	/* Typography Scale */
	.typography-scale {
		margin-bottom: 3rem;
	}

	.typography-examples > * {
		margin-bottom: 1rem;
	}

	.display-1 {
		font-size: 4rem;
		font-weight: 900;
		color: #1a1a1a;
		line-height: 1.1;
	}

	.display-2 {
		font-size: 3rem;
		font-weight: 800;
		color: #1a1a1a;
		line-height: 1.2;
	}

	.heading-1 {
		font-size: 2.25rem;
		font-weight: 700;
		color: #1a1a1a;
		line-height: 1.3;
	}

	.heading-2 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.3;
	}

	.heading-3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.4;
	}

	.heading-4 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.4;
	}

	.body-large {
		font-size: 1.125rem;
		font-weight: 400;
		color: #474747;
		line-height: 1.6;
	}

	.body-medium {
		font-size: 1rem;
		font-weight: 400;
		color: #474747;
		line-height: 1.6;
	}

	.body-small {
		font-size: 0.875rem;
		font-weight: 400;
		color: #474747;
		line-height: 1.5;
	}

	/* Color Palette */
	.color-palette {
		margin-bottom: 3rem;
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.color-group {
		margin-bottom: 1.5rem;
	}

	.color-group h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1rem;
	}

	.color-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.color-swatch {
		flex: 1;
		min-width: 120px;
		height: 80px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.color-swatch span {
		font-size: 0.75rem;
		font-weight: 500;
	}

	.color-name {
		color: rgba(255, 255, 255, 0.9);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.color-value {
		color: rgba(255, 255, 255, 0.8);
		font-weight: 400;
	}

	/* For light backgrounds, use dark text */
	.bg-white .color-name,
	.bg-white .color-value,
	.bg-gray-50 .color-name,
	.bg-gray-50 .color-value,
	.bg-gray-100 .color-name,
	.bg-gray-100 .color-value,
	.bg-gray-200 .color-name,
	.bg-gray-200 .color-value {
		color: #1a1a1a;
		text-shadow: none;
	}

	/* Spacing System */
	.spacing-system {
		margin-bottom: 3rem;
	}

	.spacing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.spacing-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.spacing-label {
		font-size: 0.875rem;
		color: #474747;
		margin-bottom: 0.5rem;
		text-align: center;
	}

	.spacing-visual {
		width: 100%;
		background: linear-gradient(90deg, #4b766e 0%, #4b766e 100%);
		border-radius: 4px;
	}

	.spacing-4 .spacing-visual { height: 4px; }
	.spacing-8 .spacing-visual { height: 8px; }
	.spacing-12 .spacing-visual { height: 12px; }
	.spacing-16 .spacing-visual { height: 16px; }
	.spacing-24 .spacing-visual { height: 24px; }
	.spacing-32 .spacing-visual { height: 32px; }
	.spacing-48 .spacing-visual { height: 48px; }
	.spacing-64 .spacing-visual { height: 64px; }

	/* Component Examples */
	.component-examples {
		margin-bottom: 3rem;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.component-group {
		background: #f8f7f6;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.component-group h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a1a1a;
		margin-bottom: 1rem;
	}

	/* Button Examples */
	.button-examples {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	/* Form Examples */
	.form-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-input,
	.form-select,
	.form-textarea {
		padding: 0.75rem;
		border: 1px solid #d6d3d1;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-input:focus,
	.form-select:focus {
		outline: none;
		border-color: #4b766e;
		box-shadow: 0 0 0 3px rgba(75, 118, 110, 0.1);
	}

	.form-textarea {
		min-height: 100px;
		resize: vertical;
	}

	.form-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	/* Switcher Examples */
	.switcher-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.switcher-item {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.switcher-label {
		font-size: 0.875rem;
		color: #474747;
		min-width: 120px;
	}

	/* Card Examples */
	.card-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.card-default {
		max-width: 300px;
	}

	.card-header {
		padding: 1rem;
		border-bottom: 1px solid #e7e5e4;
	}

	.card-header h4 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0;
	}

	.card-body {
		padding: 1rem;
	}

	.card-body p {
		font-size: 0.875rem;
		color: #474747;
		margin: 0;
		line-height: 1.5;
	}

	.card-footer {
		padding: 1rem;
		border-top: 1px solid #e7e5e4;
		background: #f8f7f6;
	}

	/* Product Grid Examples */
	.product-grid-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.product-grid-examples > p {
		font-size: 0.875rem;
		color: #474747;
		margin: 0;
	}

	/* Alert Examples */
	.alert-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.alert {
		padding: 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		display: flex;
		align-items: center;
	}

	.alert-info {
		background: #e8f1f0;
		color: #3d5f58;
		border: 1px solid #d1e2df;
	}

	.alert-success {
		background: #f0fdf4;
		color: #166534;
		border: 1px solid #bbf7d0;
	}

	.alert-warning {
		background: #fffbeb;
		color: #854d0e;
		border: 1px solid #fde68a;
	}

	.alert-error {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fecaca;
	}

	/* Grid System */
	.grid-system {
		margin-bottom: 3rem;
	}

	.grid-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.grid-row {
		display: flex;
		gap: 0.5rem;
	}

	.grid-col {
		background: #4b766e;
		color: white;
		padding: 1rem;
		border-radius: 4px;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.grid-col-1 { flex: 1; }
	.grid-col-2 { flex: 2; }
	.grid-col-3 { flex: 3; }
	.grid-col-4 { flex: 4; }
	.grid-col-5 { flex: 5; }
	.grid-col-6 { flex: 6; }

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.design-system {
			padding: 1rem;
		}
		
		.ui-kit-wireframes {
			padding: 1.5rem;
			border-radius: 20px;
		}
		
		.wireframe-container {
			padding: 1rem;
		}
		
		.component-grid {
			grid-template-columns: 1fr;
		}
		
		.color-grid {
			grid-template-columns: 1fr;
		}
	}
</style>