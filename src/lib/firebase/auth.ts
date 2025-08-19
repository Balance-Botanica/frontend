import { writable, derived } from 'svelte/store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	PhoneAuthProvider,
	signInWithCredential,
	signOut,
	onAuthStateChanged,
	type User,
	type PhoneInfoOptions
} from 'firebase/auth';
import { auth } from './config.js';

// Auth state store
export const authStore = writable<{
	user: User | null;
	loading: boolean;
	error: string | null;
}>({
	user: null,
	loading: true,
	error: null
});

// Phone auth state store
export const phoneAuthStore = writable<{
	phoneNumber: string;
	verificationId: string | null;
	verificationCode: string;
	step: 'phone' | 'otp' | 'success';
	loading: boolean;
	error: string | null;
}>({
	phoneNumber: '',
	verificationId: null,
	verificationCode: '',
	step: 'phone',
	loading: false,
	error: null
});

// Derived stores
export const user = derived(authStore, ($store) => $store.user);
export const isAuthenticated = derived(authStore, ($store) => !!$store.user);
export const isLoading = derived(authStore, ($store) => $store.loading);
export const authError = derived(authStore, ($store) => $store.error);

// Phone auth derived stores
export const phoneAuthStep = derived(phoneAuthStore, ($store) => $store.step);
export const phoneAuthLoading = derived(phoneAuthStore, ($store) => $store.loading);
export const phoneAuthError = derived(phoneAuthStore, ($store) => $store.error);

// Initialize auth state listener
if (browser) {
	onAuthStateChanged(
		auth,
		(user) => {
			authStore.update((state) => ({
				...state,
				user,
				loading: false,
				error: null
			}));
		},
		(error) => {
			authStore.update((state) => ({
				...state,
				loading: false,
				error: error.message
			}));
		}
	);
}

// Phone authentication functions
export async function sendPhoneVerification(phoneNumber: string, appVerifier: any) {
	try {
		phoneAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const provider = new PhoneAuthProvider(auth);
		const verificationId = await provider.verifyPhoneNumber(phoneNumber, appVerifier);

		phoneAuthStore.update((state) => ({
			...state,
			verificationId,
			step: 'otp',
			loading: false
		}));

		return verificationId;
	} catch (error: any) {
		phoneAuthStore.update((state) => ({
			...state,
			loading: false,
			error: error.message
		}));
		throw error;
	}
}

export async function verifyPhoneCode(verificationCode: string) {
	try {
		phoneAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const { verificationId } = get(phoneAuthStore);
		const credential = PhoneAuthProvider.credential(verificationId!, verificationCode);

		await signInWithCredential(auth, credential);

		phoneAuthStore.update((state) => ({
			...state,
			step: 'success',
			loading: false
		}));

		// Reset phone auth state after successful login
		setTimeout(() => {
			phoneAuthStore.set({
				phoneNumber: '',
				verificationId: null,
				verificationCode: '',
				step: 'phone',
				loading: false,
				error: null
			});
		}, 2000);
	} catch (error: any) {
		phoneAuthStore.update((state) => ({
			...state,
			loading: false,
			error: error.message
		}));
		throw error;
	}
}

export async function signOutUser() {
	try {
		await signOut(auth);
		phoneAuthStore.set({
			phoneNumber: '',
			verificationId: null,
			verificationCode: '',
			step: 'phone',
			loading: false,
			error: null
		});
	} catch (error: any) {
		authStore.update((state) => ({
			...state,
			error: error.message
		}));
	}
}

export function resetPhoneAuth() {
	phoneAuthStore.set({
		phoneNumber: '',
		verificationId: null,
		verificationCode: '',
		step: 'phone',
		loading: false,
		error: null
	});
}
