<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/ui/nav/NavBar.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<NavBar />
	<main class="flex-grow">
		{@render children()}
	</main>
	<footer class="h-24">Footer</footer>
</div>
