import { reset, seed } from 'drizzle-seed';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../src/lib/server/db/schema';
import 'dotenv/config';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

async function reseed_db() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });

	faker.seed(1234);

	console.log('Resetting database...');
	await reset(db, schema);
	console.log('Reseeding database...');
	await seed(db, schema).refine((f) => ({
		userTable: {
			count: 20,
			columns: {
				firstName: f.firstName(),
				lastName: f.lastName(),
				createdAt: f.date({ minDate: '2025-01-01', maxDate: '2025-02-01' }),
				dateOfBirth: f.date({ minDate: '1990-01-01', maxDate: '2000-01-01' })
			}
		},
		sessionTable: {
			count: 100,
			columns: {
				createdAt: f.date({ minDate: '2025-02-01', maxDate: '2025-03-01' }),
				duration: f.int({ minValue: 0, maxValue: 2 * 60 * 60 })
			}
		},
		levelTable: {
			count: 10,
			columns: {
				name: f.city(),
				difficulty: f.int({ minValue: 1, maxValue: 5 })
			}
		},
		scoreTable: {
			count: 300,
			columns: {
				score: f.int({ minValue: 0, maxValue: 2000 }),
				accuracy: f.number({ minValue: 0, maxValue: 1, precision: 100 }),
				timeTaken: f.int({ minValue: 0, maxValue: 10 * 60 })
			}
		}
	}));

	await clearAuthTables(db);
	await setUsernames(db);
	await setScoreCreatedAtAfterSessionCreatedAt(db);

	console.log('Database reseeded successfully');
	await client.end();
}

async function main() {
	await reseed_db();
}

async function setScoreCreatedAtAfterSessionCreatedAt(db: MySql2Database<typeof schema>) {
	const sessions = await db.select().from(schema.sessionTable);
	for (const session of sessions) {
		const sessionStart = session.createdAt;
		const sessionEnd = new Date(sessionStart.getTime() + session.duration * 1000);
		const sessionScores = await db.query.scoreTable.findMany({
			where: eq(schema.scoreTable.sessionId, session.id)
		});

		for (const score of sessionScores) {
			await db
				.update(schema.scoreTable)
				.set({
					createdAt: faker.date.between({
						from: sessionStart,
						to: sessionEnd
					})
				})
				.where(eq(schema.scoreTable.id, score.id));
		}
	}
}

async function setUsernames(db: MySql2Database<typeof schema> & { $client: mysql.Pool }) {
	const users = await db.select().from(schema.userTable);
	for (const user of users) {
		await db
			.update(schema.userTable)
			.set({
				username: faker.internet.username().slice(0, 20)
			})
			.where(eq(schema.userTable.id, user.id));
	}
}

async function clearAuthTables(db: MySql2Database<typeof schema> & { $client: mysql.Pool }) {
	await db.delete(schema.authSessionTable);
	await db.delete(schema.adminTable);
}

main();
