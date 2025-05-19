import { db } from '$lib/server/db';
import { sessionTable, type Session, scoreTable, userTable } from '$lib/server/db/schema';
import { eq, like, sql } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionById(id: number): Promise<Session> {
		// Drizzle ORM query to select all users
		const session: Session | undefined = await db.query.sessionTable.findFirst({
			where: eq(sessionTable.id, id)
		});
		if (!session) {
			throw new Error(`Session with id ${id} not found`);
		}
		return session;
	}

	static async getSessionsLikeId(id: number): Promise<SessionWithUsername[]> {
		const result: SessionWithUsername[] = await db
			.select({
				id: sessionTable.id,
				userId: sessionTable.userId,
				createdAt: sessionTable.createdAt,
				duration: sessionTable.duration,
				username: userTable.name
			})
			.from(sessionTable)
			.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
			.where(like(sessionTable.id, `${id}%`));
		return result;
	}

	static async getSessionsLikeUserName(name: string): Promise<SessionWithUsername[]> {
		const result: SessionWithUsername[] = await db
			.select({
				id: sessionTable.id,
				userId: sessionTable.userId,
				createdAt: sessionTable.createdAt,
				duration: sessionTable.duration,
				username: userTable.name
			})
			.from(sessionTable)
			.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
			.where(like(userTable.name, `%${name}%`));
		return result;
	}

	static async getSessionsByUserIdWithAverageScore(
		userId: number
	): Promise<SessionWithAverageScore[]> {
		// Use SQL.js to perform a JOIN with aggregation
		const result = await db
			.select({
				id: sessionTable.id,
				userId: sessionTable.userId,
				createdAt: sessionTable.createdAt,
				duration: sessionTable.duration,
				averageScore: sql<number>`AVG(${scoreTable.score})`.mapWith(Number)
			})
			.from(sessionTable)
			.leftJoin(scoreTable, eq(sessionTable.id, scoreTable.sessionId))
			.where(eq(sessionTable.userId, userId))
			.groupBy(sessionTable.id);

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
