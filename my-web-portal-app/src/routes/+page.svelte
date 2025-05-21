<script lang="ts">
	import { gameName } from '$lib/stores/projectInfo';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/views/card/Card.svelte';

	const imgSrc =
		'https://images.unsplash.com/photo-1463171515643-952cee54d42a?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	let { data } = $props();

	let loggedIn = $derived(data.loggedIn);
</script>

<div
	class="container mx-auto grid h-full w-full grid-cols-1 items-center justify-items-center gap-8 px-4"
>
	<Card footerBase="flex gap-x-4 p-8" footer={loggedIn ? undefined : footer}>
		{#snippet header()}
			<img src={imgSrc} class="aspect-[21/9] w-full hue-rotate-90" alt="banner" />
		{/snippet}
		{#snippet article()}
			<div>
				<h3 class="h3">Welcome!</h3>
			</div>
			<p class="opacity-60">
				This website functions as a web portal to a database for the game '{$gameName}'.
			</p>
			{#if !loggedIn}
				<p class="opacity-60">
					You can log in to start analyzing the training data for '{$gameName}'.
				</p>
			{/if}
		{/snippet}
	</Card>
	{#snippet footer()}
		<button class="btn preset-filled-primary-500" onclick={() => goto('/login')}>Log in</button>
	{/snippet}
</div>
