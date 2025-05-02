import { db } from '$lib/server/db';
import { user, type User } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class UserDAO {
	// Get all users from the database
	static async getAll(): Promise<User[]> {
		// Drizzle ORM query to select all users
		// Note the similarity to the SQL query: SELECT * FROM user
		return await db
			.select()
			.from(user);
	}
	}
}
