import type { User, Session, LoginCredentials, OAuthProvider } from './types';

// Мокап пользователи для демонстрации
const mockUsers: User[] = [
	{
		id: '1',
		email: 'demo@balancebotanica.com',
		name: 'Demo User',
		avatar_url:
			'https://res.cloudinary.com/dtp21hkrc/image/upload/v1755626661/balance-botanica/avatars/demo-user.jpg',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

export class MockAuthProvider {
	private static instance: MockAuthProvider;
	private currentSession: Session | null = null;

	static getInstance(): MockAuthProvider {
		if (!MockAuthProvider.instance) {
			MockAuthProvider.instance = new MockAuthProvider();
		}
		return MockAuthProvider.instance;
	}

	// Имитация Google OAuth
	async signInWithGoogle(): Promise<{ user: User; session: Session }> {
		// Имитируем задержку сети
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const user = mockUsers[0];
		const session = this.createSession(user);

		this.currentSession = session;
		this.saveToStorage(session);

		return { user, session };
	}

	// Имитация Facebook OAuth
	async signInWithFacebook(): Promise<{ user: User; session: Session }> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const user = mockUsers[0];
		const session = this.createSession(user);

		this.currentSession = session;
		this.saveToStorage(session);

		return { user, session };
	}

	// Email/Password вход
	async signInWithEmail(credentials: LoginCredentials): Promise<{ user: User; session: Session }> {
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Простая валидация
		if (credentials.email === 'demo@balancebotanica.com' && credentials.password === 'demo123') {
			const user = mockUsers[0];
			const session = this.createSession(user);

			this.currentSession = session;
			this.saveToStorage(session);

			return { user, session };
		}

		throw new Error('Invalid email or password');
	}

	// Регистрация
	async signUp(
		credentials: LoginCredentials & { name: string }
	): Promise<{ user: User; session: Session }> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newUser: User = {
			id: crypto.randomUUID(),
			email: credentials.email,
			name: credentials.name,
			avatar_url: undefined,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		const session = this.createSession(newUser);

		this.currentSession = session;
		this.saveToStorage(session);

		return { user: newUser, session };
	}

	// Выход
	async signOut(): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 300));

		this.currentSession = null;
		this.clearStorage();
	}

	// Получить текущую сессию
	getSession(): Session | null {
		if (!this.currentSession) {
			this.currentSession = this.loadFromStorage();
		}
		return this.currentSession;
	}

	// Получить текущего пользователя
	getUser(): User | null {
		const session = this.getSession();
		return session?.user || null;
	}

	// Проверить авторизацию
	isAuthenticated(): boolean {
		const session = this.getSession();
		if (!session) return false;

		// Проверяем срок действия токена
		return Date.now() < session.expires_at;
	}

	private createSession(user: User): Session {
		return {
			access_token: `mock_token_${crypto.randomUUID()}`,
			refresh_token: `mock_refresh_${crypto.randomUUID()}`,
			expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 часа
			user
		};
	}

	private saveToStorage(session: Session): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem('mock_auth_session', JSON.stringify(session));
		}
	}

	private loadFromStorage(): Session | null {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('mock_auth_session');
			if (stored) {
				try {
					return JSON.parse(stored);
				} catch {
					return null;
				}
			}
		}
		return null;
	}

	private clearStorage(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('mock_auth_session');
		}
	}
}

// Экспортируем singleton
export const mockAuth = MockAuthProvider.getInstance();
