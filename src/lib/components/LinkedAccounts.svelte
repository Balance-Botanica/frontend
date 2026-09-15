<script lang="ts">
	import { t } from '$lib/i18n';
	import { user as firebaseUser, getProviderIds } from '$lib/firebase/auth';

	// "Login methods" settings section (id="login-methods").
	// The link-nudge dialog navigates here — this is where linking lives.

	let googleBusy = $state(false);
	let emailBusy = $state(false);
	let linkEmail = $state('');
	let emailSent = $state(false);
	let error = $state('');

	const providers = $derived(getProviderIds($firebaseUser));
	const hasGoogle = $derived(providers.includes('google.com'));
	const hasEmail = $derived(
		providers.includes('password') || providers.includes('emailLink') || !!$firebaseUser?.email
	);
	const phone = $derived($firebaseUser?.phoneNumber || '');
	const email = $derived($firebaseUser?.email || '');

	function fallback(key: string, uk: string): string {
		try {
			const v = t(key) as unknown as string;
			return v && v !== key ? v : uk;
		} catch {
			return uk;
		}
	}

	async function linkGoogle() {
		error = '';
		googleBusy = true;
		try {
			const { linkGoogleToCurrentUser } = await import('$lib/firebase/auth');
			await linkGoogleToCurrentUser();
			window.location.reload();
		} catch (e: any) {
			console.error('[LinkedAccounts] google link failed:', e?.message);
			error = e?.message || fallback('auth.link_google.error', 'Не вдалося привʼязати Google. Спробуйте ще раз.');
		} finally {
			googleBusy = false;
		}
	}

	async function sendLink() {
		error = '';
		const value = linkEmail.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			error = fallback('auth.email_link.error_invalid', 'Введіть коректний email');
			return;
		}
		emailBusy = true;
		try {
			const { sendLinkEmailToCurrentUser } = await import('$lib/firebase/auth');
			await sendLinkEmailToCurrentUser(value);
			emailSent = true;
		} catch (e: any) {
			console.error('[LinkedAccounts] email link failed:', e?.message);
			error = e?.message || fallback('auth.email_link.error_generic', 'Не вдалося надіслати посилання. Спробуйте ще раз.');
		} finally {
			emailBusy = false;
		}
	}
</script>

<section id="login-methods" class="profile-section" aria-label="Login methods">
	<h2 class="section-title">
		{fallback('auth.linked_accounts.title', 'Способи входу')}
	</h2>
	<p class="section-hint">
		{fallback(
			'auth.linked_accounts.hint',
			'Чим більше способів — тим рідше потрібна СМС. Привʼяжіть Google або email.'
		)}
	</p>

	<div class="methods">
		<!-- Phone row -->
		<div class="method-row">
			<span class="method-icon" aria-hidden="true">📱</span>
			<div class="method-info">
				<p class="method-name">{fallback('auth.linked_accounts.phone', 'Телефон')}</p>
				<p class="method-value">{phone || '—'}</p>
			</div>
			{#if phone}
				<span class="badge on">{fallback('auth.linked_accounts.connected', 'Підключено')}</span>
			{/if}
		</div>

		<!-- Google row -->
		<div class="method-row">
			<span class="method-icon" aria-hidden="true">G</span>
			<div class="method-info">
				<p class="method-name">Google</p>
				<p class="method-value">
					{hasGoogle
						? fallback('auth.linked_accounts.connected', 'Підключено')
						: fallback('auth.linked_accounts.google_hint', 'Вхід в 1 клік, без СМС')}
				</p>
			</div>
			{#if hasGoogle}
				<span class="badge on">{fallback('auth.linked_accounts.connected', 'Підключено')}</span>
			{:else}
				<button onclick={linkGoogle} disabled={googleBusy} class="action-btn">
					{googleBusy ? '...' : fallback('auth.link_google.button', 'Привʼязати Google')}
				</button>
			{/if}
		</div>

		<!-- Email link row -->
		<div class="method-row">
			<span class="method-icon" aria-hidden="true">✉️</span>
			<div class="method-info">
				<p class="method-name">{fallback('auth.linked_accounts.email', 'Email-посилання')}</p>
				{#if hasEmail && email}
					<p class="method-value">{email}</p>
				{:else if emailSent}
					<p class="method-value ok">
						{fallback('auth.email_link.sent', 'Посилання надіслано! Відкрийте лист на цьому ж пристрої.')}
					</p>
				{:else}
					<div class="email-link-form">
						<input
							type="email"
							bind:value={linkEmail}
							placeholder="email@example.com"
							disabled={emailBusy}
							aria-label="Email"
						/>
						<button onclick={sendLink} disabled={emailBusy || !linkEmail.trim()} class="action-btn">
							{emailBusy ? '...' : fallback('auth.email_link.send', 'Надіслати посилання')}
						</button>
					</div>
				{/if}
			</div>
			{#if hasEmail}
				<span class="badge on">{fallback('auth.linked_accounts.connected', 'Підключено')}</span>
			{/if}
		</div>
	</div>

	{#if error}
		<p class="row-error" role="alert">{error}</p>
	{/if}
</section>

<style>
	.section-title {
		font-family: 'Nunito', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: #333;
		margin: 0 0 4px 0;
	}
	.section-hint {
		font-size: 14px;
		color: #666;
		margin: 0 0 16px 0;
	}
	.methods {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.method-row {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #f9f9f9;
		border: 1px solid #eee;
		border-radius: 12px;
		padding: 12px 16px;
	}
	.method-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #e0f0ed;
		font-weight: 700;
		color: var(--color-main);
		flex-shrink: 0;
	}
	.method-info {
		flex: 1;
		min-width: 0;
	}
	.method-name {
		font-weight: 600;
		font-size: 15px;
		color: #333;
		margin: 0;
	}
	.method-value {
		font-size: 14px;
		color: #666;
		margin: 2px 0 0 0;
		word-break: break-all;
	}
	.method-value.ok {
		color: var(--color-main);
	}
	.badge {
		font-size: 12px;
		font-weight: 600;
		padding: 4px 10px;
		border-radius: 20px;
		flex-shrink: 0;
	}
	.badge.on {
		background: #e0f0ed;
		color: var(--color-main);
	}
	.action-btn {
		background: var(--color-main);
		color: #fff;
		border: none;
		border-radius: 8px;
		padding: 8px 14px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		flex-shrink: 0;
		white-space: nowrap;
	}
	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.email-link-form {
		display: flex;
		gap: 8px;
		margin-top: 6px;
		flex-wrap: wrap;
	}
	.email-link-form input {
		flex: 1;
		min-width: 180px;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 14px;
	}
	.row-error {
		margin-top: 12px;
		font-size: 14px;
		color: #dc2626;
	}
</style>
