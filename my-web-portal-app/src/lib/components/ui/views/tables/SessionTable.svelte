<script lang="ts">
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { Session } from '$lib/server/db/schema';

	let { sessions }: { sessions: Session[] } = $props();

	// Define the columns for the Score table
	const columns = [
		{ key: 'id', label: 'ID' },
		{ key: 'duration', label: 'Duration' },
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'endedAt', label: 'Ended At' }
	];

	// Ensure each score has a unique `id` field
	const rows = sessions.map((session, index) => ({
		...session,
		index: index,
		createdAt: session.createdAt.toLocaleString(),
		endedAt: new Date(session.createdAt.getTime() + session.duration * 60).toLocaleString()
	}));
</script>

<Table {columns} {rows} caption="A list of scores in this session." />
