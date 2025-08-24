import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase/client';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}

	// Check if we have the required tokens in the URL
	const accessToken = url.searchParams.get('access_token');
	const refreshToken = url.searchParams.get('refresh_token');
	const type = url.searchParams.get('type');

	// Validate that this is a password recovery request
	if (type !== 'recovery' || !accessToken || !refreshToken) {
		return {
			error: true,
			message: 'Invalid or expired password reset link. Please request a new one.'
		};
	}

	try {
		// Check if Supabase client is available
		if (!supabase) {
			return {
				error: true,
				message: 'Authentication service is not available. Please try again later.'
			};
		}

		// Set the session using the tokens from the URL
		const { error } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (error) {
			console.error('❌ [AUTH] Error setting session for password reset:', error.message);
			return {
				error: true,
				message: 'Invalid or expired password reset link. Please request a new one.'
			};
		}

		console.log('✅ [AUTH] Password reset session established');
		return {
			validToken: true
		};
	} catch (error) {
		console.error('❌ [AUTH] Unexpected error during password reset setup:', error);
		return {
			error: true,
			message: 'An error occurred. Please try requesting a new password reset link.'
		};
	}
};

export const actions: Actions = {
	'reset-password': async ({ request }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Basic validation
		if (!password || !confirmPassword) {
			return fail(400, {
				message: 'Both password fields are required',
				error: true
			});
		}

		// Password match validation
		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match',
				error: true
			});
		}

		// Password length validation
		if (password.length < 8) {
			return fail(400, {
				message: 'Password must be at least 8 characters long',
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
				error: true
			});
		}

		try {
			console.log('🔑 [AUTH] Updating password...');

			// Check if Supabase client is available
			if (!supabase) {
				throw new Error('Authentication service is not available');
			}

			// Update the user's password
			const { error } = await supabase.auth.updateUser({
				password: password
			});

			if (error) {
				console.error('❌ [AUTH] Password update error:', error.message);

				// Handle specific error types
				if (error.message.includes('session not found')) {
					return fail(400, {
						message:
							'Your password reset session has expired. Please request a new password reset link.',
						error: true,
						sessionExpired: true
					});
				}

				if (error.message.includes('same password')) {
					return fail(400, {
						message: 'Please choose a different password than your current one.',
						error: true
					});
				}

				throw error;
			}

			console.log('✅ [AUTH] Password updated successfully');

			// Password updated successfully - redirect to login
			return {
				success: true,
				message:
					'Your password has been updated successfully. You can now sign in with your new password.'
			};
		} catch (error) {
			console.error('❌ [AUTH] Unexpected password update error:', error);
			return fail(500, {
				message: 'An unexpected error occurred while updating your password. Please try again.',
				error: true
			});
		}
	}
};
