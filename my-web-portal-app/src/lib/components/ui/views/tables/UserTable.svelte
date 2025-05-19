<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { TableData } from '$lib/components/ui/views/tables/Table.svelte';

	let { users }: { users: User[] } = $props();

	const table: TableData = $derived({
		caption: 'A list of users.\nClick to view their profile.',
		columns: ['Username', 'Age', 'Created At'],
		rows: users.map((user: User) => ({
			values: [
				user.username,
				Math.abs(new Date(Date.now() - user.dateOfBirth.getTime()).getUTCFullYear() - 1970),
				user.createdAt.toLocaleDateString()
			],
			url: `/dashboard/user/${user.id}`
		}))
	});
</script>

<Table {table} />
