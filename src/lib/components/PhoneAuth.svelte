<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { RecaptchaVerifier } from 'firebase/auth';
	import { auth } from '$lib/firebase/config.js';
	import {
		phoneAuthStore,
		phoneAuthStep,
		phoneAuthLoading,
		phoneAuthError,
		sendPhoneVerification,
		verifyPhoneCode,
		resetPhoneAuth
	} from '$lib/firebase/auth.js';
	import Button from './Button.svelte';

	const dispatch = createEventDispatcher<{
		success: { user: any };
		error: { message: string };
	}>();

	let phoneInput: HTMLInputElement;
	let otpInput: HTMLInputElement;
	let recaptchaContainer: HTMLDivElement;
	let recaptchaVerifier: RecaptchaVerifier;

	$: currentStep = $phoneAuthStep;
	$: isLoading = $phoneAuthLoading;
	$: error = $phoneAuthError;

	onMount(() => {
		// Initialize reCAPTCHA
		if (recaptchaContainer) {
			recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
				size: 'invisible',
				callback: () => {
					// reCAPTCHA solved, allow sending SMS
				}
			});
		}
	});

	async function handleSendCode() {
		try {
			const phoneNumber = $phoneAuthStore.phoneNumber;
			if (!phoneNumber) {
				phoneAuthStore.update((state) => ({ ...state, error: 'Please enter a phone number' }));
				return;
			}

			// Format phone number to E.164 format
			const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

			await sendPhoneVerification(formattedPhone, recaptchaVerifier);
		} catch (err: any) {
			dispatch('error', { message: err.message });
		}
	}

	async function handleVerifyCode() {
		try {
			const code = $phoneAuthStore.verificationCode;
			if (!code) {
				phoneAuthStore.update((state) => ({
					...state,
					error: 'Please enter the verification code'
				}));
				return;
			}

			await verifyPhoneCode(code);
			dispatch('success', { user: auth.currentUser });
		} catch (err: any) {
			dispatch('error', { message: err.message });
		}
	}

	function handleBackToPhone() {
		resetPhoneAuth();
	}

	function formatPhoneNumber(value: string): string {
		// Remove all non-digit characters except +
		let cleaned = value.replace(/[^\d+]/g, '');

		// Ensure it starts with +
		if (!cleaned.startsWith('+')) {
			cleaned = '+' + cleaned;
		}

		// Limit length
		if (cleaned.length > 15) {
			cleaned = cleaned.slice(0, 15);
		}

		return cleaned;
	}
</script>

<div class="mx-auto w-full max-w-md space-y-6">
	<!-- Phone Number Input Step -->
	{#if currentStep === 'phone'}
		<div class="space-y-4">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-gray-900">Sign in with Phone</h2>
				<p class="mt-2 text-gray-600">Enter your phone number to receive a verification code</p>
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
					<input
						bind:this={phoneInput}
						id="phone"
						type="tel"
						placeholder="+380501234567"
						bind:value={$phoneAuthStore.phoneNumber}
						on:input={(e) => {
							const target = e.target as HTMLInputElement;
							const formatted = formatPhoneNumber(target.value);
							phoneAuthStore.update((state) => ({ ...state, phoneNumber: formatted }));
						}}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-main focus:ring-2 focus:ring-main focus:outline-none"
						required
					/>
				</div>

				<!-- reCAPTCHA container -->
				<div bind:this={recaptchaContainer} class="flex justify-center"></div>

				{#if error}
					<div class="text-center text-sm text-red-600">{error}</div>
				{/if}

				<Button
					on:click={handleSendCode}
					disabled={isLoading || !$phoneAuthStore.phoneNumber}
					variant="primary"
				>
					{isLoading ? 'Sending...' : 'Send Verification Code'}
				</Button>
			</div>
		</div>
	{/if}

	<!-- OTP Verification Step -->
	{#if currentStep === 'otp'}
		<div class="space-y-4">
			<div class="text-center">
				<h2 class="text-2xl font-bold text-gray-900">Verify Code</h2>
				<p class="mt-2 text-gray-600">
					Enter the 6-digit code sent to {$phoneAuthStore.phoneNumber}
				</p>
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<label for="otp" class="block text-sm font-medium text-gray-700">Verification Code</label>
					<input
						bind:this={otpInput}
						id="otp"
						type="text"
						placeholder="123456"
						bind:value={$phoneAuthStore.verificationCode}
						on:input={(e) => {
							const target = e.target as HTMLInputElement;
							const value = target.value.replace(/\D/g, '').slice(0, 6);
							phoneAuthStore.update((state) => ({ ...state, verificationCode: value }));
						}}
						maxlength="6"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-main focus:ring-2 focus:ring-main focus:outline-none"
						required
					/>
				</div>

				{#if error}
					<div class="text-center text-sm text-red-600">{error}</div>
				{/if}

				<div class="flex space-x-3">
					<Button on:click={handleBackToPhone} variant="secondary">Back</Button>
					<Button
						on:click={handleVerifyCode}
						disabled={isLoading || $phoneAuthStore.verificationCode.length !== 6}
						variant="primary"
					>
						{isLoading ? 'Verifying...' : 'Verify Code'}
					</Button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Success Step -->
	{#if currentStep === 'success'}
		<div class="space-y-4 text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
				<svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900">Success!</h2>
			<p class="text-gray-600">You have been successfully authenticated.</p>
		</div>
	{/if}
</div>
