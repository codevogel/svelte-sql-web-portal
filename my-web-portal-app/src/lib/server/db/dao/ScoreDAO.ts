import { db } from '$lib/server/db';
import { userTable, sessionTable, scoreTable, type Score } from '$lib/server/db/schema';
import { sql, eq, desc } from 'drizzle-orm';

export class ScoreDAO {
	static async getTopScorers(): Promise<TopScore[]> {
		const maxScoreSubquery = db
			.select({
				userId: sessionTable.userId,
				maxScore: sql<number>`MAX(${scoreTable.score})`.as('max_score')
			})
			.from(scoreTable)
			.innerJoin(sessionTable, eq(scoreTable.sessionId, sessionTable.id))
			.groupBy(sessionTable.userId)
			.as('max_scores');

		// Then find the score records that match these maximums
		const result = await db
			.select({
				name: userTable.name,
				userId: userTable.id,
				scoreId: scoreTable.id,
				levelId: scoreTable.levelId,
				sessionId: scoreTable.sessionId,
				score: scoreTable.score,
				accuracy: scoreTable.accuracy,
				timeTaken: scoreTable.timeTaken,
				createdAt: scoreTable.createdAt
			})
			.from(userTable)
			.innerJoin(maxScoreSubquery, eq(maxScoreSubquery.userId, userTable.id))
			.innerJoin(sessionTable, eq(sessionTable.userId, userTable.id))
			.innerJoin(
				scoreTable,
				sql`${scoreTable.sessionId} = ${sessionTable.id} AND ${scoreTable.score} = ${maxScoreSubquery.maxScore}`
			)
			.orderBy(desc(scoreTable.score))
			.limit(10);

		return result;
	}

	static async getScoresBySessionId(sessionId: number): Promise<Score[]> {
		const scores: Score[] = await db.query.scoreTable.findMany({
			where: eq(scoreTable.sessionId, sessionId)
		});
		return scores;
	}
}

export class TopScore {
	name: string = 'defaultName';
	userId: number = NaN;
	scoreId: number = NaN;
	levelId: number = NaN;
	sessionId: number = NaN;
	score: number = NaN;
	accuracy: number = NaN;
	timeTaken: number = NaN;
	createdAt: Date = new Date();
}
