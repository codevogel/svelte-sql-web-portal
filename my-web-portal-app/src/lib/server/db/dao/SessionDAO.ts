import { db } from '$lib/server/db';
import { session, type Session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class SessionDAO {
	static async getSessionById(id: number): Promise<Session> {
		// Drizzle ORM query to select all users
		const s: Session | undefined =
			await db.query.session.findFirst({
				where: eq(session.id, id)
			});
		if (!s) {
			throw new Error(`Session with id ${id} not found`);
		}
		return s;
	}
}
