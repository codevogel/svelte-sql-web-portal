<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/ui/views/card/Card.svelte';
	import LoginCard from '$lib/components/ui/views/card/LoginCard.svelte';

	let gameName = 'DemoBots';
	const imgSrc =
		'https://images.unsplash.com/photo-1463171515643-952cee54d42a?q=80&w=450&h=190&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
</script>

<div
	class="container mx-auto grid h-full w-full grid-cols-1 items-center justify-items-center gap-8 px-4 lg:grid-cols-2"
>
	<Card footerBase="flex gap-x-4 p-8 lg:hidden">
		{#snippet header()}
			<img src={imgSrc} class="aspect-[21/9] w-full hue-rotate-90" alt="banner" />
		{/snippet}
		{#snippet article()}
			<div>
				<h3 class="h3">Welcome!</h3>
			</div>
			<p class="opacity-60">
				This website functions as a web portal to a database for the game '{gameName}'. <br />You
				can log in to start analyzing the training data for '{gameName}'.
			</p>
		{/snippet}
		{#snippet footer()}
			<button class="btn preset-filled-primary-500" onclick={() => goto('/login')}>Log In</button>
			<button class="btn preset-filled-primary-500">Register</button>
		{/snippet}
	</Card>
	<div class="hidden lg:block">
		<LoginCard />
	</div>
</div>
