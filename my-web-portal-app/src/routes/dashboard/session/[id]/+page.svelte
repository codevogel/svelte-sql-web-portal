<script lang="ts">
	import SessionView from '$lib/components/ui/views/SessionView.svelte';

	let { data } = $props();
</script>

<SessionView session={data.session} scores={data.scores} user={data.user} />
