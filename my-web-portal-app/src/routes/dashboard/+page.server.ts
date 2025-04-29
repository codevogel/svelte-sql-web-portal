import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';

export const load: PageServerLoad = async () => {
	// Here we query the user data using our DAO and return it
	const users: User[] = await UserDAO.getAll();
	return {
		users,
	};

}
