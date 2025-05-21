import type { Actions, PageServerLoad } from './$types';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/db/auth/session';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		loggedIn: locals.admin ? true : false
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.authSession === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.authSession!.id);
		deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
