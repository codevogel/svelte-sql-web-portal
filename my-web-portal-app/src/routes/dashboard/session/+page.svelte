<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import { type SessionWithUsername } from '$lib/server/db/dao/SessionDAO';

	import Table from '$lib/components/ui/views/tables/Table.svelte';

	let { data } = $props();
	let sessions: SessionWithUsername[] | undefined = $derived(data.sessions);

	let table = $derived({
		columns: ['ID', 'Username'],
		rows: sessions?.map((session) => {
			return {
				values: [session.id, session.username],
				url: `/dashboard/session/${session.id}`
			};
		})
	});

	let idInput: HTMLInputElement, usernameInput: HTMLInputElement;

	function searchForSessionsById(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		usernameInput.value = '';
		event.currentTarget.form?.requestSubmit();
	}

	function searchForSessionsByUsername(
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	) {
		idInput.value = '';
		event.currentTarget.form?.requestSubmit();
	}
</script>

<div class="lg: m-auto grid grid-cols-1 items-center gap-4 lg:grid-cols-[auto_1fr] lg:gap-8">
	<Card baseExtension="lg:min-w-md">
		{#snippet header()}
			<h1>Find a session</h1>
		{/snippet}
		{#snippet article()}
			<form data-sveltekit-keepfocus>
				<label for="id">Session ID: </label>
				<input
					class="input"
					type="text"
					name="id"
					oninput={searchForSessionsById}
					bind:this={idInput}
				/>
				<label for="id">Username: </label>
				<input
					class="input"
					type="text"
					name="username"
					oninput={searchForSessionsByUsername}
					bind:this={usernameInput}
				/>
			</form>
		{/snippet}
	</Card>
	{#if sessions && sessions.length > 0}
		<Card baseExtension="lg:min-w-md">
			{#snippet header()}
				<h1>Found Sessions</h1>
			{/snippet}
			{#snippet article()}
				<div class="max-h-64 overflow-y-scroll">
					<Table {table} paginationOptions={{ enabled: false }} />
				</div>
			{/snippet}
		</Card>
	{:else}
		<div class="flex flex-col items-center justify-center lg:min-w-md">
			<p>Try searching for a session by id or username.</p>
		</div>
	{/if}
</div>
