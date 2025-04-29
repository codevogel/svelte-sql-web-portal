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
				age: f.int({
					minValue: 18,
					maxValue: 80,
				}),
			},
		},
	}));
	console.log("Database reseeded successfully");
	client.end();
}

async function main() {
	await reseed_db();
}

main()

