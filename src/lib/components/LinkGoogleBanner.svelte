<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { user as firebaseUser, isPhoneOnlyUser } from '$lib/firebase/auth';
	import { shouldShowLinkBanner, dismissLinkBanner } from '$lib/stores/onboarding';

	// Cabinet-only nudge: phone-only users get one gentle offer to link Google
	// so the next login is a free 1-click instead of another paid SMS.

	let dismissed = $state(false);
	let busy = $state(false);
	let error = $state('');
	let done = $state(false);

	const onProfilePage = $derived(
		$page.url.pathname.includes('/profile') || $page.url.pathname.includes('/login')
	);
	const visible = $derived(
		!dismissed &&
			!done &&
			onProfilePage &&
			!!$firebaseUser &&
			isPhoneOnlyUser($firebaseUser) &&
			shouldShowLinkBanner()
	);

	function fallback(key: string, uk: string): string {
		try {
			const v = t(key) as unknown as string;
			return v && v !== key ? v : uk;
		} catch {
			return uk;
		}
	}

	function later() {
		dismissed = true;
		dismissLinkBanner();
	}

	async function link() {
		error = '';
		busy = true;
		try {
			const { linkGoogleToCurrentUser } = await import('$lib/firebase/auth');
			await linkGoogleToCurrentUser();
			done = true;
			window.location.reload();
		} catch (e: any) {
			console.error('[LinkGoogle] failed:', e?.message);
			error = e?.message || fallback('auth.link_google.error', 'Не вдалося привʼязати Google. Спробуйте ще раз.');
		} finally {
			busy = false;
		}
	}
</script>

{#if visible}
	<div
		class="mx-auto mb-4 flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#52796f]/25 bg-[#eef5f2] p-4 sm:flex-row sm:items-center"
		role="status"
	>
		<div class="flex-1">
			<p class="font-semibold text-gray-900">
				{fallback('auth.link_google.title', 'Входьте в 1 клік без СМС')}
			</p>
			<p class="mt-0.5 text-sm text-gray-600">
				{fallback(
					'auth.link_google.text',
					'Привʼяжіть Google до цього номера — наступного разу вхід буде миттєвим і безкоштовним.'
				)}
			</p>
			{#if error}
				<p class="mt-1 text-sm text-red-600" role="alert">{error}</p>
			{/if}
		</div>
		<div class="flex shrink-0 gap-2">
			<button
				onclick={link}
				disabled={busy}
				class="rounded-xl bg-[#52796f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3e5d56] disabled:opacity-50"
			>
				{busy
					? '...'
					: fallback('auth.link_google.button', 'Привʼязати Google')}
			</button>
			<button
				onclick={later}
				disabled={busy}
				class="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white disabled:opacity-50"
			>
				{fallback('auth.link_google.later', 'Пізніше')}
			</button>
		</div>
	</div>
{/if}
