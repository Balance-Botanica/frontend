<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { user as firebaseUser, getProviderIds, isPhoneOnlyUser } from '$lib/firebase/auth';
	import {
		trackAuthVisit,
		consumeOrderCompletedFlag,
		shouldShowLinkDialog,
		markLinkDialogShown,
		dismissLinkDialog
	} from '$lib/stores/onboarding';

	// Proactive nudge: fires only at smart moments (see onboarding store):
	//  A. right after an order — user is happy
	//  B. 2nd+ visit while still phone-only — SMS cost is now recurring
	//  C. profile view while unlinked — settings context already
	// CTA navigates to /profile#login-methods where linking actually lives.

	let visible = $state(false);
	let moment = $state<'order' | 'returner' | 'profile' | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const SHOW_DELAY_MS = 5000;

	function fallback(key: string, uk: string): string {
		try {
			const v = t(key) as unknown as string;
			return v && v !== key ? v : uk;
		} catch {
			return uk;
		}
	}

	function needsLink(): boolean {
		const u = $firebaseUser;
		if (!u) return false;
		if (isPhoneOnlyUser(u)) return true;
		const ids = getProviderIds(u);
		return !ids.includes('google.com') && !u.email;
	}

	// Re-evaluate on every navigation + auth change.
	$effect(() => {
		const pathname: string = $page.url.pathname;
		const authed = !!$firebaseUser;

		if (!authed || visible) return;

		const visits = trackAuthVisit();
		const justOrdered = consumeOrderCompletedFlag();
		const onProfilePage = pathname.includes('/profile');

		if (
			!shouldShowLinkDialog({
				isAuthenticated: authed,
				needsLink: needsLink(),
				pathname,
				justOrdered,
				authVisits: visits,
				onProfilePage
			})
		) {
			return;
		}

		moment = justOrdered ? 'order' : onProfilePage ? 'profile' : 'returner';
		if (timer) clearTimeout(timer);
		const atPath = pathname;
		timer = setTimeout(() => {
			// Re-check: user may have navigated into checkout meanwhile.
			const nowPath: string = window.location.pathname;
			if (nowPath.startsWith('/cart') || nowPath.startsWith('/checkout')) return;
			if (atPath !== nowPath && justOrdered) {
				// order moment survives one navigation (success → home)
			} else if (atPath !== nowPath) {
				return;
			}
			visible = true;
			markLinkDialogShown();
		}, SHOW_DELAY_MS);

		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	function close() {
		visible = false;
		dismissLinkDialog();
	}

	async function goToSettings() {
		const target = '/profile#login-methods';
		dismissLinkDialog();
		visible = false;
		try {
			await goto(target);
			// Ensure the anchor is in view even if already on /profile.
			setTimeout(() => {
				document.getElementById('login-methods')?.scrollIntoView({ behavior: 'smooth' });
			}, 150);
		} catch {
			window.location.href = target;
		}
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-[10000002] flex items-end justify-center bg-black/50 p-4 sm:items-center"
		role="dialog"
		aria-modal="true"
	>
		<div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
			<h2 class="text-xl font-bold text-gray-900">
				{#if moment === 'order'}
					{fallback('auth.link_dialog.title_order', 'Дякуємо за замовлення! 🎉')}
				{:else}
					{fallback('auth.link_dialog.title', 'Входьте без СМС')}
				{/if}
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				{#if moment === 'order'}
					{fallback(
						'auth.link_dialog.text_order',
						'Поки ми готуємо ваше замовлення — привʼяжіть Google або email в налаштуваннях. Наступний вхід буде в 1 клік і безкоштовним.'
					)}
				{:else if moment === 'profile'}
					{fallback(
						'auth.link_dialog.text_profile',
						'Ви вже в кабінеті — залишився один крок: привʼяжіть Google або email, щоб більше не чекати СМС.'
					)}
				{:else}
					{fallback(
						'auth.link_dialog.text_returner',
						'Ви повернулись — класно! Привʼяжіть Google або email, щоб входити в 1 клік без СМС.'
					)}
				{/if}
			</p>
			<div class="mt-5 flex gap-2">
				<button
					onclick={goToSettings}
					class="flex-1 rounded-xl bg-[#52796f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3e5d56]"
				>
					{fallback('auth.link_dialog.cta', 'Перейти в налаштування')}
				</button>
				<button
					onclick={close}
					class="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
				>
					{fallback('auth.link_dialog.later', 'Пізніше')}
				</button>
			</div>
		</div>
	</div>
{/if}
