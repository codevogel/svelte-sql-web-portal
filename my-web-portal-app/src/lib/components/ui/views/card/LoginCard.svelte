<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/views/card/Card.svelte';
</script>

<Card footerBase="flex flex-col p-8 gap-y-4">
	{#snippet header()}
		<h1 class="h1 p-8">Log In</h1>
	{/snippet}
	{#snippet article()}
		<button class="btn preset-filled-primary-500" onclick={() => goto('/login/github')}
			>Log in with GitHub</button
		>
	{/snippet}
</Card>
