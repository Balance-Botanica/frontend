<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		IBAN_PLACEHOLDER,
		IBAN_RECIPIENT_PLACEHOLDER,
		IBAN_BANK_PLACEHOLDER,
		IBAN_PURPOSE_TEMPLATE
	} from '$lib/config/payments';

	// Temporary manual-payment dialog: shows the (placeholder) FOP IBAN,
	// buyer pays by hand and confirms. Replaced by MonoPay once approved.

	export let show: boolean = false;
	export let totalLabel: string = '';

	const dispatch = createEventDispatcher<{
		paid: void;
		close: void;
	}>();

	let copied: string | null = null;
	let busy = false;

	async function copy(text: string, key: string) {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(text);
			} else {
				const ta = document.createElement('textarea');
				ta.value = text;
				document.body.appendChild(ta);
				ta.select();
				document.execCommand('copy');
				document.body.removeChild(ta);
			}
			copied = key;
			setTimeout(() => {
				if (copied === key) copied = null;
			}, 1500);
		} catch {
			// clipboard unavailable — user copies by hand
		}
	}

	function confirmPaid() {
		if (busy) return;
		busy = true;
		dispatch('paid');
		busy = false;
	}
</script>

{#if show}
	<div
		class="iban-overlay"
		role="dialog"
		aria-modal="true"
		aria-label="Оплата на IBAN"
	>
		<div class="iban-modal">
			<div class="iban-header">
				<div>
					<h2 class="iban-title">Оплата на картку / IBAN</h2>
					<p class="iban-subtitle">
						Перекажіть <strong>{totalLabel}</strong> за реквізитами нижче, потім натисніть «Я оплатив».
					</p>
				</div>
				<button class="iban-close" on:click={() => dispatch('close')} aria-label="Закрити">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6L18 18" />
					</svg>
				</button>
			</div>

			<div class="iban-rows">
				<div class="iban-row">
					<div class="iban-field">
						<span class="iban-label">IBAN</span>
						<span class="iban-value mono">{IBAN_PLACEHOLDER}</span>
					</div>
					<button class="copy-btn" on:click={() => copy(IBAN_PLACEHOLDER, 'iban')}>
						{copied === 'iban' ? '✓' : 'Копіювати'}
					</button>
				</div>
				<div class="iban-row">
					<div class="iban-field">
						<span class="iban-label">Отримувач</span>
						<span class="iban-value">{IBAN_RECIPIENT_PLACEHOLDER}</span>
					</div>
					<button class="copy-btn" on:click={() => copy(IBAN_RECIPIENT_PLACEHOLDER, 'name')}>
						{copied === 'name' ? '✓' : 'Копіювати'}
					</button>
				</div>
				<div class="iban-row">
					<div class="iban-field">
						<span class="iban-label">Банк</span>
						<span class="iban-value">{IBAN_BANK_PLACEHOLDER}</span>
					</div>
				</div>
				<div class="iban-row">
					<div class="iban-field">
						<span class="iban-label">Призначення</span>
						<span class="iban-value">{IBAN_PURPOSE_TEMPLATE}</span>
					</div>
					<button class="copy-btn" on:click={() => copy(IBAN_PURPOSE_TEMPLATE, 'purpose')}>
						{copied === 'purpose' ? '✓' : 'Копіювати'}
					</button>
				</div>
			</div>

			<p class="iban-note">Незабаром — оплата карткою в 1 клік через mono 🐈</p>

			<div class="iban-actions">
				<button class="paid-btn" on:click={confirmPaid} disabled={busy}>
					{busy ? '...' : 'Я оплатив — оформити замовлення'}
				</button>
				<button class="cancel-btn" on:click={() => dispatch('close')}>Скасувати</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.iban-overlay {
		position: fixed;
		inset: 0;
		z-index: 10000002;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		padding: 16px;
	}
	.iban-modal {
		width: 100%;
		max-width: 520px;
		background: #fff;
		border-radius: 20px;
		padding: 24px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
	}
	.iban-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 16px;
	}
	.iban-title {
		font-family: 'Nunito', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: #1a1a1a;
		margin: 0 0 6px 0;
	}
	.iban-subtitle {
		font-size: 14px;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}
	.iban-close {
		background: none;
		border: none;
		cursor: pointer;
		color: #999;
		padding: 4px;
		border-radius: 50%;
	}
	.iban-close:hover {
		background: #f0f0f0;
		color: #333;
	}
	.iban-rows {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 12px;
	}
	.iban-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: #f8f9fa;
		border: 1px solid #eee;
		border-radius: 12px;
		padding: 10px 12px;
	}
	.iban-field {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.iban-label {
		font-size: 12px;
		color: #999;
	}
	.iban-value {
		font-size: 15px;
		font-weight: 600;
		color: #1a1a1a;
		word-break: break-all;
	}
	.iban-value.mono {
		font-family: ui-monospace, monospace;
		font-size: 14px;
	}
	.copy-btn {
		flex-shrink: 0;
		background: #e0f0ed;
		color: var(--color-main);
		border: none;
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 13px;
		font-weight: 600;
		cursor: pointer;
		white-space: nowrap;
	}
	.copy-btn:hover {
		background: #d0e8e2;
	}
	.iban-note {
		font-size: 13px;
		color: #888;
		text-align: center;
		margin: 0 0 16px 0;
	}
	.iban-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.paid-btn {
		background: var(--color-main);
		color: #fff;
		border: none;
		border-radius: 12px;
		padding: 14px;
		font-size: 16px;
		font-weight: 700;
		cursor: pointer;
	}
	.paid-btn:hover:not(:disabled) {
		background: #3e5d56;
	}
	.paid-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.cancel-btn {
		background: none;
		border: none;
		color: #888;
		font-size: 14px;
		cursor: pointer;
		padding: 8px;
	}
	.cancel-btn:hover {
		color: #333;
	}
</style>
