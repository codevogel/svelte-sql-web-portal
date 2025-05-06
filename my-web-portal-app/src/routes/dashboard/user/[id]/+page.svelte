<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import SessionTable from '$lib/components/ui/views/tables/SessionTable.svelte';
	import type { Session, User } from '$lib/server/db/schema';

	let { data } = $props();

	let user: User = $derived(data.user);
	let sessions: Session[] = $derived(data.sessions);
	let userAge: number = $derived(
		Math.abs(new Date(Date.now() - user.dateOfBirth.getTime()).getUTCFullYear() - 1970)
	);
</script>

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
