<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import { isAuthenticated } from '$lib/auth/supabase-store';

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Redirect to cart if not authenticated
	onMount(() => {
		if (!$isAuthenticated) {
			goto('/cart');
		}
	});

	// Handle Google Pay
	function handleGooglePay() {
		// TODO: Implement Google Pay integration
		if ($pageTranslations) {
			alert($pageTranslations.t('cart.checkout.comingSoon'));
		}
	}

	// Handle Apple Pay
	function handleApplePay() {
		// TODO: Implement Apple Pay integration
		if ($pageTranslations) {
			alert($pageTranslations.t('cart.checkout.comingSoon'));
		}
	}

	// Go back to cart
	function goBackToCart() {
		goto('/cart');
	}
</script>

{#if $pageTranslations}
<SEO
	title={$pageTranslations.t('cart.checkout.title')}
	description="Complete your order with Google Pay or Apple Pay"
	locale={$pageTranslations.locale}
/>

<main class="checkout-page">
	<div class="checkout-container">
		<h1 class="checkout-title">{$pageTranslations.t('cart.checkout.title')}</h1>
		
		<div class="checkout-layout">
			<!-- Left Column: Order Summary -->
			<div class="checkout-summary-column">
				<div class="checkout-summary-container">
					<h2 class="summary-title">{$pageTranslations.t('cart.checkout.orderSummary')}</h2>
					
					<!-- Order items would be listed here -->
					<div class="order-items">
						<p>Order summary details would appear here...</p>
					</div>
					
					<!-- Payment Method -->
					<div class="payment-method-section">
						<h3 class="section-title">{$pageTranslations.t('cart.checkout.paymentMethod')}</h3>
						
						<div class="payment-buttons">
							<button class="payment-btn google-pay" on:click={handleGooglePay}>
								<div class="payment-icon">
									<svg width="24" height="24" viewBox="0 0 24 24">
										<path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
										<path fill="#fff" d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
										<circle fill="#fff" cx="12" cy="12" r="2"/>
									</svg>
								</div>
								<span>{$pageTranslations.t('cart.checkout.googlePay')}</span>
							</button>
							
							<button class="payment-btn apple-pay" on:click={handleApplePay}>
								<div class="payment-icon">
									<svg width="24" height="24" viewBox="0 0 24 24">
										<path fill="#fff" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
									</svg>
								</div>
								<span>{$pageTranslations.t('cart.checkout.applePay')}</span>
							</button>
						</div>
						
						<div class="coming-soon-message">
							<p>{$pageTranslations.t('cart.checkout.comingSoon')}</p>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Right Column: Customer Information -->
			<div class="checkout-info-column">
				<div class="checkout-info-container">
					<h2 class="info-title">{$pageTranslations.t('cart.checkout.customerInfo')}</h2>
					
					<!-- Customer details would be displayed here -->
					<div class="customer-details">
						<p>Customer information would appear here...</p>
					</div>
					
					<!-- Delivery address would be displayed here -->
					<div class="delivery-details">
						<h3 class="section-title">{$pageTranslations.t('cart.checkout.deliveryAddress')}</h3>
						<p>Delivery address details would appear here...</p>
					</div>
					
					<button class="back-btn" on:click={goBackToCart}>
						← {$pageTranslations.t('cart.summary.continue_shopping')}
					</button>
				</div>
			</div>
		</div>
	</div>
</main>
{:else}
	<!-- Loading state while translations are initializing -->
	<main class="checkout-page">
		<div class="checkout-container">
			<h1 class="checkout-title">Loading...</h1>
		</div>
	</main>
{/if}

<style>
	.checkout-page {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 32px 0;
	}

	.checkout-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.checkout-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		text-align: center;
		margin-bottom: 40px;
	}

	.checkout-layout {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 32px;
		align-items: start;
	}

	/* Left Column - Order Summary */
	.checkout-summary-column {
		min-height: 400px;
	}

	.checkout-summary-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		padding: 24px;
	}

	.summary-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 20px 0;
		padding-bottom: 12px;
		border-bottom: 2px solid #f0f0f0;
	}

	.order-items {
		margin-bottom: 24px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.payment-method-section {
		margin-top: 24px;
	}

	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 16px 0;
	}

	.payment-buttons {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.payment-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		padding: 16px 24px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.payment-btn.google-pay {
		background: #4285f4;
		color: white;
	}

	.payment-btn.apple-pay {
		background: #000000;
		color: white;
	}

	.payment-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
	}

	.payment-icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.coming-soon-message {
		margin-top: 24px;
		padding: 16px;
		background: #e8f5e8;
		border: 1px solid #28a745;
		border-radius: 8px;
		text-align: center;
	}

	.coming-soon-message p {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #155724;
		margin: 0;
		font-weight: 500;
	}

	/* Right Column - Customer Information */
	.checkout-info-column {
		position: sticky;
		top: 32px;
	}

	.checkout-info-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		padding: 24px;
	}

	.info-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0 0 20px 0;
		padding-bottom: 12px;
		border-bottom: 2px solid #f0f0f0;
	}

	.customer-details, .delivery-details {
		margin-bottom: 24px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.back-btn {
		width: 100%;
		padding: 12px 20px;
		border-radius: 8px;
		border: 2px solid #4B766E;
		background: transparent;
		color: #4B766E;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: #4B766E;
		color: white;
	}

	/* Responsive Design */
	@media (max-width: 700px) {
		.checkout-layout {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.checkout-info-column {
			order: 2;
			position: static;
		}

		.checkout-summary-column {
			order: 1;
		}
	}
</style>