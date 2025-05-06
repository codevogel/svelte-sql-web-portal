<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();
	let users: User[] = $derived(data.users);

	function searchForUsersByName(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		event.currentTarget.form?.requestSubmit();
	}
</script>

<div class="m-auto grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-8">
	<Card>
		{#snippet header()}
			<h1>Find a user</h1>
		{/snippet}
		{#snippet article()}
			<form data-sveltekit-keepfocus>
				<label for="name">Name: </label>
				<input class="input" type="text" name="name" oninput={searchForUsersByName} />
			</form>
		{/snippet}
	</Card>
	{#if users && users.length > 0}
		<Card>
			{#snippet header()}
				<h1>Found users</h1>
			{/snippet}
			{#snippet article()}
				{#each users as user (user.id)}
					<span class="flex justify-between">
						<p>{user.name}</p>
						<button
							class="btn preset-filled-primary-500"
							onclick={() => goto(`/dashboard/user/${user.id}`)}>View</button
						>
					</span>
				{/each}
			{/snippet}
		</Card>
	{/if}
</div>
