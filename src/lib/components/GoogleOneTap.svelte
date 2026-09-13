<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Google One Tap: returning visitors get "Continue as Name" instead of
	// typing anything. NOT a replacement for the OAuth button below — One Tap
	// only appears when the browser already holds a Google session; the button
	// covers new/incognito users. Falls back silently when unavailable.

	let busy = $state(false);
	let error = $state('');

	function gsi(): any | undefined {
		return (window as any)?.google?.accounts?.id;
	}

	function loadGsi(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (gsi()) return resolve();
			const existing = document.querySelector('script[data-gsi]');
			if (existing) {
				existing.addEventListener('load', () => resolve());
				existing.addEventListener('error', () => reject(new Error('GSI load failed')));
				return;
			}
			const s = document.createElement('script');
			s.src = 'https://accounts.google.com/gsi/client';
			s.async = true;
			s.defer = true;
			s.dataset.gsi = '1';
			s.onload = () => resolve();
			s.onerror = () => reject(new Error('GSI load failed'));
			document.head.appendChild(s);
		});
	}

	async function handleCredential(response: { credential?: string }) {
		if (!response?.credential || busy) return;
		busy = true;
		error = '';
		try {
			const res = await fetch('/api/auth/google-onetap', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken: response.credential })
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok || !data?.success) {
				throw new Error(data?.error || 'Google sign-in failed');
			}
			const redirectTo = $page.url.searchParams.get('redirect') || '/';
			await goto(redirectTo);
			window.location.reload();
		} catch (e: any) {
			console.error('[OneTap] sign-in failed:', e?.message);
			error = e?.message || 'Google sign-in failed';
			// Leave the classic OAuth button below as the fallback path.
		} finally {
			busy = false;
		}
	}

	onMount(async () => {
		if (!browser || !PUBLIC_GOOGLE_CLIENT_ID) return;
		try {
			await loadGsi();
			const accounts = gsi();
			if (!accounts) return;
			accounts.initialize({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				callback: handleCredential,
				auto_select: false,
				cancel_on_tap_outside: true,
				use_fedcm_for_prompt: true
			});
			accounts.prompt(() => {
				// dismissed / skipped / no session — silent, OAuth button remains
			});
		} catch (e) {
			console.warn('[OneTap] unavailable:', (e as Error)?.message);
		}
	});
</script>

{#if error}
	<p class="mx-auto mt-3 max-w-md text-center text-sm text-red-600" role="alert">{error}</p>
{/if}
