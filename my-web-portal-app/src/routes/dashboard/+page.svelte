<script lang="ts">
	import TopScoreTable from '$lib/components/ui/views/tables/TopScoreTable.svelte';
	import UserTable from '$lib/components/ui/views/tables/UserTable.svelte';
	const { data } = $props();
</script>

<UserTable users={data.users} />
<TopScoreTable topScores={data.topScores} />
