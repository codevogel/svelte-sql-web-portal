<script lang="ts">
	import { goto } from '$app/navigation';
	import LightSwitch from '$lib/components/ui/light-switch/LightSwitch.svelte';

	let pages = [
		{ name: 'Home', path: '/' },
		{ name: 'Dashboard', path: '/dashboard' },
		{ name: 'About', path: '/about' }
	];
</script>

<nav class="h-24">
	{#each pages as page (page.name)}
		<button type="button" on:click={() => goto(page.path)} class="btn preset-tonal-surface">
			{page.name}
		</button>
	{/each}
	<LightSwitch />
</nav>
