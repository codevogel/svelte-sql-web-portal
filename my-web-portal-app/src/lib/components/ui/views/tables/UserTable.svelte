<script lang="ts">
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { User } from '$lib/server/db/schema';

	let { users: users }: { users: User[] } = $props();

	// Define the columns for the Score table
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'age', label: 'Age' },
		{ key: 'createdAt', label: 'Created At' }
	];

	const rows = users.map((user, index) => ({
		...user,
		age: Math.abs(new Date(Date.now() - user.dateOfBirth.getTime()).getUTCFullYear() - 1970),
		createdAt: user.createdAt.toLocaleString(),
		index: index
	}));
</script>

<Table {columns} {rows} caption="A list of users and their age." />
