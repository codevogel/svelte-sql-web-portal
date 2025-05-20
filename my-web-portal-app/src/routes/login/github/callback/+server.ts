import {
	generateSessionToken,
	createSession,
	setSessionTokenCookie
} from '$lib/server/db/auth/session';

import { AdminDAO } from '$lib/server/db/dao/AdminDAO';

import { github } from '$lib/server/db/auth/oauth';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

import { ALLOWED_GITHUB_IDS } from '$env/static/private';

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
	} catch (e) {
		console.log('Error validating authorization code:', e);
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
	} catch (e) {
		console.log('Error fetching admin:', e);
		console.log('Creating new admin...');
		const allowedIds = ALLOWED_GITHUB_IDS.split(',');
		let allowed = false;
		for (const id of allowedIds) {
			if (id.trim() === githubUserId.toString()) {
				allowed = true;
				break;
			}
		}

		if (!allowed) {
			console.log('User was not allowed to create an admin account, as they are not in the whitelist.');
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/unauthorized'
				}
			});
		}

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
