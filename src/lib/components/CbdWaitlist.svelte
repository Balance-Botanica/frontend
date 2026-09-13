<script lang="ts">
	import { t } from '../i18n';

	// CBD is not a product yet - this is a waitlist ("we're working on it").
	// The main product line is curcumin treats; CBD will be announced later.

	let email = $state('');
	let isSubmitting = $state(false);
	let status = $state<'idle' | 'success' | 'error'>('idle');

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const value = email.trim();
		if (!value) return;

		isSubmitting = true;
		status = 'idle';

		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: value, source: 'cbd_waitlist' })
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok || data.success === false) {
				status = 'error';
			} else {
				// Local backup so the lead is never lost, even if the backend was down
				try {
					const existing = JSON.parse(localStorage.getItem('bb_waitlist') || '[]');
					if (!existing.includes(value)) existing.push(value);
					localStorage.setItem('bb_waitlist', JSON.stringify(existing));
				} catch {
					// localStorage unavailable - ignore
				}
				status = 'success';
				email = '';
			}
		} catch {
			status = 'error';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div id="cbd-waitlist" class="w-full bg-[#3f6f68] py-12 md:py-16 lg:py-20">
	<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-2xl bg-white/10 p-8 ring-1 ring-white/20 backdrop-blur md:p-12">
			<div class="mx-auto max-w-3xl text-center">
				<!-- Badge -->
				<span
					class="mb-6 inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-green-100"
				>
					<span class="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-300"></span>
					{t('cbd_waitlist.badge')}
				</span>

				<!-- Title -->
				<h2 class="mb-4 text-3xl font-bold text-white md:text-4xl">
					{t('cbd_waitlist.title')}
				</h2>

				<!-- Subtitle -->
				<p class="mx-auto mb-8 max-w-2xl text-lg text-green-100">{t('cbd_waitlist.subtitle')}</p>

				{#if status === 'success'}
					<!-- Success state -->
					<div
						class="mx-auto max-w-md rounded-xl border border-green-300 bg-green-500/20 p-6 text-center"
					>
						<p class="mb-2 text-xl font-semibold text-white">{t('cbd_waitlist.success_title')}</p>
						<p class="text-green-100">{t('cbd_waitlist.success_text')}</p>
					</div>
				{:else}
					<!-- Waitlist form -->
					<form onsubmit={handleSubmit} class="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
						<div class="flex-1">
							<label for="cbd-waitlist-email" class="sr-only">Email</label>
							<input
								type="email"
								id="cbd-waitlist-email"
								bind:value={email}
								placeholder={t('cbd_waitlist.email_placeholder')}
								required
								class="w-full rounded-lg border border-white/25 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-green-300 focus:ring-2 focus:ring-green-300 focus:outline-none"
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting || !email.trim()}
							class="rounded-lg bg-[#4b766e] px-6 py-3 font-medium text-white transition-colors hover:bg-[#3d5f58] focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-[#3f6f68] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? '...' : t('cbd_waitlist.button')}
						</button>
					</form>

					{#if status === 'error'}
						<p class="mt-4 text-sm text-red-200">{t('cbd_waitlist.error')}</p>
					{/if}
				{/if}

				<!-- Auth hint: logged-in users will be notified on their account -->
				<p class="mt-6 text-sm text-green-200/90">
					{t('cbd_waitlist.auth_hint')}
					<a href="/login" class="font-medium text-white underline hover:text-green-100">
						{t('cbd_waitlist.login_link')}
					</a>
				</p>

				<!-- Privacy note -->
				<p class="mt-3 text-xs text-green-200/70">{t('cbd_waitlist.privacy_note')}</p>
			</div>
		</div>
	</div>
</div>
