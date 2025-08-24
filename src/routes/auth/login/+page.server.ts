import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		// Basic validation
		if (!email || !password) {
			return fail(400, {
				message: 'Email and password are required',
				email,
				error: true
			});
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				message: 'Please enter a valid email address',
				email,
				error: true
			});
		}

		// Password length validation
		if (password.length < 6) {
			return fail(400, {
				message: 'Password must be at least 6 characters long',
				email,
				error: true
			});
		}

		try {
			console.log('🔐 [AUTH] Attempting login for:', email);

			// Check if Supabase client is available
			if (!supabase) {
				throw new Error('Authentication service is not available');
			}

			// Attempt to sign in with Supabase
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				console.error('❌ [AUTH] Login error:', error.message);

				// Handle specific error types
				if (error.message.includes('Invalid login credentials')) {
					return fail(400, {
						message: 'Invalid email or password. Please check your credentials and try again.',
						email,
						error: true
					});
				}

				if (error.message.includes('Email not confirmed')) {
					return fail(400, {
						message: 'Please check your email and click the confirmation link before signing in.',
						email,
						error: true
					});
				}

				if (error.message.includes('Too many requests')) {
					return fail(429, {
						message: 'Too many login attempts. Please wait a moment before trying again.',
						email,
						error: true
					});
				}

				throw error;
			}

			if (!data.user || !data.session) {
				return fail(500, {
					message: 'Authentication successful but no user data received. Please try again.',
					email,
					error: true
				});
			}

			console.log('✅ [AUTH] Login successful for:', email);

			// Redirect to home page on successful login
			// The client-side auth store will handle session management
			throw redirect(302, '/');
		} catch (error) {
			// Handle redirect errors (these are expected)
			if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
				throw error; // Re-throw redirect
			}

			console.error('❌ [AUTH] Unexpected login error:', error);
			return fail(500, {
				message: 'An unexpected error occurred during login. Please try again.',
				email,
				error: true
			});
		}
	}
};
