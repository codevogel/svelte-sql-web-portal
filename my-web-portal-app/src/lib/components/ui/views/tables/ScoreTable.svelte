<script lang="ts">
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { Score } from '$lib/server/db/schema';

	let { scores }: { scores: Score[] } = $props();

	// Define the columns for the Score table
	const columns = [
		{ key: 'levelId', label: 'Level ID' },
		{ key: 'score', label: 'Score' },
		{ key: 'timeTaken', label: 'Time Taken' },
		{ key: 'accuracy', label: 'Accuracy' },
		{ key: 'createdAt', label: 'Created At' }
	];

	// Ensure each score has a unique `id` field
	const rows = scores.map((score, index) => ({
		...score,
		index: index,
		createdAt: score.createdAt.toLocaleString()
	}));
</script>

<Table {columns} {rows} caption="A list of users and their age." />
