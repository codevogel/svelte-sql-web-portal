<script lang="ts">
	let pages = [
		{ name: 'Home', path: '/' },
		{ name: 'Dashboard', path: '/dashboard' },
		{ name: 'About', path: '/about' }
	];
</script>

<nav class="h-24">
	{#each pages as page (page.name)}
		<a href={page.path}>{page.name}</a>
	{/each}
</nav>
