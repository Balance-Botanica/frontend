import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const age = parseInt(formData.get('age') as string);
		const password = formData.get('password') as string;

		if (!username || !age || !password) {
			return fail(400, { message: 'All fields are required' });
		}

		if (age < 18) {
			return fail(400, { message: 'You must be at least 18 years old' });
		}

		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters long' });
		}

		try {
			// TODO: Implement actual registration logic
			// For now, just show a placeholder message
			return fail(400, { message: 'Registration not yet implemented' });
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { message: 'An error occurred during registration' });
		}
	}
};
