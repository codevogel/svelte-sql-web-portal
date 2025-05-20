import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';
import { SessionDAO } from '$lib/server/db/dao/SessionDAO';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.admin) {
		return redirect(302, '/login');
	}
	// Here we query the user data using our DAO and return it
	const id = parseInt(params.id);
	if (!id) {
		throw new Error('A valid User ID is required (given: ' + id + ')');
	}
	const user = await UserDAO.getUserById(id);
	const sessions = await SessionDAO.getSessionsByUserIdWithAverageScore(user.id);
	return {
		user,
		sessions
	};
};
