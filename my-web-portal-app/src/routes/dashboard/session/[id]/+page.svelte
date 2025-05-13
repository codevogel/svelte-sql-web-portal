<script lang="ts">
	import ScoreTable from '$lib/components/ui/views/tables/ScoreTable.svelte';
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import ScoreOverTimeInSessionChart from '$lib/components/ui/views/chart/ScoreOverTimeInSessionChart.svelte';

	let { data } = $props();
	let sessionEnd = new Date(data.session.createdAt.getTime() + data.session.duration * 1000);
</script>

<div class="mx-auto grid h-full grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-8">
	<Card>
		{#snippet header()}
			<h1>Session {data.session.id}</h1>
		{/snippet}
		{#snippet article()}
			<div class="grid grid-cols-2">
				<span>User name:</span>
				<span>{data.user.name}</span>
				<span>Session started:</span>
				<span>{data.session.createdAt.toLocaleString()}</span>
				<span>Session ended:</span>
				<span>{sessionEnd.toLocaleString()}</span>
			</div>
		{/snippet}
	</Card>
	<Card>
		{#snippet header()}
			<h2 class="h4">Scores in this session</h2>
		{/snippet}
		{#snippet article()}
			<ScoreTable scores={data.scores} />
		{/snippet}
	</Card>
	<Card baseExtension="lg:col-span-2 !max-w-full">
		{#snippet header()}
			<h1>Score over time</h1>
		{/snippet}
		{#snippet article()}
			<div class="justify-center">
				<ScoreOverTimeInSessionChart scores={data.scores} />
			</div>
		{/snippet}
	</Card>
</div>
