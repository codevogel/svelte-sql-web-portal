import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';
import { ScoreDAO, TopScore } from '$lib/server/db/dao/ScoreDAO';

export const load: PageServerLoad = async () => {
	// Here we query the user data using our DAO and return it
	const users: User[] = await UserDAO.getAll();
	const topScores: TopScore[] = await ScoreDAO.getTopScorers();
	return {
		users,
		topScores
	};

}
