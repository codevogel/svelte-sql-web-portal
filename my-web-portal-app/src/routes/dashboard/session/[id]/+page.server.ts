
import type { PageServerLoad } from './$types';
import { SessionDAO } from '$lib/server/db/dao/SessionDAO';
import type { Score, Session, User } from '$lib/server/db/schema';
import { ScoreDAO } from '$lib/server/db/dao/ScoreDAO';
import { UserDAO } from '$lib/server/db/dao/UserDAO';

export const load: PageServerLoad = async ({ params }) => {
	// Here we query the user data using our DAO and return it
	if (!params.id || isNaN(Number(params.id))) {
		throw new Error('Session ID is required');
	}
	const session: Session = await SessionDAO.getSessionById(Number(params.id));
	const user: User = await UserDAO.getUserById(session.userId);
	const scores: Score[] = await ScoreDAO.getScoresBySessionId(Number(params.id));
	return {
		session,
		user,
		scores
	};

}
