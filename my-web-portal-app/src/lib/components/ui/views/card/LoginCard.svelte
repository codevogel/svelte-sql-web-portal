<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import GitHubIcon from '$lib/components/ui/logo/GitHubIcon.svelte';
</script>

<Card footerBase="flex flex-col p-8 gap-y-4">
	{#snippet header()}
		<h1 class="h2">Log In</h1>
	{/snippet}
	{#snippet article()}
		<button class="btn preset-filled-primary-500" onclick={() => goto('/login/github')}
			><span><GitHubIcon /></span>Log in with GitHub</button
		>
		<p>
			Please note that your GitHub account has to be whitelisted by the site administrator in order
			to access this website.
		</p>
	{/snippet}
</Card>
