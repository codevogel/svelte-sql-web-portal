import { db } from '$lib/server/db';
import { user, session, score, type Score } from '$lib/server/db/schema';
import { sql, eq, desc } from 'drizzle-orm';

export class ScoreDAO {
	static async getTopScorers(): Promise<TopScore[]> {
		const maxScoreSubquery = db
			.select({
				userId: session.userId,
				maxScore: sql<number>`MAX(${score.score})`.as('max_score')
			})
			.from(score)
			.innerJoin(session, eq(score.sessionId, session.id))
			.groupBy(session.userId)
			.as('max_scores');

		// Then find the score records that match these maximums
		const result = await db
			.select({
				name: user.name,
				userId: user.id,
				scoreId: score.id,
				levelId: score.levelId,
				sessionId: score.sessionId,
				score: score.score,
				accuracy: score.accuracy,
				timeTaken: score.timeTaken,
				createdAt: score.createdAt
			})
			.from(user)
			.innerJoin(maxScoreSubquery, eq(maxScoreSubquery.userId, user.id))
			.innerJoin(session, eq(session.userId, user.id))
			.innerJoin(
				score,
				sql`${score.sessionId} = ${session.id} AND ${score.score} = ${maxScoreSubquery.maxScore}`
			)
			.orderBy(desc(score.score))
			.limit(10);

		return result;
	}

	static async getScoresBySessionId(sessionId: number): Promise<Score[]> {
		const scores: Score[] = await db
			.query
			.score
			.findMany({
				where: eq(score.sessionId, sessionId),
			})
		return scores;
	}
}

export class TopScore {
	name: string = 'defaultName';
	userId: number = NaN;
	scoreId: number = NaN;
	levelId: number = NaN;
	sessionId: number = NaN;
	score: number | null = NaN;
	accuracy: number = NaN;
	timeTaken: number = NaN;
	createdAt: Date = new Date();
}
