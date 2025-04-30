import { mysqlTable, int, varchar, datetime, float } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const user = mysqlTable("user", {
	id: int("id").primaryKey().autoincrement(),
	createdAt: datetime("created_at").notNull(),
	name: varchar("name", { length: 20 }).notNull(),
	dateOfBirth: datetime("date_of_birth").notNull(),
});

export const session = mysqlTable("session", {
	id: int("id").primaryKey().autoincrement(),
	userId: int("user_id").notNull(),
	createdAt: datetime("created_at").notNull(),
	duration: int("duration").notNull(), // in seconds 
});

export const score = mysqlTable("score", {
	id: int("id").primaryKey().autoincrement(),
	sessionId: int("session_id").notNull(),
	levelId: int("level_id").notNull(),
	createdAt: datetime("created_at").notNull(),
	score: int("score").notNull(),
	timeTaken: int("time_taken").notNull(), // in seconds
	accuracy: float("accuracy").notNull(),
});

export const level = mysqlTable("level", {
	id: int("id").primaryKey().autoincrement(),
	name: varchar("name", { length: 255 }).notNull(),
	difficulty: int("difficulty").notNull(),
});

// One user can have many sessions
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
}));

// One session belongs to one user, and the userId refers the user table's id
// One session can have many scores
export const sessionRelations = relations(session, ({ one, many }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
	scores: many(score),
}));

// One score belongs to one session, and the sessionId refers the session table's id
// One score belongs to one level, and the levelId refers the level table's id
export const scoreRelations = relations(score, ({ one }) => ({
	session: one(session, {
		fields: [score.sessionId],
		references: [session.id],
	}),
	level: one(level, {
		fields: [score.levelId],
		references: [level.id],
	}),
}));

// One level can be associated with many scores 
export const levelRelations = relations(level, ({ many }) => ({
	scores: many(score),
}));

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Score = typeof score.$inferSelect;
export type Level = typeof level.$inferSelect;
