# 3. - Drizzle ORM

Now that we have a basic website up and running, we can start adding some data to it. In this chapter, we will set up [Drizzle](https://orm.drizzle.team/) as our Object Relational Mapper (ORM) to interact with our MySQL database.

## Goal

In this chapter, we will learn:
- What an ORM is and how it can help us interact with our database.
- How to set up Drizzle ORM to interact with our MySQL database.
- How to define a database schema using Drizzle.
- How to use drizzle-seed to seed our database with initial data.
- How to create a Data Access Object (DAO) to handle database queries.
- How to load data in Svelte using server-side load functions.
- How to use the $props rune to access data in Svelte components.

## 3.0 - Introduction to ORMs

An ORM (Object Relational Mapper) is a programming technique that allows us to interact with a database using an object-oriented approach. Instead of writing raw SQL queries, we can use an ORM to define our database tables and relationships as classes and objects in our code. This allows us to work with our data in a more intuitive way, and can help us avoid some of the common pitfalls of raw SQL queries, such as SQL injection attacks.
i
[Drizzle](https://orm.drizzle.team/) is a TypeScript ORM that is designed to be simple and easy to use. It allows us to define our database tables and relationships using TypeScript classes, and provides a simple API for querying and manipulating our data. Drizzle also provides drizzle-seed, a tool for seeding our database with initial data. This can be useful for testing and development purposes, as it allows us to quickly populate our database with some sample data without having to write a bunch of SQL queries by hand.

## 3.1 - A simple schema

Let's do some simple setup and verify that Drizzle works.

As SvelteKit has already installed Drizzle into our project during setup, let's talk about some of the files it's created for us.

- `.env` and `.env.example`
    - These files are used to store environment variables. The `.env` file is used to store sensitive information, such as database connection strings, while the `.env.example` file is used to provide a template for the `.env` file. You should **never** commit your `.env` file to version control, as it contains sensitive information.
- `drizzle.config.ts`
    - This file is used to configure Drizzle. It contains the database connection string and other configuration options. You can find more information about the configuration options in the [Drizzle documentation](https://orm.drizzle.team/docs/get-started/mysql-new).
- `src/lib/server/db/index.ts`
    - This file is used to create a connection to the database and export the Drizzle instance. You can find more information about the configuration options in the [Drizzle documentation](https://orm.drizzle.team/docs/get-started/mysql-new). 
- `src/lib/server/db/schema.ts`
    - This file is used to define the database schema. It contains the database tables and relationships. You can find more information about the schema options in the [Drizzle documentation](https://orm.drizzle.team/docs/sql-schema-declaration).

In `.env`, we want to update the `DATABASE_URL` to reflect the proper configuration. I'm using `root`  as the `username` here, a `password`, the `host` `localhost`, port `3306` (default port for the SQL database provided in XAMPP), and we point at a database `web-portal-test` (that we have yet to create!). If you've messed around with the usernames, ports and/or passwords, fill those in instead. 

```
# Replace with your DB credentials!
DATABASE_URL="mysql://root:my_very_secret_password@host:3306/web-portal-test"
```

Now in `src/lib/server/db/schema.ts` we expand the default schema to include a `name` field:

```typescript
import { mysqlTable, serial, text, int } from 'drizzle-orm/mysql-core';

// Here we define our database schema. We can use the drizzle-orm functions to define the tables and their columns.
export const user = mysqlTable('user', {
	id: serial('id').autoincrement().primaryKey(),
	age: int('age'),
	name: text('name').notNull()
});

// We  can also export the type of the user table, so we can later use it for type safety.
export type User = typeof user.$inferSelect;
```

Now let's create this test database, and  `push` this schema to our database using `drizzle-kit:
1. Create the `web-portal-test` database in PHPMyAdmin.
2. Ensure you are in your svelte project's root directory (`~/work/my-web-portal-app`)
3. Run `npx drizzle-kit push`. Should you be asked to install `drizzle-kit`, confirm with the `Y` key.
4. Confirm the creation of the table, and you should see something like this:
   ![drizzle-push.png](img/drizzle-push.png)

Now verify that our database has indeed updated to contain this table in [PHPMyAdmin](http://localhost/phpmyadmin), with the fields and constraints we specified in `src/lib/server/db/schema.ts`:

![myadmin-confirm.png](img/myadmin-confirm.png)

Cool. We managed to update our database schema without writing a single line of actual SQL.

## 3.2 - Seeding the database

Now let's fill the database with some test data. We could manually add some data in PHPMyAdmin, but that can be cumbersome, and may result into data entry errors. Instead, we can use [drizzle-seed](https://orm.drizzle.team/docs/seed-overview) to seed our database with some realistic, deterministic, and reproducible data.

### 3.2.1 - Setup

1. Let's set up a script using `drizzle-seed` to do this. In the root of the project, we'll create a new folder called `scripts`, and in it, we'll create a new file called `reseed.ts` (the name is not important here, but it seems logical to call it this way, as we'll be using the script to reseed the database each time we alter the schema).

2. Now, we'll need to add the `drizzle-seed` package to our project.

    ```bash
    npm i drizzle-seed
    ```

    While we're at it, let's also install `dotenv` and `tsx`. `dotenv` will be used to load our environment variables from the `.env` file (as the script won't run from a Svelte context, we cannot use the `$dynamic` import as we did in `src/lib/server/db/index.ts`), and `tsx` will be used to run the script. (`tsx` is a TypeScript execution engine that allows us to run TypeScript files directly without having to compile them first.)
    These packages can go into the `devDependencies` as we won't need them in production.

    ```bash
    npm i --save-dev dotenv tsx
    ```
3. Now, let's write the code for our script. `tsx` will call the main function in the script, so we create a main function that calls our reseed function. We import the `reset` and `seed` functions from `drizzle-seed`, and create the drizzle instance as we did before in `src/lib/server/db/index.ts`. We will then call the `reset` function to drop all tables and create them again, and then call the `seed` function to fill the database with some test data. The `seed` function takes a `db` instance and a `schema` object as arguments. Note that we could supply only part of the schema here too to only reset or seed relevant tables. Finally, don't forget to end the connection to the database when we're done.

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
        console.log("Resetting the database...");
        await reset(db, schema);
        console.log("Seeding the database...");
        await seed(db, schema);
        console.log("Database reseeded successfully");
        client.end();
    }

    async function main() {
        await reseed_db();
    }

    main()
    ```

### 3.2.2 - Seeding and refinements 

Let's execute the script:

```bash
npx tsx scripts/reseed.ts
```

If all goes well, we should now see the database was (re)seeded succesfully. Let's take a look at the generated data in PHPMyAdmin:

![seed.png](img/seed.png)

Okay, the data does look bit odd. There's lots of *really* old people in there, and some of them have *very long* to go before they're even born.
It's clear we  need some refinements to the seeding process. Luckily, Drizzle [makes this really easy](https://orm.drizzle.team/docs/seed-overview#refinements) as well.

After calling  the `seed` function, we can chain a call to the `refine` function. This takes a function as an argument, which receives an object that contains the schema and our wanted constraints. 

Let's update our `scripts/reseed.ts` file so we generate 20 users, and set somewhat realistic constraints on the ages.

```typescript
await seed(db, schema).refine((f) => ({
		user: {
			count: 20,
			columns: {
				age: f.int({
					minValue: 18,
					maxValue: 80,
				}),
			},
		},
	}));
```

Now we run our reseed script again. As this is something we will be doing often, we can also choose to do a little script-ception and make a script that runs this script in our `package.json` file. You can skip this step if you don't want to do this, but it's a nice little trick to have in your back pocket.

```json
...
"scripts": {
    ...
    "db:reseed": "npx tsx scripts/reseed.ts"
},
...
```

(Hint: If you're not used to JSON, don't forget to add a comma after the first-to-last entry in the `scripts` section!)

Now we can also run `npm run db:reseed` to reseed our database. Let's do that now, and check the database again in PHPMyAdmin:

![seed-refined.png](img/seed-refined.png)

Looks much better, and it takes us near no time to change the constraints and reseed the database.

# 3.3 - Querying the database

Now that we have some (albeit fake and very little) data in our database, we can start querying it and displaying the data in our dashboard. For now, we will just display a bunch of users and their ages, as that is the only thing our database contains, but by now we should have an idea of how we can easily extend this to include other data and more advanced queries as well.

### 3.3.0 - The DAO

In order to keep our code clean and organized, we will create a Data Access Object (DAO) that will handle all the database queries. This will allow us to separate the database logic from the rest of our application, and make it easier to maintain our code.

A DAO is a design pattern that provides an abstract interface to a database. It allows us to perform CRUD (Create, Read, Update, Delete) operations on our database without exposing the underlying database implementation details. In our case, we will create a `UserDAO` class that will handle all the queries related to the `user` table.

In a new directory, `src/lib/server/db/dao`, we create a new file called `UserDAO.ts`. It will contain a class with static methods to handle the database queries. We will use the Drizzle `db` instance from `src/lib/server/db/index.ts` to interact with the database.

`/src/lib/server/db/dao/UserDAO.ts`:

```typescript
import { db } from '$lib/server/db';
import { user, type User } from '$lib/server/db/schema';

export class UserDAO {
	// Get all users from the database
	static async getAll(): Promise<User[]> {
		// Drizzle ORM query to select all users
		// Note the similarity to the SQL query: SELECT * FROM user
		return await db.select().from(user);
	}
}
```
We return a promise of an array of `User` objects, the type of which we inferred and exported in our `src/lib/server/db/schema.ts`. We can now use this class to query the database and get all users.

### 3.3.1 - Loading data in Svelte

Now that we have our `UserDAO` class set up, we can use it to load data into our Svelte pages.

The Svelte documentation describes [a few different ways to load data](https://svelte.dev/docs/kit/load). Reading through the documentation, it seems Server load functions are [the most appropriate way](https://svelte.dev/docs/kit/load#Universal-vs-server-When-to-use-which) to load data for our dashboard.

So let's add a new file `src/routes/dashboard/+page.server.ts` to our project and do just that:

```typescript
import type { User } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { UserDAO } from '$lib/server/db/dao/UserDAO';

export const load: PageServerLoad = async () => {
	// Here we query the user data using our DAO and return it
	const users: User[] = await UserDAO.getAll();
	return {
		users,
	};

}
```

Now what this has done is create a server-side load function that will be called when the page is loaded. This function will query the database using our `UserDAO` class and return the data to the Svelte page. 

We can access this data using the [`$props()` rune](https://svelte.dev/docs/svelte/$props) and display it:

```html
<script lang="ts">
	const { data } = $props();
</script>

{#each data.users as user}
    <p>{user.name} is {user.age} years old</p>
{/each}
```

Awesome! Now as we'll be displaying more data in the future, let's extract the display logic into a new component, so we have less clutter on our dashboard page.

### 3.3.2 - Extracting the UserTable component

We'll create a new component in `src/lib/components/ui/views/tables/UserTable.svelte` and move the display logic there.

1. We create the new component file.

2. We import the `User` type from our schema, and expose a prop called `users` using the $props rune again. The prop should take in an array of `User` objects.

    ```html
    <script lang="ts">
        import type { User } from '$lib/server/db/schema';

        let { users }: { users: User[] } = $props();
    </script>
    ```

3. Now let's add some simple [Table styling using Skeleton](https://www.skeleton.dev/docs/tailwind/tables).

    ```html
    ...
    <div class="table-wrap">
        <table class="table caption-bottom">
            <caption class="pt-4">A list of users and their age.</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
                {#each users as user (user.id)}
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.age}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    ```

4. Finally, we use this newly created component in `src/routes/dashboard/+page.svelte`, and pass the `users` data to the prop:

    ```html
    <script lang="ts">
        import UserTable from '$lib/components/ui/views/tables/UserTable.svelte';
        const { data } = $props();
    </script>

    <UserTable users={data.users} />
    ```

And there we have it! Data pulled directly from our database, nicely formatted, and delivered to us by some easily maintainable and extendable code.

![dashboard-with-data](img/dashboard-with-data.png)

## 3.4 - Rounding up

In this chapter, we learned:
- What an ORM is and how it can help us interact with our database.
- How to set up Drizzle ORM to interact with our MySQL database.
- How to define a database schema using Drizzle.
- How to use drizzle-seed to seed our database with initial data.
- How to create a Data Access Object (DAO) to handle database queries.
- How to load data in Svelte using server-side load functions.
- How to use the $props rune to access data in Svelte components.
- How to extract a Svelte component to display data in a table format.

We're getting closer and closer to a functional web portal.

### Next

In the next chapter, let's add some more data to our database, and display it in a more visually pleasing way. We'll also add some interactivity to our dashboard, so we can filter and sort the data. This will allow us to create a more dynamic and user-friendly experience for our users.
See [4-advanced-dashboard](../4-advanced-dashboard/4-advanced-dashboard.md).

