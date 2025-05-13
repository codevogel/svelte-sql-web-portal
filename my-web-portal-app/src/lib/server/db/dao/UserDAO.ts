import { db } from '$lib/server/db';
import { user, type User } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class UserDAO {
	// Get all users from the database
	static async getAll(): Promise<User[]> {
		// Drizzle ORM query to select all users
		// Note the similarity to the SQL query: SELECT * FROM user
		return await db.select().from(user);
	}

	static async getUserById(id: number): Promise<User> {
		const result: User | undefined = await db.query.user.findFirst({
			where: eq(user.id, id)
		});
		if (!result) {
			throw new Error(`User with id ${id} not found`);
		}
		return result;
	}

	static async getUsersLikeName(name: string): Promise<User[]> {
		const result: User[] = await db.query.user.findMany({
			where: like(user.name, `%${name}%`)
		});
		return result;
	}
}
