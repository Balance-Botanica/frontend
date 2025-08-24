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
	'forgot-password': async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		// Basic validation
		if (!email) {
			return fail(400, {
				message: 'Email address is required',
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

		try {
			console.log('🔑 [AUTH] Sending password reset email to:', email);

			// Check if Supabase client is available
			if (!supabase) {
				throw new Error('Authentication service is not available');
			}

			// Send password reset email
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${process.env.ORIGIN || 'http://localhost:5173'}/auth/reset-password`
			});

			if (error) {
				console.error('❌ [AUTH] Password reset error:', error.message);

				// Handle specific error types
				if (error.message.includes('rate limit')) {
					return fail(429, {
						message: 'Too many password reset requests. Please wait a moment before trying again.',
						email,
						error: true
					});
				}

				if (error.message.includes('not found')) {
					// For security reasons, don't reveal if email exists or not
					// Return success message anyway
					console.log('🔒 [AUTH] Email not found, but returning success for security');
				} else {
					throw error;
				}
			}

			console.log('✅ [AUTH] Password reset email sent successfully');

			// Always return success for security (don't reveal if email exists)
			return {
				success: true,
				message: "If an account with that email exists, we've sent you a password reset link.",
				email
			};
		} catch (error) {
			console.error('❌ [AUTH] Unexpected password reset error:', error);
			return fail(500, {
				message: 'An unexpected error occurred. Please try again.',
				email,
				error: true
			});
		}
	}
};
