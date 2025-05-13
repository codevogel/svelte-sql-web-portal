<script lang="ts">
	import Table, { type TableData } from '$lib/components/ui/views/tables/Table.svelte';
	import type { Score } from '$lib/server/db/schema';

	let { scores }: { scores: Score[] } = $props();

	const table: TableData = $derived({
		caption: 'A list of scores in this session.',
		columns: ['Level ID', 'Score', 'Accuracy', 'Time Taken', 'Created At'],
		rows: scores.map((score: Score) => ({
			values: [
				score.levelId,
				score.score,
				score.accuracy,
				score.timeTaken,
				score.createdAt.toLocaleString()
			]
		}))
	});
</script>

<Table {table} />
