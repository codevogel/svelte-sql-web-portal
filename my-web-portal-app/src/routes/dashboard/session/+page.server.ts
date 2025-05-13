import type { PageServerLoad } from './$types';
import { SessionDAO, type SessionWithUsername } from '$lib/server/db/dao/SessionDAO';

export const load: PageServerLoad = async ({ url }) => {
	let sessions: SessionWithUsername[] = [];
	const userNameParam = url.searchParams.get('username');
	if (userNameParam) {
		sessions = await SessionDAO.getSessionsLikeUserName(userNameParam);
		return { sessions };
	}

	// Here we query the session data using our DAO and return it
	const idParam = url.searchParams.get('id');
	const id = idParam ? parseInt(idParam) : null;
	if (id) {
		sessions = await SessionDAO.getSessionsLikeId(id);
	}
	return { sessions };
};
