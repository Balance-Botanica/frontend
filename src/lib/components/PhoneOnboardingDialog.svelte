<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { user as firebaseUser } from '$lib/firebase/auth';
	import {
		shouldShowPhoneDialog,
		markPhoneDialogShown,
		dismissPhoneDialog,
		markPhoneRegistered,
		getPrefilledPhone
	} from '$lib/stores/onboarding';

	// First-visit phone dialog: one gentle nudge per cooldown window, never spam.
	// Viber flow: user lands via /?phone=+380... link, number is prefilled.

	let visible = $state(false);
	let step = $state<'phone' | 'otp' | 'success'>('phone');
	let phone = $state('');
	let code = $state('');
	let busy = $state(false);
	let error = $state('');
	let resendIn = $state(0);
	let recaptchaReady = $state(false);
	let timer: ReturnType<typeof setInterval> | null = null;

	const SHOW_DELAY_MS = 8000;
	const RESEND_COOLDOWN_S = 60;

	function fallback(key: string, uk: string): string {
		try {
			const v = t(key) as unknown as string;
			return v && v !== key ? v : uk;
		} catch {
			return uk;
		}
	}

	onMount(() => {
		if (!browser) return;
		const isAuthed = !!$firebaseUser;
		const pathname = $page.url.pathname;
		if (!shouldShowPhoneDialog(isAuthed, pathname)) return;
		const prefilled = getPrefilledPhone($page.url.search);
		if (prefilled) phone = prefilled;
		const id = setTimeout(() => {
			visible = true;
			markPhoneDialogShown();
		}, SHOW_DELAY_MS);
		return () => clearTimeout(id);
	});

	function tickResend() {
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			resendIn -= 1;
			if (resendIn <= 0 && timer) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	}

	async function ensureRecaptcha(): Promise<any> {
		if (recaptchaReady && (window as any).__bbRecaptcha) return (window as any).__bbRecaptcha;
		const { RecaptchaVerifier } = await import('firebase/auth');
		const { auth } = await import('$lib/firebase/config');
		const verifier = new RecaptchaVerifier(auth, 'bb-recaptcha-container', { size: 'invisible' });
		await verifier.render().catch(() => {});
		(window as any).__bbRecaptcha = verifier;
		recaptchaReady = true;
		return verifier;
	}

	function normalizePhone(raw: string): string | null {
		const digits = raw.replace(/\D/g, '');
		if (digits.startsWith('380') && digits.length === 12) return '+' + digits;
		if (digits.length === 10 && digits.startsWith('0')) return '+38' + digits;
		if (digits.length === 9) return '+380' + digits;
		return null;
	}

	async function sendCode() {
		error = '';
		const normalized = normalizePhone(phone);
		if (!normalized) {
			error = fallback('auth.phone_dialog.error_invalid', 'Введіть номер у форматі +380 ...');
			return;
		}
		busy = true;
		try {
			const verifier = await ensureRecaptcha();
			const { sendPhoneVerification } = await import('$lib/firebase/auth');
			await sendPhoneVerification(normalized, verifier);
			phone = normalized;
			step = 'otp';
			resendIn = RESEND_COOLDOWN_S;
			tickResend();
		} catch (e: any) {
			console.error('[PhoneDialog] send failed:', e?.message);
			error = e?.message || fallback('auth.phone_dialog.error_generic', 'Не вдалося надіслати код. Спробуйте ще раз.');
			try {
				(window as any).__bbRecaptcha?.clear?.();
			} catch {}
			(window as any).__bbRecaptcha = undefined;
			recaptchaReady = false;
		} finally {
			busy = false;
		}
	}

	async function verify() {
		error = '';
		if (code.trim().length < 4) {
			error = fallback('auth.phone_dialog.error_code', 'Введіть код із СМС');
			return;
		}
		busy = true;
		try {
			const { verifyPhoneCode } = await import('$lib/firebase/auth');
			await verifyPhoneCode(code.trim());
			markPhoneRegistered();
			step = 'success';
			setTimeout(() => window.location.reload(), 1600);
		} catch (e: any) {
			console.error('[PhoneDialog] verify failed:', e?.message);
			error = e?.message || fallback('auth.phone_dialog.error_generic', 'Невірний код. Спробуйте ще раз.');
		} finally {
			busy = false;
		}
	}

	function close() {
		visible = false;
		dismissPhoneDialog();
	}
</script>

<div id="bb-recaptcha-container"></div>

{#if visible}
	<div
		class="fixed inset-0 z-[10000002] flex items-end justify-center bg-black/50 p-4 sm:items-center"
		role="dialog"
		aria-modal="true"
		aria-label={fallback('auth.phone_dialog.title', 'Вхід за номером телефону')}
	>
		<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<h2 class="text-xl font-bold text-gray-900">
						{fallback('auth.phone_dialog.title', 'Вхід за номером телефону')}
					</h2>
					<p class="mt-1 text-sm text-gray-600">
						{fallback(
							'auth.phone_dialog.subtitle',
							'Один код із СМС — і ваші замовлення та дозування збережуться.'
						)}
					</p>
				</div>
				<button
					onclick={close}
					class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					aria-label={fallback('auth.phone_dialog.close', 'Закрити')}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 6L6 18M6 6L18 18" />
					</svg>
				</button>
			</div>

			{#if step === 'phone'}
				<label for="bb-phone-input" class="mb-1 block text-sm font-medium text-gray-700">
					{fallback('auth.phone_dialog.phone_label', 'Номер телефону')}
				</label>
				<input
					id="bb-phone-input"
					type="tel"
					bind:value={phone}
					placeholder={fallback('auth.phone_dialog.phone_placeholder', '+380 __ ___ __ __')}
					disabled={busy}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/30 focus:outline-none"
				/>
				<button
					onclick={sendCode}
					disabled={busy || !phone.trim()}
					class="mt-4 w-full rounded-xl bg-[#52796f] px-4 py-3 font-semibold text-white transition hover:bg-[#3e5d56] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{busy
						? '...'
						: fallback('auth.phone_dialog.send_code', 'Отримати код')}
				</button>
			{:else if step === 'otp'}
				<p class="mb-2 text-sm text-gray-600">
					{fallback('auth.phone_dialog.code_hint', 'Код надіслано на')} <strong>{phone}</strong>
				</p>
				<label for="bb-otp-input" class="mb-1 block text-sm font-medium text-gray-700">
					{fallback('auth.phone_dialog.code_label', 'Код із СМС')}
				</label>
				<input
					id="bb-otp-input"
					type="text"
					inputmode="numeric"
					autocomplete="one-time-code"
					bind:value={code}
					placeholder={fallback('auth.phone_dialog.code_placeholder', '123456')}
					disabled={busy}
					class="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.3em] text-gray-900 focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/30 focus:outline-none"
				/>
				<button
					onclick={verify}
					disabled={busy || !code.trim()}
					class="mt-4 w-full rounded-xl bg-[#52796f] px-4 py-3 font-semibold text-white transition hover:bg-[#3e5d56] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{busy ? '...' : fallback('auth.phone_dialog.verify', 'Підтвердити')}
				</button>
				<button
					onclick={sendCode}
					disabled={busy || resendIn > 0}
					class="mt-2 w-full rounded-xl px-4 py-2 text-sm font-medium text-[#52796f] hover:underline disabled:no-underline disabled:opacity-50"
				>
					{resendIn > 0
						? `${fallback('auth.phone_dialog.resend', 'Надіслати ще раз')} (${resendIn})`
						: fallback('auth.phone_dialog.resend', 'Надіслати ще раз')}
				</button>
			{:else}
				<div class="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
					<p class="font-semibold text-green-900">
						{fallback('auth.phone_dialog.success_title', 'Готово! Ви увійшли.')}
					</p>
					<p class="mt-1 text-sm text-green-800">
						{fallback(
							'auth.phone_dialog.success_text',
							'Привʼяжіть Google в кабінеті — наступного разу вхід буде в 1 клік без СМС.'
						)}
					</p>
				</div>
			{/if}

			{#if error}
				<p class="mt-3 text-center text-sm text-red-600" role="alert">{error}</p>
			{/if}
		</div>
	</div>
{/if}
