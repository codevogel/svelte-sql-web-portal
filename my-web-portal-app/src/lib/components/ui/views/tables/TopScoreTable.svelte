<script lang="ts">
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { TopScore } from '$lib/server/db/dao/ScoreDAO';

	let { topScores }: { topScores: TopScore[] } = $props();

	const table = $derived({
		caption:
			'A list of the top 10 users who have the highest scores.\nClick to view the session in which they achieved it.',
		columns: [
			'Ranking',
			'Name',
			'Level ID',
			'Score',
			'Accuracy',
			'Time Taken',
			'Created At',
			'Session ID'
		],
		rows: topScores.map((score: TopScore, index: number) => ({
			values: [
				index + 1,
				score.name,
				score.levelId,
				score.score,
				score.accuracy,
				score.timeTaken,
				score.createdAt.toLocaleString(),
				score.sessionId
			],
			url: `/dashboard/session/${score.sessionId}`
		}))
	});
</script>

<Table {table} paginationOptions={{ enabled: false }} />
