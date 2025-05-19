import { db } from '$lib/server/db';
import { userTable, type User } from '$lib/server/db/schema';
import { eq, like } from 'drizzle-orm';

export class UserDAO {
	// Get all users from the database
	static async getAll(): Promise<User[]> {
		// Drizzle ORM query to select all users
		// Note the similarity to the SQL query: SELECT * FROM user
		return await db.select().from(userTable);
	}

	static async getUserById(id: number): Promise<User> {
		const result: User | undefined = await db.query.userTable.findFirst({
			where: eq(userTable.id, id)
		});
		if (!result) {
			throw new Error(`User with id ${id} not found`);
		}
		return result;
	}

	static async getUsersLikeUsername(username: string): Promise<User[]> {
		const result: User[] = await db.query.userTable.findMany({
			where: like(userTable.username, `%${username}%`)
		});
		return result;
	}
}
