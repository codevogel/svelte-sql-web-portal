# 4 - Advanced Dashboard

Now that we know how to load data from our database and display it in the dashboard, let's expand our database with some more realistic data, and then try to display it in more advanced ways, such as using charts. Furthermore, we will also learn how to write some more advanced queries and how to add interactive elements to the dashboard so we can  filter and sort the data.

## Goal

In this chapter we will learn how to:
- Display data in a more advanced way using charts
- Write more advanced queries to filter and sort the data
- Load, refresh, filter and sort data on the fly
- Add interactive elements to the dashboard to manipulate the data

## 4.0 - Adding realistic data

Since we currently have just a simple user table with three fields, let's add some more realistic data to our database.

In this example we will create a database for a hypothetical serious game. The database will contain data about users, sessions, scores, and levels. 

### 4.0.0 - Extending the schema

#### User

| Column        | Type       | Attributes        |
|---------------|------------|-------------------|
| `id`          | `int`      | Primary key, auto-increment |
| `created_at`  | `datetime` | Not null          |
| `name`        | `varchar(20)` | Not null      |
| `date_of_birth` | `datetime` | Not null      |

**Relationships**:
- One **User** has many **Sessions**

#### Session

| Column       | Type       | Attributes        |
|--------------|------------|-------------------|
| `id`         | `int`      | Primary key, auto-increment |
| `user_id`    | `int`      | Not null (FK → `user.id`) |
| `started_at` | `datetime` | Not null          |
| `duration`   | `int`      | Not null (in seconds) |

**Relationships**:
- One **Session** belongs to one **User**
- One **Session** has many **Scores**

#### Score

| Column        | Type     | Attributes        |
|---------------|----------|-------------------|
| `id`          | `int`    | Primary key, auto-increment |
| `session_id`  | `int`    | Not null (FK → `session.id`) |
| `level_id`    | `int`    | Not null (FK → `level.id`) |
| `score`       | `int`    | Not null          |
| `time_taken`  | `int`    | Not null (in seconds) |
| `accuracy`    | `float`  | Not null          |

**Relationships**:
- One **Score** belongs to one **Session**
- One **Score** belongs to one **Level**

#### Level

| Column     | Type         | Attributes        |
|------------|--------------|-------------------|
| `id`       | `int`        | Primary key, auto-increment |
| `name`     | `varchar(255)` | Not null        |
| `difficulty` | `int`      | Not null          |

**Relationships**:
- One **Level** has many **Scores**

Let's implement the schema in `src/lib/server/db/schema.ts`:

```ts
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
	startedAt: datetime("started_at").notNull(),
	duration: int("duration").notNull(), // in seconds 
});

export const score = mysqlTable("score", {
	id: int("id").primaryKey().autoincrement(),
	sessionId: int("session_id").notNull(),
	levelId: int("level_id").notNull(),
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
```

### 4.0.1 - Pushing the changes to the database 

Now that we have altered our schema, we need to push the changes to the database. Drizzle has a built-in migration system that allows us to do just that, but for brevity sake we will just drop all the tables from the database and create them again.

To do this, open up PHPMyAdmin, select your database, and click the "Drop" button next to each table. (Note: probably not the best idea in a database with real data! Since this is a test database with fake data, we can just reseed it later.)

After dropping all tables, run `npm run db:push` (shorthand for `npx drizzle-kit push`) to push the new schema to the database.

Now we will update `scripts/reseed.ts` to seed the new tables...

```typescript
import { reset, seed } from "drizzle-seed";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import *  as schema from "../src/lib/server/db/schema";
import "dotenv/config";

async function reseed_db() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

	const client = mysql.createPool(process.env.DATABASE_URL);
	const db = drizzle(client, { schema, mode: 'default' });
	console.log("Resetting database...");
	await reset(db, schema);
	console.log("Reseeding database...");
	await seed(db, schema).refine((f) => ({
		user: {
			count: 20,
			columns: {
				name: f.firstName(),
				createdAt: f.date({ minDate: "2025-01-01", maxDate: "2025-02-01" }),
				dateOfBirth: f.date({ minDate: "1990-01-01", maxDate: "2000-01-01" }),
			},
		},
		session: {
			count: 100,
			columns: {
				startedAt: f.date({ minDate: "2025-02-01", maxDate: "2025-03-01" }),
				duration: f.int({ minValue: 0, maxValue: 2 * 60 * 60 }),
			},
		},
		level: {
			count: 10,
			columns: {
				name: f.city(),
				difficulty: f.int({ minValue: 1, maxValue: 5 }),
			},
		},
		score: {
			count: 300,
			columns: {
				score: f.int({ minValue: 0, maxValue: 2000 }),
				accuracy: f.number({ minValue: 0, maxValue: 1, precision: 100 }),
				timeTaken: f.int({ minValue: 0, maxValue: 10 * 60 }),
			},
		}
	}));

	console.log("Database reseeded successfully");
	await client.end();
}

async function main() {
	await reseed_db();
}

main()
```

... and run `npm run db:reseed` (or `npx tsx scripts/reseed.ts` if you haven't added this as a script to `package.json`) to reseed the database with the new tables.

Browse through the data in PHPMyAdmin to see if everything looks good. You should see 20 users, 100 sessions, 10 levels, and 300 scores.

## 4.1 - Advanced queries

Now that we have some more advanced data in our database, let's look at some more advanced queries.

### 4.1.0 - Top 10 users by score
