<script lang="ts">
	import UserTable from '$lib/components/ui/views/tables/UserTable.svelte';
	const { data } = $props();
</script>

<UserTable users={data.users} />
