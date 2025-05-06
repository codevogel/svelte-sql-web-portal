<script lang="ts">
	import type { Score, Session, User } from '$lib/server/db/schema';
	import ScoreTable from '$lib/components/ui/views/tables/ScoreTable.svelte';
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import ScoreOverTimeInSessionChart from './chart/ScoreOverTimeInSessionChart.svelte';

	let { session, user, scores }: { session: Session; user: User; scores: Score[] } = $props();

	let sessionEnd = new Date(session.createdAt.getTime() + session.duration * 1000);
</script>

<div class="mx-auto grid h-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12">
	<Card>
		{#snippet header()}
			<h1>Session {session.id}</h1>
		{/snippet}
		{#snippet article()}
			<div class="grid grid-cols-2">
				<span>User name:</span>
				<span>{user.name}</span>
				<span>Session started:</span>
				<span>{session.createdAt.toLocaleString()}</span>
				<span>Session ended:</span>
				<span>{sessionEnd.toLocaleString()}</span>
			</div>
			<h2 class="h4">Scores in this session</h2>
			<ScoreTable {scores} />
		{/snippet}
	</Card>
	<Card>
		{#snippet header()}
			<h1>Score over time</h1>
		{/snippet}
		{#snippet article()}
			<div class="justify-center">
				<ScoreOverTimeInSessionChart {scores} />
			</div>
		{/snippet}
	</Card>
</div>
