<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/ui/nav/NavBar.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<NavBar />
	<main class="flex flex-grow justify-center py-4">
		<div class="max-w-[min(85%,100ch)] flex-grow">
			{@render children()}
		</div>
	</main>
	<footer class="h-24">Footer</footer>
</div>
