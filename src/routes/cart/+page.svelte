<script lang="ts">
	import { cartStore, cartItems, cartTotals, cartIsEmpty } from '$lib/stores/cart.store';
	import { isAuthenticated } from '$lib/auth/supabase-store';
	import { goto } from '$app/navigation';
	import { notificationStore } from '$lib/stores/notifications';

	// Handle quantity changes
	function updateQuantity(productId: string, newQuantity: number) {
		if (newQuantity <= 0) {
			cartStore.removeItem(productId);
			notificationStore.success('Item removed from cart');
		} else {
			cartStore.updateQuantity(productId, newQuantity);
		}
	}

	// Handle item removal
	function removeItem(productId: string) {
		cartStore.removeItem(productId);
		notificationStore.success('Item removed from cart');
	}

	// Handle checkout
	function handleCheckout() {
		if (!$isAuthenticated) {
			// Show notification and redirect to login
			notificationStore.info('Please sign in to proceed to checkout', {
				title: 'Authentication Required',
				duration: 8000,
				actions: [
					{
						label: 'Sign In',
						action: () => goto('/auth/login'),
						style: 'primary'
					},
					{
						label: 'Create Account',
						action: () => goto('/auth/register'),
						style: 'secondary'
					}
				]
			});
			return;
		}
		
		// TODO: Implement actual checkout flow
		notificationStore.success('Checkout functionality will be implemented soon!');
	}

	// Continue shopping
	function continueShopping() {
		goto('/products');
	}

	// Format price in UAH
	function formatPrice(kopiyky: number): string {
		return `${(kopiyky / 100).toFixed(2)} ₴`;
	}
</script>

<svelte:head>
	<title>Shopping Cart - Balance Botanica</title>
	<meta name="description" content="Review your Balance Botanica cart items and proceed to checkout" />
</svelte:head>

<main class="cart-page">
	<div class="cart-container">
		<h1 class="cart-title">Shopping Cart</h1>
		
		{#if $cartIsEmpty}
			<!-- Empty Cart -->
			<div class="empty-cart">
				<div class="empty-cart-icon">
					<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 8m2-8h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"></path>
					</svg>
				</div>
				<p class="cart-empty">Your cart is empty</p>
				<p class="cart-hint">Add some products to start shopping</p>
				<button class="continue-shopping-btn" on:click={continueShopping}>
					Continue Shopping
				</button>
			</div>
		{:else}
			<!-- Cart Layout: 3/4 Products + 1/4 Summary -->
			<div class="cart-layout">
				<!-- Left Column: Cart Items (3/4) -->
				<div class="cart-items-column">
					<div class="cart-items-container">
						<h2 class="section-title">Items in your cart ({$cartTotals.itemCount})</h2>
						
						<div class="cart-items-list">
							{#each $cartItems as item (item.product.id.getValue())}
								<div class="cart-item">
									<!-- Product Image -->
									<div class="item-image">
										{#if item.product.imageUrls.length > 0}
											<img src={item.product.imageUrls[0]} alt={item.product.name.getUkrainian()} />
										{:else}
											<div class="no-image">📦</div>
										{/if}
									</div>
									
									<!-- Product Details -->
									<div class="item-details">
										<h3 class="item-name">{item.product.name.getUkrainian()}</h3>
										<div class="item-specs">
											<span class="spec-item">{item.product.size}</span>
											<span class="spec-divider">•</span>
											<span class="spec-item">{item.product.flavor}</span>
										</div>
										<p class="item-price">{formatPrice(item.product.price.getKopiyky())} each</p>
									</div>
									
									<!-- Quantity Controls -->
									<div class="item-quantity">
										<label class="quantity-label">Quantity:</label>
										<div class="quantity-controls">
											<button 
												class="quantity-btn decrease" 
												on:click={() => updateQuantity(item.product.id.getValue(), item.quantity - 1)}
												disabled={item.quantity <= 1}
												title="Decrease quantity"
											>
												-
											</button>
											<input 
												type="number" 
												class="quantity-input" 
												value={item.quantity}
												min="1"
												max="99"
												on:change={(e) => {
													const value = parseInt(e.currentTarget.value) || 1;
													updateQuantity(item.product.id.getValue(), Math.max(1, Math.min(99, value)));
												}}
											/>
											<button 
												class="quantity-btn increase" 
												on:click={() => updateQuantity(item.product.id.getValue(), item.quantity + 1)}
												disabled={item.quantity >= 99}
												title="Increase quantity"
											>
												+
											</button>
										</div>
									</div>
									
									<!-- Item Total -->
									<div class="item-total">
										<p class="total-label">Total:</p>
										<p class="total-price">{formatPrice(item.product.price.getKopiyky() * item.quantity)}</p>
									</div>
									
									<!-- Remove Button -->
									<button 
										class="remove-btn" 
										on:click={() => removeItem(item.product.id.getValue())}
										title="Remove item from cart"
									>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
											<path d="M18 6L6 18M6 6l12 12"></path>
										</svg>
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>
				
				<!-- Right Column: Order Summary (1/4) -->
				<div class="cart-summary-column">
					<div class="cart-summary-container">
						<h2 class="summary-title">Order Summary</h2>
						
						<!-- Summary Details -->
						<div class="summary-details">
							<div class="summary-line">
								<span class="summary-label">Subtotal ({$cartTotals.itemCount} items):</span>
								<span class="summary-value">{formatPrice($cartTotals.subtotal)}</span>
							</div>
							<div class="summary-line">
								<span class="summary-label">Tax (20% VAT):</span>
								<span class="summary-value">{formatPrice($cartTotals.tax)}</span>
							</div>
							<div class="summary-line">
								<span class="summary-label">Shipping:</span>
								<span class="summary-value">
									{#if $cartTotals.shipping === 0}
										<span class="free-label">Free</span>
									{:else}
										{formatPrice($cartTotals.shipping)}
									{/if}
								</span>
							</div>
							
							{#if $cartTotals.subtotalUAH < 1000}
								<div class="free-shipping-notice">
									<p class="notice-text">
										💡 Add {formatPrice((1000 - $cartTotals.subtotalUAH) * 100)} more for <strong>free shipping!</strong>
									</p>
								</div>
							{/if}
							
							<div class="summary-divider"></div>
							
							<div class="summary-total">
								<span class="total-label">Total:</span>
								<span class="total-value">{formatPrice($cartTotals.total)}</span>
							</div>
						</div>
						
						<!-- Action Buttons -->
						<div class="summary-actions">
							<button class="checkout-btn" on:click={handleCheckout}>
								{#if $isAuthenticated}
									🛒 Proceed to Checkout
								{:else}
									🔐 Sign In to Checkout
								{/if}
							</button>
							
							<button class="continue-shopping-btn secondary" on:click={continueShopping}>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Base Page Styles */
	.cart-page {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 32px 0;
	}

	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.cart-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		text-align: center;
		margin-bottom: 40px;
	}

	/* Empty Cart Styles */
	.empty-cart {
		text-align: center;
		padding: 80px 20px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		max-width: 500px;
		margin: 0 auto;
	}

	.empty-cart-icon {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
		opacity: 0.6;
	}

	.cart-empty {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 600;
		color: #333;
		margin-bottom: 12px;
	}

	.cart-hint {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin-bottom: 32px;
	}

	/* Main Cart Layout - 3/4 + 1/4 */
	.cart-layout {
		display: grid;
		grid-template-columns: 3fr 1fr;
		gap: 32px;
		align-items: start;
	}

	/* Left Column - Cart Items (3/4) */
	.cart-items-column {
		min-height: 400px;
	}

	.cart-items-container {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #1a1a1a;
		padding: 24px 24px 16px 24px;
		margin: 0 0 8px 0;
		border-bottom: 1px solid #eee;
	}

	.cart-items-list {
		padding: 0 24px 24px 24px;
	}

	/* Individual Cart Item */
	.cart-item {
		display: grid;
		grid-template-columns: 100px 1fr auto auto auto;
		gap: 20px;
		align-items: center;
		padding: 24px 0;
		border-bottom: 1px solid #f0f0f0;
		position: relative;
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.cart-item:hover {
		background-color: #f8f9fa;
		border-radius: 8px;
		/* Remove margin/padding changes that cause button jumping */
	}

	/* Product Image */
	.item-image {
		width: 100px;
		height: 100px;
		border-radius: 12px;
		overflow: hidden;
		background: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid #eee;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.no-image {
		font-size: 32px;
		opacity: 0.5;
	}

	/* Product Details */
	.item-details {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}

	.item-name {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 600;
		color: #1a1a1a;
		margin: 0;
		line-height: 1.3;
	}

	.item-specs {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #666;
	}

	.spec-item {
		background: #f0f0f0;
		padding: 4px 8px;
		border-radius: 6px;
		font-weight: 500;
	}

	.spec-divider {
		color: #ccc;
	}

	.item-price {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin: 0;
	}

	/* Quantity Controls */
	.item-quantity {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.quantity-label {
		font-size: 12px;
		color: #666;
		font-weight: 500;
		text-transform: uppercase;
	}

	.quantity-controls {
		display: flex;
		align-items: center;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	.quantity-btn {
		width: 36px;
		height: 36px;
		border: none;
		background: #f8f9fa;
		color: #333;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 16px;
		transition: all 0.2s ease;
	}

	.quantity-btn:hover:not(:disabled) {
		background: #e9ecef;
		color: #4B766E;
	}

	.quantity-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.quantity-input {
		width: 50px;
		height: 36px;
		border: none;
		text-align: center;
		font-weight: 600;
		font-size: 14px;
		color: #333;
		background: white;
	}

	.quantity-input:focus {
		outline: 2px solid #4B766E;
	}

	/* Item Total and Remove Button */
	.item-total {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.total-label {
		font-size: 12px;
		color: #666;
		font-weight: 500;
		text-transform: uppercase;
		margin: 0;
	}

	.total-price {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #4B766E;
		margin: 0;
	}

	.remove-btn {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 32px;
		height: 32px;
		border: none;
		background: #fee;
		color: #dc3545;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		z-index: 10;
	}

	.remove-btn:hover {
		background: #dc3545;
		color: white;
		transform: scale(1.1);
	}

	/* Right Column - Summary (1/4) */
	.cart-summary-column {
		position: sticky;
		top: 32px;
	}

	.cart-summary-container {
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

	.summary-line {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
	}

	.summary-label {
		color: #666;
	}

	.summary-value {
		color: #333;
		font-weight: 600;
	}

	.free-label {
		color: #28a745;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 12px;
	}

	.free-shipping-notice {
		background: #e8f5e8;
		border: 1px solid #28a745;
		border-radius: 8px;
		padding: 12px;
		margin: 16px 0;
		text-align: center;
	}

	.notice-text {
		font-size: 13px;
		color: #155724;
		margin: 0;
	}

	.summary-divider {
		height: 2px;
		background: #e0e0e0;
		margin: 16px 0;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
		margin-bottom: 24px;
	}

	.total-label {
		font-family: 'Nunito', sans-serif;
		font-size: 18px;
		font-weight: 700;
		color: #1a1a1a;
	}

	.total-value {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: #4B766E;
	}

	.summary-actions {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.checkout-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		padding: 16px 24px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		background: #4B766E;
		color: white;
		box-shadow: 0 4px 12px rgba(75, 118, 110, 0.3);
	}

	.checkout-btn:hover {
		background: #3a5d56;
		transform: translateY(-2px);
	}

	.continue-shopping-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		padding: 12px 20px;
		border-radius: 8px;
		border: 2px solid #4B766E;
		cursor: pointer;
		transition: all 0.2s ease;
		background: transparent;
		color: #4B766E;
	}

	.continue-shopping-btn:hover {
		background: #4B766E;
		color: white;
	}

	.empty-cart .continue-shopping-btn {
		background: #4B766E;
		color: white;
		border: none;
		padding: 16px 32px;
		font-size: 16px;
		font-weight: 600;
	}

	/* Responsive Design - 700px Breakpoint */
	@media (max-width: 700px) {
		.cart-layout {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.cart-summary-column {
			order: 2;
			position: static;
		}

		.cart-items-column {
			order: 1;
		}

		.cart-item {
			grid-template-columns: 80px 1fr;
			gap: 16px;
		}

		.item-quantity {
			grid-column: 1 / -1;
			flex-direction: row;
			justify-content: flex-start;
			margin-top: 12px;
		}

		.item-total {
			grid-column: 1 / -1;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 8px;
		}
	}
</style>
