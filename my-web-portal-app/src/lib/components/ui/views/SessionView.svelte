<script lang="ts">
	import type { Score, Session, User } from '$lib/server/db/schema';
	import ScoreTable from '$lib/components/ui/views/tables/ScoreTable.svelte';

	let { session, user, scores }: { session: Session; user: User; scores: Score[] } = $props();

	let sessionEnd = new Date(session.createdAt.getTime() + session.duration * 1000);
</script>

<h1>Session {session.id}</h1>
<p><span class="font-bold">User name:</span> {user.name}</p>
<p>Session started: {session.createdAt.toLocaleString()}</p>
<p>Session end: {sessionEnd.toLocaleString()}</p>

<h1>Scores in this session</h1>
<ScoreTable {scores} />
