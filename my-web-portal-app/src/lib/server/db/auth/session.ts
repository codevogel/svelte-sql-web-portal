import { db } from '$lib/server/db';
import { adminTable, authSessionTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

import type { RequestEvent } from '@sveltejs/kit';
import type { Admin, AuthSession } from '$lib/server/db/schema';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, adminId: number): Promise<AuthSession> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: AuthSession = {
		id: sessionId,
		adminId: adminId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await db.insert(authSessionTable).values(session);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ admin: adminTable, authSession: authSessionTable })
		.from(authSessionTable)
		.innerJoin(adminTable, eq(authSessionTable.adminId, adminTable.id))
		.where(eq(authSessionTable.id, sessionId));
	if (result.length < 1) {
		return { authSession: null, admin: null };
	}
	const { admin, authSession } = result[0];
	if (Date.now() >= authSession.expiresAt.getTime()) {
		await db.delete(authSessionTable).where(eq(authSessionTable.id, authSession.id));
		return { authSession: null, admin: null };
	}
	if (Date.now() >= authSession.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		authSession.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(authSessionTable)
			.set({
				expiresAt: authSession.expiresAt
			})
			.where(eq(authSessionTable.id, authSession.id));
	}
	return { authSession, admin };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(authSessionTable).where(eq(authSessionTable.id, sessionId));
}

export async function invalidateAllSessions(adminId: number): Promise<void> {
	await db.delete(authSessionTable).where(eq(authSessionTable.adminId, adminId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('authSession', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('authSession', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export type SessionValidationResult =
	| { authSession: AuthSession; admin: Admin }
	| { authSession: null; admin: null };
