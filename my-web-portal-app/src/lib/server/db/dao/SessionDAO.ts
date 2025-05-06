import { db } from '$lib/server/db';
import { session, type Session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionById(id: number): Promise<Session> {
		// Drizzle ORM query to select all users
		const session: Session | undefined = await db.query.session.findFirst({
			where: eq(session.id, id)
		});
		if (!session) {
			throw new Error(`Session with id ${id} not found`);
		}
		return session;
	}

	static async getSessionsByUserId(userId: number): Promise<Session[]> {
		const sessions: Session[] | undefined = await db.query.session.findMany({
			where: eq(session.userId, userId)
		});
		if (!sessions) {
			throw new Error(`Sessions for user with id ${userId} not found`);
		}
		return sessions ? sessions : [];
	}
}
