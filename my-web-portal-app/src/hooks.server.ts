import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$lib/server/db/auth/session';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('authSession') ?? null;
	if (token === null) {
		event.locals.admin = null;
		event.locals.authSession = null;
		return resolve(event);
	}

	const { authSession, admin } = await validateSessionToken(token);
	if (authSession !== null) {
		setSessionTokenCookie(event, token, authSession.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.authSession = authSession;
	event.locals.admin = admin;
	return resolve(event);
};
