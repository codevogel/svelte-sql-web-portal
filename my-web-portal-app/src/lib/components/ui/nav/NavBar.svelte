<script lang="ts">
	import { goto } from '$app/navigation';
	import LightSwitch from '$lib/components/ui/light-switch/LightSwitch.svelte';

	import { DatabaseZap, House, Gauge, Info } from 'lucide-svelte';

	let pages = [
		{ name: 'Home', path: '/', icon: House },
		{ name: 'Dashboard', path: '/dashboard', icon: Gauge },
		{ name: 'About', path: '/about', icon: Info }
	];
</script>

<nav class="border-fg grid h-24 grid-cols-3 items-center border-b-2 px-8">
	<div class="flex justify-start">
		<button type="button" on:click={() => goto('/')} class="btn preset-tonal-surface h-16 w-fit">
			<span class="flex gap-x-2">
				<DatabaseZap />
				Web Portal
			</span>
		</button>
	</div>
	<div class="flex justify-center">
		{#each pages as page (page.name)}
			<button type="button" on:click={() => goto(page.path)} class="btn preset-tonal-surface h-16">
				<page.icon />
				{page.name}
			</button>
		{/each}
	</div>
	<div class="flex justify-end">
		<LightSwitch />
	</div>
</nav>
