import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { browser } from '$app/environment';

// Firebase configuration (env vars preferred; fallback to provided project values)
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD4KLKshufn60H1njoSq6Y5Bf1qHT37eqQ',
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'balance-botanica.firebaseapp.com',
	databaseURL:
		import.meta.env.VITE_FIREBASE_DATABASE_URL ||
		'https://balance-botanica-default-rtdb.europe-west1.firebasedatabase.app',
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'balance-botanica',
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'balance-botanica.appspot.com',
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '14094555416',
	appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:14094555416:web:7db27c80f74e99ce9be66d',
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-273TKQ8EQH'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Analytics only in the browser
export const analytics = browser ? getAnalytics(app) : undefined;

// Connect to auth emulator in development
if (import.meta.env.DEV) {
	try {
		connectAuthEmulator(auth, 'http://localhost:9099');
		console.log('Connected to Firebase Auth Emulator');
	} catch (error) {
		console.log('Firebase Auth Emulator already connected or not available');
	}
}

export default app;
