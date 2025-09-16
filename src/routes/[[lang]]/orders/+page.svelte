<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';
	import type { Order, OrderStatus } from '$lib/server/domain/interfaces/order.interface';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { createPageTranslations } from '$lib/i18n/store';

	// Get data from server
	const { data }: { data: PageData } = $props();

	// Detect language from optional route parameter
	const lang = $derived($page.params?.lang || 'uk-ua');

	// Create page translations
	const pageTranslations = createPageTranslations();

	// Page state from server data
	let orders: Order[] = data.orders || [];
	const error = data.error || '';

	console.log('[Orders Page Client] Initial data received:', {
		ordersCount: orders.length,
		hasError: !!error,
		error: error,
		orders: orders.map((o) => ({ id: o.id, status: o.status, total: o.total }))
	});

	// Page state for client-side updates
	const isLoading = false;
	let isCancelling: string | null = null;

	// Auto-sync orders when page loads - TEMPORARILY DISABLED
	onMount(async () => {
		console.log('[Orders Page] 🔄 Automatic sync DISABLED to prevent order creation');
		// await syncOrders();
		// console.log('[Orders Page] ✅ Automatic sync completed');
	});

	// Format price helper
	function formatPrice(kopiyky: number): string {
		return `${(kopiyky / 100).toFixed(2)} ₴`;
	}

	// Format date helper
	function formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('uk-UA', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Get status color for UI
	function getStatusColor(status: OrderStatus): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'shipped':
				return 'bg-purple-100 text-purple-800 border-purple-200';
			case 'delivered':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'cancelled':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	// Get status text using i18n
	function getStatusText(status: OrderStatus): string {
		if ($pageTranslations) {
			return $pageTranslations.t(`cart.orders.statuses.${status}`, { defaultValue: status });
		}
		return status;
	}

	// Cancel order function
	async function cancelOrder(orderId: string) {
		if (
			!confirm(
				$pageTranslations?.t('cart.orders.confirmCancel', {
					defaultValue: 'Are you sure you want to cancel this order?'
				})
			)
		) {
			return;
		}

		isCancelling = orderId;

		try {
			const response = await fetch(`/api/orders/${orderId}/cancel`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to cancel order');
			}

			// Update the order status in the local state
			orders = orders.map((order) =>
				order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order
			);

			// Show success message
			if ($pageTranslations) {
				alert(
					$pageTranslations.t('cart.orders.cancelledSuccess', {
						defaultValue: 'Order cancelled successfully'
					})
				);
			}
		} catch (error) {
			console.error('Failed to cancel order:', error);
			if ($pageTranslations) {
				alert(
					$pageTranslations.t('cart.orders.cancelledError', {
						defaultValue: 'Failed to cancel order. Please try again.'
					})
				);
			}
		} finally {
			isCancelling = null;
		}
	}

	// Sync orders from Google Sheets (automatic and silent)
	async function syncOrders() {
		console.log('[Orders Page] 🔄 Starting automatic sync with Google Sheets...');

		try {
			console.log('[Orders Page] 📡 Calling sync API...');
			const response = await fetch('/api/orders/sync', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			console.log(`[Orders Page] 📥 Sync API response status: ${response.status}`);

			const result = await response.json();
			console.log('[Orders Page] 📦 Sync result:', result);

			if (!response.ok) {
				throw new Error(result.error || 'Failed to sync orders');
			}

			// Update local orders state
			const oldCount = orders.length;
			orders = result.data || [];
			const newCount = orders.length;

			console.log(`[Orders Page] 📊 Orders updated: ${oldCount} → ${newCount}`);
			console.log('[Orders Page] ✅ Automatic sync completed successfully');
		} catch (error) {
			console.error('[Orders Page] ❌ Automatic sync failed:', error);
			// Don't show alerts for automatic sync - just log the error
		} finally {
			console.log('[Orders Page] 🔄 Sync process finished');
		}
	}
</script>

{#if $pageTranslations}
	<SEO
		title={$pageTranslations.t('cart.orders.meta.title', {
			defaultValue: 'My Orders | Balance Botanica'
		})}
		description={$pageTranslations.t('cart.orders.meta.description', {
			defaultValue: 'View your order history and track current orders'
		})}
	/>

	<main class="orders-page">
		<div class="orders-container">
			<!-- Header -->
			<div class="orders-header">
				<h1 class="orders-title">
					{$pageTranslations.t('cart.orders.title', { defaultValue: 'My Orders' })} ({orders.length})
				</h1>
			</div>

			<!-- Error state -->
			{#if error}
				<div class="error-state">
					<h1 class="orders-title">
						{$pageTranslations.t('cart.orders.title', { defaultValue: 'My Orders' })} ({orders.length})
					</h1>
					<div class="error-icon">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
					</div>
					<h2 class="error-title">
						{$pageTranslations.t('cart.orders.error.title', { defaultValue: 'Error' })}
					</h2>
					<p class="error-message">{error}</p>
				</div>
			{:else if orders.length === 0}
				<!-- Empty state -->
				<div class="empty-state">
					<div class="empty-icon">
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1"
						>
							<path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"></path>
						</svg>
					</div>
					<h2 class="empty-title">
						{$pageTranslations.t('cart.orders.empty.title', { defaultValue: 'No orders yet' })}
					</h2>
					<p class="empty-message">
						{$pageTranslations.t('cart.orders.empty.message', {
							defaultValue:
								"You haven't placed any orders yet. Start shopping to see your orders here."
						})}
					</p>
					<button class="shop-button" on:click={() => goto('/products')}>
						{$pageTranslations.t('cart.orders.empty.shopNow', { defaultValue: 'Shop Now' })}
					</button>
				</div>
			{:else}
				<!-- Orders list -->
				<div class="orders-list">
					{#each orders as order (order.id)}
						<div class="order-card">
							<div class="order-header">
								<div class="order-info">
									<h3 class="order-number">
										{$pageTranslations.t('cart.orders.orderNumber', {
											defaultValue: 'Order #'
										})}{order.id}
									</h3>
									<p class="order-date">{formatDate(order.createdAt)}</p>
								</div>
								<div class="order-status">
									<span class="status-badge {getStatusColor(order.status)}">
										{getStatusText(order.status)}
									</span>
								</div>
							</div>

							<div class="order-content">
								<!-- Order items -->
								<div class="order-items">
									<h4>
										{$pageTranslations.t('cart.orders.items', { defaultValue: 'Items' })} ({order
											.items?.length || 0})
									</h4>
									<div class="items-list">
										{#each order.items || [] as item}
											<div class="item-row">
												<span class="item-name">{item.productName}</span>
												<span class="item-details">
													{item.quantity} × {formatPrice(item.price)}
												</span>
												<span class="item-total">{formatPrice(item.total)}</span>
											</div>
										{/each}
									</div>
								</div>

								<!-- Order summary -->
								<div class="order-summary">
									<div class="summary-row">
										<span
											>{$pageTranslations.t('cart.orders.total', { defaultValue: 'Total' })}:</span
										>
										<span class="total-amount">{formatPrice(order.total)}</span>
									</div>
								</div>
							</div>

							{#if order.deliveryAddress}
								<div class="order-delivery">
									<h4>
										{$pageTranslations.t('cart.orders.deliveryAddress', {
											defaultValue: 'Delivery Address'
										})}
									</h4>
									<div class="address-info">
										{#if order.deliveryAddress.name}
											<p><strong>{order.deliveryAddress.name}</strong></p>
										{/if}
										{#if order.deliveryAddress.npWarehouse}
											<p>Nova Poshta: {order.deliveryAddress.npWarehouse}</p>
										{/if}
										{#if order.deliveryAddress.npCityName}
											<p>{order.deliveryAddress.npCityName}</p>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Order Actions -->
							{#if order.status !== 'delivered' && order.status !== 'cancelled'}
								<div class="order-actions">
									<button
										class="cancel-order-btn"
										on:click={() => cancelOrder(order.id)}
										disabled={isCancelling === order.id}
									>
										{#if isCancelling === order.id}
											{$pageTranslations.t('cart.orders.cancelling', {
												defaultValue: 'Cancelling...'
											})}
										{:else}
											{$pageTranslations.t('cart.orders.cancelOrder', {
												defaultValue: 'Cancel Order'
											})}
										{/if}
									</button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
{:else}
	<main class="orders-page">
		<div class="orders-container">
			<div class="orders-header">
				<h1 class="orders-title">
					{($pageTranslations as any)?.t('cart.orders.loadingPage', {
						defaultValue: 'Loading...'
					}) || 'Loading...'} ({orders.length})
				</h1>
			</div>
		</div>
	</main>
{/if}

<style>
	.orders-page {
		min-height: calc(100vh - 160px);
		background: #f8f9fa;
		padding: 32px 0;
	}

	.orders-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.orders-header {
		display: flex;
		align-items: center;
		margin-bottom: 32px;
	}

	.orders-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0;
	}

	/* Loading state */
	.loading-state {
		text-align: center;
		padding: 64px 0;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #4b766e;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 16px;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Error state */
	.error-state,
	.empty-state {
		text-align: center;
		padding: 64px 32px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	}

	.error-icon,
	.empty-icon {
		margin-bottom: 24px;
		display: flex;
		justify-content: center;
		color: #666;
	}

	.error-title,
	.empty-title {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 600;
		color: #333;
		margin-bottom: 16px;
	}

	.error-message,
	.empty-message {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #666;
		margin-bottom: 24px;
		line-height: 1.5;
	}

	.retry-button,
	.shop-button {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		padding: 12px 24px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-button {
		background: #4b766e;
		color: white;
	}

	.retry-button:hover {
		background: #3d5f58;
	}

	.shop-button {
		background: #4b766e;
		color: white;
	}

	.shop-button:hover {
		background: #3d5f58;
	}

	/* Orders list */
	.orders-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.order-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		overflow: hidden;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px;
		border-bottom: 1px solid #f0f0f0;
		background: #f8f9fa;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
	}

	.order-info h3 {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #4b766e;
		margin: 0 0 4px 0;
	}

	.order-date {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #666;
		margin: 0;
	}

	.status-badge {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 20px;
		border: 1px solid;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.order-content {
		padding: 24px;
	}

	.order-items h4,
	.order-delivery h4 {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin: 0 0 16px 0;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.item-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.item-name {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 500;
		color: #333;
		flex: 1;
	}

	.item-details {
		font-family: 'Nunito', sans-serif;
		font-size: 12px;
		color: #666;
		margin-right: 16px;
	}

	.item-total {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: #4b766e;
	}

	.order-summary {
		border-top: 1px solid #f0f0f0;
		padding-top: 16px;
		margin-bottom: 24px;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.summary-row span:first-child {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		font-weight: 500;
		color: #333;
	}

	.total-amount {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 700;
		color: #4b766e;
	}

	.order-delivery {
		padding: 24px;
		border-top: 1px solid #f0f0f0;
		background: #f8f9fa;
	}

	.address-info {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		color: #666;
		line-height: 1.5;
	}

	.address-info p {
		margin: 4px 0;
	}

	.address-info strong {
		color: #333;
	}

	/* Order Actions */
	.order-actions {
		padding: 24px;
		border-top: 1px solid #f0f0f0;
		background: #f8f9fa;
		display: flex;
		justify-content: flex-end;
	}

	.cancel-order-btn {
		font-family: 'Nunito', sans-serif;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		background: #dc3545;
		color: white;
	}

	.cancel-order-btn:hover:not(:disabled) {
		background: #c82333;
		transform: translateY(-1px);
	}

	.cancel-order-btn:disabled {
		background: #6c757d;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.cancel-order-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.orders-container {
			padding: 0 16px;
		}

		.orders-title {
			font-size: 28px;
		}

		.order-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
			padding: 16px;
		}

		.item-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		.item-details {
			margin-right: 0;
		}
	}

	@media (max-width: 480px) {
		.orders-page {
			padding: 16px 0;
		}

		.orders-title {
			font-size: 24px;
		}

		.order-content {
			padding: 16px;
		}

		.order-delivery {
			padding: 16px;
		}

		.cancel-order-btn {
			font-size: 12px;
			padding: 8px 16px;
		}

		.order-actions {
			padding: 16px;
		}
	}
</style>
