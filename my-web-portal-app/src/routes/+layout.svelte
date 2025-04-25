<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<nav class="h-24">
		<a href="/">Home</a>
		<a href="/dashboard">Dashboard</a>
		<a href="/about">About</a>
	</nav>
	<main class="flex-grow">
		{@render children()}
	</main>
	<footer class="h-24">Footer</footer>
</div>
