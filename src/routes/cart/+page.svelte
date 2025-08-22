<script lang="ts">
	// Страница корзины использует общий лейаут из +layout.svelte
	// Поэтому не нужно импортировать Header, Footer, SubHeader
</script>

<svelte:head>
	<title>Корзина - Balance Botanica</title>
	<meta name="description" content="Ваша корзина покупок Balance Botanica" />
</svelte:head>

<main class="cart-page">
	<div class="cart-container">
		<h1 class="cart-title">Корзина</h1>
		<div class="cart-content">
			<p class="cart-empty">Ваша корзина пуста</p>
			<p class="cart-hint">Добавьте товары для продолжения покупок</p>
		</div>
	</div>
</main>

<style>
	.cart-page {
		min-height: 500px;
		background: #F8F7F6;
		padding: 40px 0;
	}

	.cart-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.cart-title {
		font-family: 'Nunito', sans-serif;
		font-size: 32px;
		font-weight: 600;
		color: #222222;
		text-align: center;
		margin-bottom: 40px;
	}

	.cart-content {
		text-align: center;
		padding: 60px 20px;
	}

	.cart-empty {
		font-family: 'Nunito', sans-serif;
		font-size: 24px;
		font-weight: 500;
		color: #666;
		margin-bottom: 16px;
	}

	.cart-hint {
		font-family: 'Nunito', sans-serif;
		font-size: 16px;
		color: #999;
	}
</style>
