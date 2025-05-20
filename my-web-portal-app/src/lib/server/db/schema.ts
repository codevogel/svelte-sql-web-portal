import { mysqlTable, int, varchar, datetime, float } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const userTable = mysqlTable('user', {
	id: int('id').primaryKey().autoincrement(),
	githubId: int('github_id').unique(),
	createdAt: datetime('created_at').notNull(),
	firstName: varchar('first_name', { length: 30 }).notNull(),
	lastName: varchar('last_name', { length: 30 }).notNull(),
	username: varchar('username', { length: 39 }).notNull(), // Github usernames may not exceed 39 chars
	dateOfBirth: datetime('date_of_birth').notNull()
});

export const sessionTable = mysqlTable('session', {
	id: int('id').primaryKey().autoincrement(),
	userId: int('user_id').notNull(),
	createdAt: datetime('created_at').notNull(),
	duration: int('duration').notNull() // in seconds
});

export const authSessionTable = mysqlTable('auth_session', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: int('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: datetime('expires_at').notNull()
});

export const scoreTable = mysqlTable('score', {
	id: int('id').primaryKey().autoincrement(),
	sessionId: int('session_id').notNull(),
	levelId: int('level_id').notNull(),
	createdAt: datetime('created_at').notNull(),
	score: int('score').notNull(),
	timeTaken: int('time_taken').notNull(), // in seconds
	accuracy: float('accuracy').notNull()
});

export const levelTable = mysqlTable('level', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 255 }).notNull(),
	difficulty: int('difficulty').notNull()
});

// One user can have many sessions
export const userRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable)
}));

// One session belongs to one user, and the userId refers the user table's id
// One session can have many scores
export const sessionRelations = relations(sessionTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	}),
	scores: many(scoreTable)
}));

// One score belongs to one session, and the sessionId refers the session table's id
// One score belongs to one level, and the levelId refers the level table's id
export const scoreRelations = relations(scoreTable, ({ one }) => ({
	session: one(sessionTable, {
		fields: [scoreTable.sessionId],
		references: [sessionTable.id]
	}),
	level: one(levelTable, {
		fields: [scoreTable.levelId],
		references: [levelTable.id]
	})
}));

// One level can be associated with many scores
export const levelRelations = relations(levelTable, ({ many }) => ({
	scores: many(scoreTable)
}));

export type User = typeof userTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
export type AuthSession = typeof authSessionTable.$inferSelect;
export type Score = typeof scoreTable.$inferSelect;
export type Level = typeof levelTable.$inferSelect;
