import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie
} from '$lib/server/db/auth/session';

import { AdminDAO } from '$lib/server/db/dao/AdminDAO';

import { github } from '$lib/server/db/auth/oauth';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserId = githubUser.id;
	const githubUsername = githubUser.login;

	try {
		const existingAdmin = await AdminDAO.getAdminByGitHubId(githubUserId);
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingAdmin.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch {
		// TODO: Replace this with your own DB query.
		const admin = await AdminDAO.createAdmin(githubUserId, githubUsername);

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, admin.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
}
