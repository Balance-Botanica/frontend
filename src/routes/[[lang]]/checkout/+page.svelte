<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createPageTranslations } from '$lib/i18n/store';
	import SEO from '$lib/components/SEO.svelte';
	import { isAuthenticated } from '$lib/auth/supabase-store';
	import { browser } from '$app/environment';
	import { cartStore } from '$lib/stores/cart.store';

	// Detect language from optional route parameter
	const lang = $derived($page.params?.lang || 'uk-ua');

	// State for order success
	let orderSuccess = false;
	let lastOrder: any = null;

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Check for success parameter and load order data
	onMount(() => {
		console.log('[CHECKOUT] ===== CHECKOUT PAGE INITIALIZATION =====');

		// Check if user is authenticated
		if (!$isAuthenticated) {
			console.log('[CHECKOUT] ❌ User not authenticated, redirecting to cart');
			goto('/cart');
			return;
		}

		console.log('[CHECKOUT] ✅ User authenticated');

		// Check for success parameter
		const urlParams = new URLSearchParams($page.url.search);
		const successParam = urlParams.get('success');
		orderSuccess = successParam === 'true';

		console.log('[CHECKOUT] Success parameter:', successParam);
		console.log('[CHECKOUT] Order success flag:', orderSuccess);

		// Clear cart only after successful order and when user reaches checkout page
		if (orderSuccess) {
			console.log('[CHECKOUT] Order successful, clearing cart...');
			cartStore.clear();
		}

		// Load last order data if success
		if (orderSuccess && browser) {
			console.log('[CHECKOUT] Loading last order data from localStorage...');

			try {
				const storedOrder = localStorage.getItem('lastOrder');
				console.log('[CHECKOUT] Raw storedOrder from localStorage:', storedOrder);

				if (storedOrder) {
					const orderData = JSON.parse(storedOrder);
					console.log('[CHECKOUT] Parsed orderData:', orderData);

					// Check if order is recent (within last 24 hours)
					const orderTime = orderData.timestamp;
					const currentTime = Date.now();
					const timeDiff = currentTime - orderTime;

					console.log('[CHECKOUT] Order timestamp:', new Date(orderTime));
					console.log('[CHECKOUT] Current time:', new Date(currentTime));
					console.log('[CHECKOUT] Time difference (ms):', timeDiff);
					console.log('[CHECKOUT] Time difference (hours):', timeDiff / (60 * 60 * 1000));

					if (timeDiff < 24 * 60 * 60 * 1000) {
						// 24 hours
						console.log('[CHECKOUT] ✅ Order is recent, setting lastOrder');
						lastOrder = orderData.orderData;
						console.log('[CHECKOUT] Last order set:', lastOrder);
					} else {
						console.log('[CHECKOUT] ❌ Order is too old, removing from localStorage');
						// Old order data, remove it
						localStorage.removeItem('lastOrder');
					}
				} else {
					console.log('[CHECKOUT] ❌ No stored order found in localStorage');
				}
			} catch (error) {
				console.error('[CHECKOUT] ❌ Failed to load order data:', error);
				localStorage.removeItem('lastOrder');
			}
		}

		console.log('[CHECKOUT] ===== FINAL STATE =====');
		console.log('[CHECKOUT] orderSuccess:', orderSuccess);
		console.log('[CHECKOUT] lastOrder:', lastOrder);
		console.log('[CHECKOUT] Will show success:', orderSuccess && lastOrder);
		console.log('[CHECKOUT] ===== CHECKOUT PAGE INITIALIZATION COMPLETE =====');
	});

	// Go back to cart
	function goBackToCart() {
		goto('/cart');
	}

	// Format price helper
	function formatPrice(kopiyky: number): string {
		return `${(kopiyky / 100).toFixed(2)} ₴`;
	}
</script>

{#if $pageTranslations}
	<SEO
		title={$pageTranslations.t('cart.checkout.title')}
		description="Complete your order with Google Pay or Apple Pay"
	/>

	<main class="checkout-page">
		<div class="checkout-container">
			{#if orderSuccess && lastOrder}
				{@debug orderSuccess, lastOrder}
				{console.log('[CHECKOUT] ===== SHOWING SUCCESS MESSAGE =====')}
				{console.log('[CHECKOUT] orderSuccess:', orderSuccess)}
				{console.log('[CHECKOUT] lastOrder:', lastOrder)}
				{console.log('[CHECKOUT] Order ID:', lastOrder?.id)}
				<!-- Order Success with Details -->
				<div class="success-message">
					<div class="success-icon">
						<svg
							width="80"
							height="80"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22,4 12,14.01 9,11.01"></polyline>
						</svg>
					</div>

					<h1 class="success-title">
						{$pageTranslations?.t('cart.checkout.successTitle') || 'Thank you for your order!'}
					</h1>

					<p class="success-description">
						{$pageTranslations?.t('cart.checkout.successMessage') ||
							'We have received your order and will contact you shortly to confirm the details.'}
					</p>

					<!-- Order Details -->
					<div class="order-details">
						<div class="order-info">
							<h3>Order #{lastOrder.id}</h3>
							<p>Total: {formatPrice(lastOrder.total)}</p>
							<p>Items: {lastOrder.items?.length || 0}</p>
						</div>
					</div>

					<div class="success-actions">
						<button class="primary-btn" on:click={() => goto('/products')}>
							{$pageTranslations?.t('cart.checkout.continueShopping') || 'Continue Shopping'}
						</button>
						<a href="/orders" class="secondary-btn">
							{$pageTranslations?.t('cart.checkout.viewOrders') || 'View My Orders'}
						</a>
					</div>
				</div>
			{:else}
				{@debug orderSuccess, lastOrder}
				{console.log('[CHECKOUT] ===== SHOWING ACCESS DENIED =====')}
				{console.log('[CHECKOUT] orderSuccess:', orderSuccess)}
				{console.log('[CHECKOUT] lastOrder:', lastOrder)}
				{console.log(
					'[CHECKOUT] Condition not met: orderSuccess && lastOrder =',
					orderSuccess && lastOrder
				)}
				<!-- Regular Checkout Page (redirect to cart if accessed directly) -->
				<div class="success-message">
					<div class="error-icon">
						<svg
							width="80"
							height="80"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
					</div>

					<h1 class="success-title">Access Denied</h1>

					<p class="success-description">
						This page is only accessible after completing an order. Please go back to your cart.
					</p>

					<div class="success-actions">
						<button class="primary-btn" on:click={() => goto('/cart')}> Return to Cart </button>
					</div>
				</div>
			{/if}
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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkout-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.success-message {
		background: white;
		border-radius: 16px;
		padding: 48px 32px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		text-align: center;
	}

	.success-icon {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
	}

	.success-icon svg {
		color: #4b766e;
	}

	.success-title {
		font-family: 'Nunito', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: #1a1a1a;
		margin-bottom: 16px;
	}

	.success-description {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin-bottom: 32px;
		line-height: 1.5;
	}

	.success-actions {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.order-details {
		margin: 24px 0;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.order-info h3 {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #4b766e;
		margin: 0 0 8px 0;
	}

	.order-info p {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #666;
		margin: 4px 0;
	}

	.error-icon {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
		color: #dc3545;
	}

	.primary-btn,
	.secondary-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		padding: 12px 24px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
		display: inline-block;
	}

	.primary-btn {
		background: #4b766e;
		color: white;
		box-shadow: 0 4px 12px rgba(75, 118, 110, 0.3);
	}

	.primary-btn:hover {
		background: #3a5d56;
		transform: translateY(-2px);
	}

	.secondary-btn {
		background: #f5f5f5;
		color: #4b766e;
		border: 2px solid #4b766e;
	}

	.secondary-btn:hover {
		background: #4b766e;
		color: white;
		text-decoration: none;
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

	.customer-details,
	.delivery-details {
		margin-bottom: 24px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.form-group {
		margin-bottom: 16px;
	}

	label {
		display: block;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #4a4a4a;
		margin-bottom: 6px;
	}

	.form-input,
	.form-select {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #333;
		transition: border-color 0.2s;
	}

	.form-input:focus,
	.form-select:focus {
		border-color: #4b766e;
		outline: none;
	}

	.selected-address,
	.new-address-form,
	.no-address {
		margin-top: 16px;
		padding: 12px;
		background: white;
		border-radius: 8px;
		border: 1px solid #e0e0e0;
	}

	.selected-address h4,
	.new-address-form h4 {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin: 0 0 12px 0;
	}

	.address-summary {
		padding: 10px;
		background: #f0f8ff;
		border-radius: 6px;
		font-size: 14px;
	}

	.no-address p {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #666;
		margin: 0;
		text-align: center;
	}

	.back-btn {
		width: 100%;
		padding: 12px 20px;
		border-radius: 8px;
		border: 2px solid #4b766e;
		background: transparent;
		color: #4b766e;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.back-btn:hover {
		background: #4b766e;
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
