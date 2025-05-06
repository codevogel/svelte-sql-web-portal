<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import TopScoreTable from '$lib/components/ui/views/tables/TopScoreTable.svelte';
	import UserTable from '$lib/components/ui/views/tables/UserTable.svelte';
	const { data } = $props();
</script>

<div class="mx-auto grid grid-cols-1 gap-y-4">
	<Card baseExtension="!max-w-full w-6xl">
		{#snippet header()}
			<h1>Top 10 Users</h1>
		{/snippet}
		{#snippet article()}
			<TopScoreTable topScores={data.topScores} />
		{/snippet}
	</Card>
	<Card baseExtension="!max-w-full w-6xl">
		{#snippet header()}
			<h1>Users</h1>
		{/snippet}
		{#snippet article()}
			<UserTable users={data.users} />
		{/snippet}
	</Card>
</div>
