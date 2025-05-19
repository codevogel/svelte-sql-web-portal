<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import Table from '$lib/components/ui/views/tables/Table.svelte';
	import type { User } from '$lib/server/db/schema';

	let { data } = $props();
	let users: User[] | undefined = $derived(data.users);

	let table = $derived({
		columns: ['Username', 'Created At'],
		rows: users?.map((user) => ({
			values: [user.username, user.createdAt.toLocaleDateString()],
			url: `/dashboard/user/${user.id}`
		}))
	});

	function searchForUsersByName(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		event.currentTarget.form?.requestSubmit();
	}
</script>

<div
	class="mx-auto my-24 grid grid-cols-1 items-center gap-4 sm:my-48 lg:my-auto lg:grid-cols-[auto_1fr] lg:gap-8"
>
	<Card baseExtension="lg:min-w-md">
		{#snippet header()}
			<h1>Find a user</h1>
		{/snippet}
		{#snippet article()}
			<form data-sveltekit-keepfocus>
				<label for="username">Name: </label>
				<input class="input" type="text" name="username" oninput={searchForUsersByName} />
			</form>
		{/snippet}
	</Card>
	{#if users && users.length > 0}
		<Card baseExtension="lg:min-w-md">
			{#snippet header()}
				<h1>Found users</h1>
			{/snippet}
			{#snippet article()}
				<div class="max-h-64 overflow-y-scroll">
					<Table {table} paginationOptions={{ enabled: false }} />
				</div>
			{/snippet}
		</Card>
	{:else}
		<div class="flex flex-col items-center justify-center lg:min-w-md">
			<p>Try searching for a user by name.</p>
		</div>
	{/if}
</div>
