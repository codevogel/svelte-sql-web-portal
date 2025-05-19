import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';

export const load: PageServerLoad = async ({ url }) => {
	// Here we query the user data using our DAO and return it
	const username = url.searchParams.get('username');
	let users: User[] = [];
	if (username) {
		users = await UserDAO.getUsersLikeUsername(username);
	}
	return { users };
};
