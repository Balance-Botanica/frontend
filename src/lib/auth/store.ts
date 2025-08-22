import { writable, derived } from 'svelte/store';
import type { AuthState, User, Session } from './types';
import { mockAuth } from './mock-provider';

// Основной store для состояния аутентификации
function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		isLoading: false,
		error: null
	});

	// Инициализация при загрузке
	function initialize() {
		update((state) => ({ ...state, isLoading: true }));

		// Проверяем существующую сессию
		const session = mockAuth.getSession();
		const user = mockAuth.getUser();

		if (session && user && mockAuth.isAuthenticated()) {
			set({ user, session, isLoading: false, error: null });
		} else {
			set({ user: null, session: null, isLoading: false, error: null });
		}
	}

	// Вход через Google
	async function signInWithGoogle() {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { user, session } = await mockAuth.signInWithGoogle();

			set({ user, session, isLoading: false, error: null });
			return { user, session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	// Вход через Facebook
	async function signInWithFacebook() {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { user, session } = await mockAuth.signInWithFacebook();

			set({ user, session, isLoading: false, error: null });
			return { user, session };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign in with Facebook';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	// Вход через email/password
	async function signInWithEmail(email: string, password: string) {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { user, session } = await mockAuth.signInWithEmail({ email, password });

			set({ user, session, isLoading: false, error: null });
			return { user, session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	// Регистрация
	async function signUp(email: string, password: string, name: string) {
		try {
			update((state) => ({ ...state, isLoading: true, error: null }));

			const { user, session } = await mockAuth.signUp({ email, password, name });

			set({ user, session, isLoading: false, error: null });
			return { user, session };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
			set({ user: null, session: null, isLoading: false, error: errorMessage });
			throw error;
		}
	}

	// Выход
	async function signOut() {
		try {
			update((state) => ({ ...state, isLoading: true }));

			await mockAuth.signOut();

			set({ user: null, session: null, isLoading: false, error: null });
		} catch (error) {
			console.error('Sign out error:', error);
			// Даже при ошибке очищаем состояние
			set({ user: null, session: null, isLoading: false, error: null });
		}
	}

	// Очистка ошибки
	function clearError() {
		update((state) => ({ ...state, error: null }));
	}

	return {
		subscribe,
		initialize,
		signInWithGoogle,
		signInWithFacebook,
		signInWithEmail,
		signUp,
		signOut,
		clearError
	};
}

// Создаем store
export const authStore = createAuthStore();

// Деривативные stores для удобства
export const user = derived(authStore, ($authStore) => $authStore.user);
export const session = derived(authStore, ($authStore) => $authStore.session);
export const isLoading = derived(authStore, ($authStore) => $authStore.isLoading);
export const error = derived(authStore, ($authStore) => $authStore.error);
export const isAuthenticated = derived(
	authStore,
	($authStore) => !!$authStore.user && !!$authStore.session
);
