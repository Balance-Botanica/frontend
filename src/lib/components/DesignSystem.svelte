<script lang="ts">
	import { t } from '../i18n';
	import Switcher from './Switcher.svelte';
</script>

<div class="design-system">
	<!-- UI Kit for Wireframes -->
	<div class="ui-kit-wireframes">
		<div class="wireframe-container">
			<!-- Typography Scale -->
			<section class="typography-scale">
				<h2 class="section-title">{t('design_system.typography.title')}</h2>
				
				<div class="typography-examples">
					<h1 class="display-1">Display 1 - 64px/4rem</h1>
					<h2 class="display-2">Display 2 - 48px/3rem</h2>
					<h3 class="heading-1">Heading 1 - 36px/2.25rem</h3>
					<h4 class="heading-2">Heading 2 - 30px/1.875rem</h4>
					<h5 class="heading-3">Heading 3 - 24px/1.5rem</h5>
					<h6 class="heading-4">Heading 4 - 20px/1.25rem</h6>
					<p class="body-large">Body Large - 18px/1.125rem</p>
					<p class="body-medium">Body Medium - 16px/1rem</p>
					<p class="body-small">Body Small - 14px/0.875rem</p>
					<p class="caption">Caption - 12px/0.75rem</p>
				</div>
			</section>

			<!-- Color Palette -->
			<section class="color-palette">
				<h2 class="section-title">{t('design_system.colors.title')}</h2>
				
				<div class="color-categories">
					<div class="color-category">
						<h3>Primary Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch primary-100">
								<span class="color-name">Primary 100</span>
								<span class="color-value">#E6F3FF</span>
							</div>
							<div class="color-swatch primary-200">
								<span class="color-name">Primary 200</span>
								<span class="color-value">#B3D9FF</span>
							</div>
							<div class="color-swatch primary-300">
								<span class="color-name">Primary 300</span>
								<span class="color-value">#80BFFF</span>
							</div>
							<div class="color-swatch primary-400">
								<span class="color-name">Primary 400</span>
								<span class="color-value">#4DA6FF</span>
							</div>
							<div class="color-swatch primary-500">
								<span class="color-name">Primary 500</span>
								<span class="color-value">#1A8CFF</span>
							</div>
							<div class="color-swatch primary-600">
								<span class="color-name">Primary 600</span>
								<span class="color-value">#0073E6</span>
							</div>
							<div class="color-swatch primary-700">
								<span class="color-name">Primary 700</span>
								<span class="color-value">#0059B3</span>
							</div>
							<div class="color-swatch primary-800">
								<span class="color-name">Primary 800</span>
								<span class="color-value">#004080</span>
							</div>
							<div class="color-swatch primary-900">
								<span class="color-name">Primary 900</span>
								<span class="color-value">#00264D</span>
							</div>
						</div>
					</div>

					<div class="color-category">
						<h3>Neutral Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch neutral-50">
								<span class="color-name">Neutral 50</span>
								<span class="color-value">#FAFAFA</span>
							</div>
							<div class="color-swatch neutral-100">
								<span class="color-name">Neutral 100</span>
								<span class="color-value">#F5F5F5</span>
							</div>
							<div class="color-swatch neutral-200">
								<span class="color-name">Neutral 200</span>
								<span class="color-value">#E5E5E5</span>
							</div>
							<div class="color-swatch neutral-300">
								<span class="color-name">Neutral 300</span>
								<span class="color-value">#D4D4D4</span>
							</div>
							<div class="color-swatch neutral-400">
								<span class="color-name">Neutral 400</span>
								<span class="color-value">#A3A3A3</span>
							</div>
							<div class="color-swatch neutral-500">
								<span class="color-name">Neutral 500</span>
								<span class="color-value">#737373</span>
							</div>
							<div class="color-swatch neutral-600">
								<span class="color-name">Neutral 600</span>
								<span class="color-value">#525252</span>
							</div>
							<div class="color-swatch neutral-700">
								<span class="color-name">Neutral 700</span>
								<span class="color-value">#404040</span>
							</div>
							<div class="color-swatch neutral-800">
								<span class="color-name">Neutral 800</span>
								<span class="color-value">#262626</span>
							</div>
							<div class="color-swatch neutral-900">
								<span class="color-name">Neutral 900</span>
								<span class="color-value">#171717</span>
							</div>
						</div>
					</div>

					<div class="color-category">
						<h3>Semantic Colors</h3>
						<div class="color-swatches">
							<div class="color-swatch success">
								<span class="color-name">Success</span>
								<span class="color-value">#10B981</span>
							</div>
							<div class="color-swatch warning">
								<span class="color-name">Warning</span>
								<span class="color-value">#F59E0B</span>
							</div>
							<div class="color-swatch error">
								<span class="color-name">Error</span>
								<span class="color-value">#EF4444</span>
							</div>
							<div class="color-swatch info">
								<span class="color-name">Info</span>
								<span class="color-value">#3B82F6</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Spacing Scale -->
			<section class="spacing-scale">
				<h2 class="section-title">{t('design_system.spacing.title')}</h2>
				
				<div class="spacing-examples">
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
					<div class="spacing-item spacing-20">
						<span class="spacing-label">20px (1.25rem)</span>
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
					<div class="spacing-item spacing-40">
						<span class="spacing-label">40px (2.5rem)</span>
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
		line-height: 1.4;
	}

	.heading-3 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.4;
	}

	.heading-4 {
		font-size: 1.25rem;
		font-weight: 500;
		color: #1a1a1a;
		line-height: 1.5;
	}

	.body-large {
		font-size: 1.125rem;
		color: #404040;
		line-height: 1.6;
	}

	.body-medium {
		font-size: 1rem;
		color: #404040;
		line-height: 1.6;
	}

	.body-small {
		font-size: 0.875rem;
		color: #525252;
		line-height: 1.6;
	}

	.caption {
		font-size: 0.75rem;
		color: #737373;
		line-height: 1.5;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Color Palette */
	.color-palette {
		margin-bottom: 3rem;
	}

	.color-categories {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.color-category h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1a1a1a;
	}

	.color-swatches {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.color-swatch {
		display: flex;
		align-items: center;
		padding: 0.75rem;
		border-radius: 8px;
		border: 1px solid #e5e5e5;
		background: white;
	}

	.color-swatch::before {
		content: '';
		width: 24px;
		height: 24px;
		border-radius: 4px;
		margin-right: 0.75rem;
		border: 1px solid #d4d4d4;
	}

	.primary-100::before { background: #E6F3FF; }
	.primary-200::before { background: #B3D9FF; }
	.primary-300::before { background: #80BFFF; }
	.primary-400::before { background: #4DA6FF; }
	.primary-500::before { background: #1A8CFF; }
	.primary-600::before { background: #0073E6; }
	.primary-700::before { background: #0059B3; }
	.primary-800::before { background: #004080; }
	.primary-900::before { background: #00264D; }

	.neutral-50::before { background: #FAFAFA; }
	.neutral-100::before { background: #F5F5F5; }
	.neutral-200::before { background: #E5E5E5; }
	.neutral-300::before { background: #D4D4D4; }
	.neutral-400::before { background: #A3A3A3; }
	.neutral-500::before { background: #737373; }
	.neutral-600::before { background: #525252; }
	.neutral-700::before { background: #404040; }
	.neutral-800::before { background: #262626; }
	.neutral-900::before { background: #171717; }

	.success::before { background: #10B981; }
	.warning::before { background: #F59E0B; }
	.error::before { background: #EF4444; }
	.info::before { background: #3B82F6; }

	.color-name {
		font-weight: 500;
		color: #1a1a1a;
		margin-right: auto;
	}

	.color-value {
		font-family: monospace;
		font-size: 0.875rem;
		color: #737373;
	}

	/* Spacing Scale */
	.spacing-scale {
		margin-bottom: 3rem;
	}

	.spacing-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.spacing-item {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.spacing-label {
		min-width: 120px;
		font-size: 0.875rem;
		color: #525252;
	}

	.spacing-visual {
		background: #1A8CFF;
		border-radius: 4px;
	}

	.spacing-4 .spacing-visual { width: 4px; height: 16px; }
	.spacing-8 .spacing-visual { width: 8px; height: 16px; }
	.spacing-12 .spacing-visual { width: 12px; height: 16px; }
	.spacing-16 .spacing-visual { width: 16px; height: 16px; }
	.spacing-20 .spacing-visual { width: 20px; height: 16px; }
	.spacing-24 .spacing-visual { width: 24px; height: 16px; }
	.spacing-32 .spacing-visual { width: 32px; height: 16px; }
	.spacing-40 .spacing-visual { width: 40px; height: 16px; }
	.spacing-48 .spacing-visual { width: 48px; height: 16px; }
	.spacing-64 .spacing-visual { width: 64px; height: 16px; }

	/* Component Examples */
	.component-examples {
		margin-bottom: 3rem;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.component-group h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1a1a1a;
	}

	/* Buttons */
	.button-examples {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.875rem;
	}

	.btn-primary {
		background: #1A8CFF;
		color: white;
	}

	.btn-primary:hover {
		background: #0073E6;
	}

	.btn-secondary {
		background: #F5F5F5;
		color: #1a1a1a;
		border: 1px solid #E5E5E5;
	}

	.btn-secondary:hover {
		background: #E5E5E5;
	}

	.btn-outline {
		background: transparent;
		color: #1A8CFF;
		border: 2px solid #1A8CFF;
	}

	.btn-outline:hover {
		background: #1A8CFF;
		color: white;
	}

	.btn-ghost {
		background: transparent;
		color: #1a1a1a;
	}

	.btn-ghost:hover {
		background: #F5F5F5;
	}

	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.75rem;
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: 1rem;
	}

	/* Form Elements */
	.form-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-input,
	.form-select,
	.form-textarea {
		padding: 0.75rem;
		border: 1px solid #D4D4D4;
		border-radius: 8px;
		font-size: 0.875rem;
		transition: border-color 0.2s ease;
	}

	.form-input:focus,
	.form-select:focus,
	.form-textarea:focus {
		outline: none;
		border-color: #1A8CFF;
		box-shadow: 0 0 0 3px rgba(26, 140, 255, 0.1);
	}

	.form-textarea {
		min-height: 80px;
		resize: vertical;
	}

	.form-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.form-checkbox input[type="checkbox"] {
		width: 16px;
		height: 16px;
		accent-color: #1A8CFF;
	}

	/* Cards */
	.card-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		border: 1px solid #E5E5E5;
		border-radius: 12px;
		overflow: hidden;
		background: white;
	}

	.card-header {
		padding: 1rem;
		background: #F5F5F5;
		border-bottom: 1px solid #E5E5E5;
	}

	.card-header h4 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a1a;
	}

	.card-body {
		padding: 1rem;
	}

	.card-body p {
		margin: 0;
		color: #404040;
		line-height: 1.6;
	}

	.card-footer {
		padding: 1rem;
		background: #FAFAFA;
		border-top: 1px solid #E5E5E5;
	}

	/* Alerts */
	.alert-examples {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.alert {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		border-left: 4px solid;
		display: flex;
		align-items: center;
	}

	.alert-info {
		background: #EFF6FF;
		border-left-color: #3B82F6;
		color: #1E40AF;
	}

	.alert-success {
		background: #ECFDF5;
		border-left-color: #10B981;
		color: #065F46;
	}

	.alert-warning {
		background: #FFFBEB;
		border-left-color: #F59E0B;
		color: #92400E;
	}

	.alert-error {
		background: #FEF2F2;
		border-left-color: #EF4444;
		color: #991B1B;
	}

	/* Grid System */
	.grid-system {
		margin-bottom: 2rem;
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
		background: #1A8CFF;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 0.5rem;
		border-radius: 4px;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.grid-col-1 { flex: 1; }
	.grid-col-3 { flex: 0 0 calc(25% - 0.375rem); }
	.grid-col-4 { flex: 0 0 calc(33.333% - 0.333rem); }
	.grid-col-6 { flex: 0 0 calc(50% - 0.25rem); }

	/* Switcher Examples */
	.switcher-examples {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.switcher-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		background: white;
	}

	.switcher-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.design-system {
			padding: 1rem;
		}

		.ui-kit-wireframes {
			padding: 1.5rem;
		}

		.wireframe-container {
			padding: 1rem;
		}

		.color-categories {
			grid-template-columns: 1fr;
		}

		.component-grid {
			grid-template-columns: 1fr;
		}

		.button-examples {
			flex-direction: column;
		}

		.grid-row {
			flex-wrap: wrap;
		}

		.grid-col-6,
		.grid-col-4,
		.grid-col-3 {
			flex: 0 0 calc(50% - 0.25rem);
		}
	}

	@media (max-width: 480px) {
		.ui-kit-wireframes {
			padding: 1rem;
		}

		.wireframe-container {
			padding: 0.75rem;
		}

		.section-title {
			font-size: 1.5rem;
		}

		.display-1 {
			font-size: 2.5rem;
		}

		.display-2 {
			font-size: 2rem;
		}
	}
</style>
