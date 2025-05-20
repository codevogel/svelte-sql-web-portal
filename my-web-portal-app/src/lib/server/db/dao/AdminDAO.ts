import { db } from '$lib/server/db';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { adminTable, type Admin } from '$lib/server/db/schema';

export class AdminDAO {
	static async getAdminByGitHubId(id: number): Promise<Admin> {
		const result: Admin | undefined = await db.query.adminTable.findFirst({
			where: eq(adminTable.githubId, id)
		});
		if (!result) throw new Error(`Admin with GitHub id ${id} not found`);
		return result;
	}

	static async createAdmin(githubId: number, username: string): Promise<Admin> {
		type NewAdmin = InferInsertModel<typeof adminTable>;
		const newAdmin: NewAdmin = { githubId, username };
		await db.insert(adminTable).values(newAdmin);

		const result: Admin | undefined = await db.query.adminTable.findFirst({
			where: eq(adminTable.githubId, githubId)
		});
		if (!result) throw new Error(`Admin with GitHub id ${githubId} not found`);
		return result;
	}
}
