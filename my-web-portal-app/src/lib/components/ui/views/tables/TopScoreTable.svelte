<script lang="ts">
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { TopScore } from '$lib/server/db/dao/ScoreDAO';

	let { topScores }: { topScores: TopScore[] } = $props();

	// Define the columns for the Score table
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'levelId', label: 'Level ID' },
		{ key: 'score', label: 'Score' },
		{ key: 'accuracy', label: 'Accuracy' },
		{ key: 'timeTaken', label: 'Time Taken' },
		{ key: 'createdAt', label: 'Created At' },
		{ key: 'sessionId', label: 'Session ID', url: true }
	];

	const rows = topScores.map((score, index) => ({
		...score,
		createdAt: new Date(score.createdAt).toLocaleString(),
		index: index,
		url: `dashboard/session/${score.sessionId}`
	}));
</script>

<Table {columns} {rows} caption="The top 10 users with highest scores" />
