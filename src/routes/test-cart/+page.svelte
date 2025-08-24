<script lang="ts">
	import { cartStore, cartItems, cartTotals } from '$lib/stores/cart.store';
	import { notificationStore } from '$lib/stores/notifications';
	import { createClientProduct, type RawProduct } from '$lib/types/product.types';

	// Create some mock products for testing
	const mockRawProducts: RawProduct[] = [
		{
			id: '1',
			name: 'Lavender Essential Oil',
			price: 49900, // 499 UAH in kopiyky
			stock: 10,
			size: '30ml',
			flavor: 'Natural',
			categories: '["Essential Oils", "Aromatherapy"]',
			imageUrls: '[]'
		},
		{
			id: '2',
			name: 'Chamomile Tea Blend',
			price: 25000, // 250 UAH in kopiyky
			stock: 15,
			size: '100g',
			flavor: 'Herbal',
			categories: '["Tea", "Herbal"]',
			imageUrls: '[]'
		},
		{
			id: '3',
			name: 'Natural Honey',
			price: 35000, // 350 UAH in kopiyky
			stock: 8,
			size: '250g',
			flavor: 'Wildflower',
			categories: '["Honey", "Natural"]',
			imageUrls: '[]'
		}
	];

	function addToCart(rawProduct: RawProduct) {
		const clientProduct = createClientProduct(rawProduct);
		cartStore.addItem(clientProduct, 1);
		notificationStore.success(`${rawProduct.name} added to cart!`);
	}

	function formatPrice(kopiyky: number): string {
		return `${(kopiyky / 100).toFixed(2)} ₴`;
	}
</script>

<svelte:head>
	<title>Test Cart - Balance Botanica</title>
</svelte:head>

<main class="test-cart-page">
	<div class="container">
		<h1>Test Cart Functionality</h1>
		<p>Use this page to test adding items to the cart and verify the cart functionality works without authentication.</p>
		
		<!-- Mock Products -->
		<div class="products-grid">
			{#each mockRawProducts as product}
				<div class="product-card">
					<div class="product-image">
						<div class="no-image">📦</div>
					</div>
					<div class="product-info">
						<h3>{product.name}</h3>
						<p class="price">{formatPrice(product.price)}</p>
						<button 
							class="add-to-cart-btn"
							on:click={() => addToCart(product)}
						>
							Add to Cart
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- Current Cart Info -->
		<div class="cart-info">
			<h2>Current Cart Status</h2>
			<div class="cart-stats">
				<div class="stat-item">
					<span class="stat-label">Items in cart:</span>
					<span class="stat-value">{$cartTotals.itemCount}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Subtotal:</span>
					<span class="stat-value">{formatPrice($cartTotals.subtotal)}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Total:</span>
					<span class="stat-value total">{formatPrice($cartTotals.total)}</span>
				</div>
			</div>
			
			{#if $cartItems.length > 0}
				<h3>Cart Items:</h3>
				<div class="cart-items-preview">
					{#each $cartItems as item}
						<div class="cart-item-preview">
							<span class="item-name">{item.product.name.getUkrainian()}</span>
							<span class="item-quantity">x {item.quantity}</span>
							<span class="item-total">{formatPrice(item.product.price.getKopiyky() * item.quantity)}</span>
						</div>
					{/each}
				</div>
				
				<div class="test-actions">
					<a href="/cart" class="view-cart-btn">
						🛒 View Full Cart
					</a>
					<button 
						class="clear-cart-btn"
						on:click={() => cartStore.clear()}
					>
						Clear Cart
					</button>
				</div>
			{:else}
				<p class="empty-notice">Cart is empty. Add some products above!</p>
			{/if}
		</div>
	</div>
</main>

<style>
	.test-cart-page {
		padding: 40px 20px;
		background: #f8f9fa;
		min-height: 500px;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #222;
		margin-bottom: 20px;
		font-family: 'Nunito', sans-serif;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin: 40px 0;
	}

	.product-card {
		background: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.product-image {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 120px;
		background: #f5f5f5;
		border-radius: 6px;
		margin-bottom: 16px;
	}

	.no-image {
		font-size: 48px;
		opacity: 0.5;
	}

	.product-info h3 {
		margin: 0 0 8px 0;
		color: #222;
		font-family: 'Nunito', sans-serif;
	}

	.price {
		font-size: 18px;
		font-weight: 600;
		color: #4B766E;
		margin: 0 0 16px 0;
	}

	.add-to-cart-btn {
		width: 100%;
		padding: 12px;
		background: #4B766E;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-family: 'Nunito', sans-serif;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.add-to-cart-btn:hover {
		background: #3a5d56;
	}

	.cart-info {
		background: white;
		padding: 24px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-top: 40px;
	}

	.cart-info h2 {
		margin: 0 0 16px 0;
		color: #222;
		font-family: 'Nunito', sans-serif;
	}

	.cart-info h3 {
		margin: 20px 0 12px 0;
		color: #222;
		font-family: 'Nunito', sans-serif;
	}

	.cart-info ul {
		margin: 0;
		padding-left: 20px;
	}

	.cart-info li {
		margin-bottom: 8px;
		font-family: 'Nunito', sans-serif;
	}

	.clear-cart-btn {
		margin-top: 16px;
		padding: 8px 16px;
		background: #ff4444;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-family: 'Nunito', sans-serif;
		transition: background-color 0.2s;
	}

	.clear-cart-btn:hover {
		background: #cc0000;
	}
</style>