import { mysqlTable, int, text } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
	id: int('id').primaryKey().autoincrement(),
	age: int('age'),
	name: text('name').notNull()
});

export type User = typeof user.$inferSelect;
