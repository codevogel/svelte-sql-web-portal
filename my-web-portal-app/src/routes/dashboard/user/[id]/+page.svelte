<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import SessionTable from '$lib/components/ui/views/tables/SessionTable.svelte';
	import type { SessionWithAverageScore } from '$lib/server/db/dao/SessionDAO.js';
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();

	let user: User = $derived(data.user);
	let sessions: SessionWithAverageScore[] = $derived(data.sessions);
	let userAge: number = $derived(
		Math.abs(new Date(Date.now() - user.dateOfBirth.getTime()).getUTCFullYear() - 1970)
	);
</script>

<div class="m-auto grid grid-cols-1 gap-4 lg:grid-cols-2">
	<Card>
		{#snippet header()}
			<h1>User Profile</h1>
		{/snippet}
		{#snippet article()}
			<div class="grid grid-cols-2 justify-between">
				<span>Name:</span>
				<span>{user.name}</span>
				<span>Age:</span>
				<span>{userAge}</span>
				<span>User Since:</span>
				<span>{user.createdAt.toLocaleDateString()}</span>
			</div>
		{/snippet}
	</Card>

	<Card>
		{#snippet header()}
			<h1>Sessions</h1>
		{/snippet}
		{#snippet article()}
			<SessionTable {sessions} />
		{/snippet}
	</Card>
</div>
