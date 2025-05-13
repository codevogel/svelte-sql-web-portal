import { db } from '$lib/server/db';
import { session, type Session, score, user } from '$lib/server/db/schema';
import { eq, like, sql } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionById(id: number): Promise<Session> {
		// Drizzle ORM query to select all users
		const sesh: Session | undefined = await db.query.session.findFirst({
			where: eq(session.id, id)
		});
		if (!sesh) {
			throw new Error(`Session with id ${id} not found`);
		}
		return sesh;
	}

	static async getSessionsLikeId(id: number): Promise<SessionWithUsername[]> {
		const result: SessionWithUsername[] = await db
			.select({
				id: session.id,
				userId: session.userId,
				createdAt: session.createdAt,
				duration: session.duration,
				username: user.name
			})
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(like(session.id, `${id}%`));
		return result;
	}

	static async getSessionsLikeUserName(name: string): Promise<SessionWithUsername[]> {
		const result: SessionWithUsername[] = await db
			.select({
				id: session.id,
				userId: session.userId,
				createdAt: session.createdAt,
				duration: session.duration,
				username: user.name
			})
			.from(session)
			.innerJoin(user, eq(session.userId, user.id))
			.where(like(user.name, `%${name}%`));
		return result;
	}

	static async getSessionsByUserIdWithAverageScore(
		userId: number
	): Promise<SessionWithAverageScore[]> {
		// Use SQL.js to perform a JOIN with aggregation
		const result = await db
			.select({
				id: session.id,
				userId: session.userId,
				createdAt: session.createdAt,
				duration: session.duration,
				averageScore: sql<number>`AVG(${score.score})`.mapWith(Number)
			})
			.from(session)
			.leftJoin(score, eq(session.id, score.sessionId))
			.where(eq(session.userId, userId))
			.groupBy(session.id);

		// Return the typed results
		return result.map((session) => ({
			...session,
			// Ensure we have a proper number value even if no scores exist
			averageScore: session.averageScore || 0
		}));
	}
}

export interface SessionWithAverageScore extends Session {
	averageScore: number;
}

export interface SessionWithUsername extends Session {
	username: string;
}
