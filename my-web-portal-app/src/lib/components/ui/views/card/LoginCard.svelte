<script lang="ts">
	import Card from '$lib/components/ui/views/card/Card.svelte';
</script>

<Card footerBase="flex flex-col p-8 gap-y-4">
	{#snippet header()}
		<h1 class="h1 p-8">Log In</h1>
	{/snippet}
	{#snippet article()}
		<form class="mx-auto w-full max-w-md space-y-4">
			<!-- --- -->
			<label class="label">
				<span class="label-text">Name</span>
				<input type="text" class="input" placeholder="Enter name" />
			</label>
			<!-- --- -->
			<label class="label">
				<span class="label-text">Password</span>
				<input type="password" class="input" placeholder="Enter Password" />
			</label>
		</form>
	{/snippet}
	{#snippet footer()}
		<button class="btn preset-filled-primary-500">Log In</button>
		<small>
			Don't have an account? <a href="/register" class="text-primary-500">Register</a>
		</small>
	{/snippet}
</Card>
