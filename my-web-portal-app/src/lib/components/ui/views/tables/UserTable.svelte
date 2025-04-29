<script lang="ts">
	import type { User } from '$lib/server/db/schema';

	let { users }: { users: User[] } = $props();
</script>

<div class="table-wrap">
	<table class="table caption-bottom">
		<caption class="pt-4">A list of users and their age.</caption>
		<thead>
			<tr>
				<th>Name</th>
				<th>Age</th>
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each users as user (user.id)}
				<tr>
					<td>{user.name}</td>
					<td>{user.age}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
