import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already logged in
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		if (!username || !password) {
			return fail(400, { message: 'Username and password are required' });
		}

		try {
			// TODO: Implement actual authentication logic
			// For now, just show a placeholder message
			return fail(400, { message: 'Authentication not yet implemented' });
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, { message: 'An error occurred during login' });
		}
	}
};
