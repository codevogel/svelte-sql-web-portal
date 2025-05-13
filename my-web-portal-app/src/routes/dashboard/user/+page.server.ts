import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';

export const load: PageServerLoad = async ({ url }) => {
	// Here we query the user data using our DAO and return it
	const name = url.searchParams.get('name');
	let users: User[] = [];
	if (name) {
		users = await UserDAO.getUsersLikeName(name);
	}
	return { users };
};
