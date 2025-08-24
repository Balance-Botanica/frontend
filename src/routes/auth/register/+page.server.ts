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
	register: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const firstName = formData.get('firstName') as string;
		const lastName = formData.get('lastName') as string;
		const age = parseInt(formData.get('age') as string);

		// Basic validation
		if (!email || !password || !age) {
			return fail(400, {
				message: 'Email, password, and age are required',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		// Email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				message: 'Please enter a valid email address',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		// Age validation
		if (isNaN(age) || age < 18) {
			return fail(400, {
				message: 'You must be at least 18 years old to register',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		// Password validation
		if (password.length < 8) {
			return fail(400, {
				message: 'Password must be at least 8 characters long',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		// Password confirmation validation
		if (confirmPassword && password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		// Password strength validation
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumbers = /\d/.test(password);

		if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
			return fail(400, {
				message:
					'Password must contain at least one uppercase letter, one lowercase letter, and one number',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}

		try {
			console.log('🔐 [AUTH] Attempting registration for:', email);

			// Check if Supabase client is available
			if (!supabase) {
				throw new Error('Authentication service is not available');
			}

			// Attempt to register with Supabase
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${process.env.ORIGIN || 'http://localhost:5173'}/auth/callback`,
					data: {
						first_name: firstName,
						last_name: lastName,
						age: age
					}
				}
			});

			if (error) {
				console.error('❌ [AUTH] Registration error:', error.message);

				// Handle specific error types
				if (error.message.includes('User already registered')) {
					return fail(400, {
						message: 'An account with this email already exists. Please try signing in instead.',
						email,
						firstName,
						lastName,
						age: age || '',
						error: true
					});
				}

				if (error.message.includes('Password should be at least')) {
					return fail(400, {
						message:
							'Password does not meet security requirements. Please choose a stronger password.',
						email,
						firstName,
						lastName,
						age: age || '',
						error: true
					});
				}

				if (error.message.includes('rate limit')) {
					return fail(429, {
						message: 'Too many registration attempts. Please wait a moment before trying again.',
						email,
						firstName,
						lastName,
						age: age || '',
						error: true
					});
				}

				throw error;
			}

			if (!data.user) {
				return fail(500, {
					message: 'Registration failed. Please try again.',
					email,
					firstName,
					lastName,
					age: age || '',
					error: true
				});
			}

			console.log('✅ [AUTH] Registration successful for:', email);

			// Check if email confirmation is required
			if (!data.session) {
				// Email confirmation required
				return {
					success: true,
					message:
						'Registration successful! Please check your email and click the confirmation link to activate your account.',
					email,
					confirmationRequired: true
				};
			} else {
				// Auto-confirmed, redirect to home
				throw redirect(302, '/');
			}
		} catch (error) {
			// Handle redirect errors (these are expected)
			if (error && typeof error === 'object' && 'status' in error && error.status === 302) {
				throw error; // Re-throw redirect
			}

			console.error('❌ [AUTH] Unexpected registration error:', error);
			return fail(500, {
				message: 'An unexpected error occurred during registration. Please try again.',
				email,
				firstName,
				lastName,
				age: age || '',
				error: true
			});
		}
	}
};
