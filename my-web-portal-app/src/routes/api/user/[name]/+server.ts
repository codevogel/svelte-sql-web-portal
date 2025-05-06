import type { RequestHandler } from '@sveltejs/kit';
import { UserDAO } from '$lib/server/db/dao/UserDAO';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler<{
	name: string;
}> = async ({ params }) => {
	const { name } = params;
	try {
		const users = await UserDAO.getUsersByName(name);
		return json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
