import { writable, derived } from 'svelte/store';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	PhoneAuthProvider,
	GoogleAuthProvider,
	linkWithPopup,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	sendPasswordResetEmail,
	signInWithCredential,
	signOut,
	onAuthStateChanged,
	type User,
	type PhoneInfoOptions
} from 'firebase/auth';
import { auth } from './config.js';

// Send the Firebase ID token to our server, which verifies it and sets the
// app session cookie (same session as every other login method). Returns true
// on success. Firebase is identity, PocketBase stays pure data sync.
async function bridgeIdTokenToSession(idToken: string): Promise<void> {
	const res = await fetch('/api/auth/firebase', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok || !data?.success) {
		throw new Error(data?.error || 'Server session failed');
	}
}

// Google sign-in via Firebase popup. select_account forces the native
// account chooser with remembered accounts ("Continue as …").
export async function signInWithGooglePopup(): Promise<User> {
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	const cred = await signInWithPopup(auth, provider);
	if (!cred.user) throw new Error('Google sign-in returned no user');
	await bridgeIdTokenToSession(await cred.user.getIdToken());
	return cred.user;
}

// Email/password via Firebase (register when isSignUp, else sign in).
export async function signInWithEmailPassword(
	email: string,
	password: string,
	isSignUp: boolean,
	displayName?: string
): Promise<User> {
	let user: User;
	if (isSignUp) {
		const cred = await createUserWithEmailAndPassword(auth, email, password);
		user = cred.user;
		if (displayName) {
			await updateProfile(user, { displayName }).catch(() => {});
		}
	} else {
		const cred = await signInWithEmailAndPassword(auth, email, password);
		user = cred.user;
	}
	await bridgeIdTokenToSession(await user.getIdToken());
	return user;
}

// Real password reset email via Firebase (replaces the old mock).
export async function sendPasswordReset(email: string): Promise<void> {
	await sendPasswordResetEmail(auth, email);
}

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

		const cred = await signInWithCredential(auth, credential);
		if (!cred.user) throw new Error('Phone sign-in returned no user');

		// Bridge to the app session cookie — without this the user is signed in
		// to Firebase but anonymous to our server (this was the missing piece).
		await bridgeIdTokenToSession(await cred.user.getIdToken());

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

		return cred.user;
	} catch (error: any) {
		phoneAuthStore.update((state) => ({
			...state,
			loading: false,
			error: error.message
		}));
		throw error;
	}
}

// Provider ids of the current Firebase user, e.g. ['phone'] or ['google.com'].
// Used to decide whether to nudge a phone-only user to link Google.
export function getProviderIds(user: User | null): string[] {
	if (!user) return [];
	return (user.providerData || []).map((p) => p.providerId);
}

export function isPhoneOnlyUser(user: User | null): boolean {
	const ids = getProviderIds(user);
	return ids.length > 0 && ids.every((id) => id === 'phone');
}

// Link Google to the currently signed-in (phone) user so the next login is
// a free 1-click Google sign-in instead of another paid SMS. Same Firebase
// account is kept — no duplicate user, token is re-bridged to our session.
export async function linkGoogleToCurrentUser(): Promise<User> {
	const current = auth.currentUser;
	if (!current) throw new Error('No signed-in user to link Google to');
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	const cred = await linkWithPopup(current, provider);
	if (!cred.user) throw new Error('Google linking returned no user');
	await bridgeIdTokenToSession(await cred.user.getIdToken());
	return cred.user;
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
