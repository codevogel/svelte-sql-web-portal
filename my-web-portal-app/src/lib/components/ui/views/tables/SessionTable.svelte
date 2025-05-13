<script lang="ts">
	import Table, { type TableData } from '$lib/components/ui/views/tables/Table.svelte';
	import type { SessionWithAverageScore } from '$lib/server/db/dao/SessionDAO';

	let { sessions }: { sessions: SessionWithAverageScore[] } = $props();

	const table: TableData = $derived({
		caption: 'Scores in this session.',
		columns: ['ID', 'Duration', 'Created At', 'Ended At', 'Average Score'],
		rows: sessions.map((session: SessionWithAverageScore) => ({
			values: [
				session.id,
				session.duration,
				session.createdAt.toLocaleString(),
				new Date(session.createdAt.getTime() + session.duration * 1000).toLocaleString(),
				session.averageScore
			]
		}))
	});
</script>

<Table {table} />
