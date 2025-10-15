import { fail, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase/client';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}

	// Check if we have the required tokens in the URL
	const token = url.searchParams.get('token');

	// Validate that this is a password recovery request
	if (!token) {
		return {
			error: true,
			message: 'Invalid or expired password reset link. Please request a new one.'
		};
	}

	try {
		// Check if PocketBase client is available
		if (!pb) {
			return {
				error: true,
				message: 'Authentication service is not available. Please try again later.'
			};
		}

		// For PocketBase, we don't need to set a session, we just validate the token
		// The token will be used when updating the password
		console.log('✅ [AUTH] Password reset token validated');
		return {
			validToken: true,
			token: token
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
	'reset-password': async ({ request, url }) => {
		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		const token = url.searchParams.get('token');

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

		// Token validation
		if (!token) {
			return fail(400, {
				message: 'Invalid password reset link. Please request a new one.',
				error: true
			});
		}

		try {
			console.log('🔑 [AUTH] Updating password...');

			// Check if PocketBase client is available
			if (!pb) {
				throw new Error('Authentication service is not available');
			}

			// Update the user's password using the token
			await pb.collection('users').confirmPasswordReset(token, password, password);

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
