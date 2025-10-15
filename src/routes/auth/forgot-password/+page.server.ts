import { fail, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase/client';
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

			// Check if PocketBase client is available
			if (!pb) {
				throw new Error('Authentication service is not available');
			}

			// Send password reset email
			await pb.collection('users').requestPasswordReset(email);

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
