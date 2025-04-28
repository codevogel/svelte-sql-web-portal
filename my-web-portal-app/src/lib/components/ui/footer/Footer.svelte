<script lang="ts">
	let companyName = 'My Important Company';
	let currentYear = new Date().getFullYear();

	import { pages } from '$lib/stores/navigation';
</script>

<footer class="border-fg flex justify-center gap-x-16 border-t-2 py-2">
	<div class="flex flex-col items-start justify-center">
		<p class="text-fg text-center text-sm">
			&copy; {currentYear}
			{companyName}.
		</p>
		<p class="text-fg text-center text-sm">All rights reserved.</p>
	</div>
	<div class="flex flex-col items-start">
		<span class="font-bold">Site Map</span>
		{#each $pages as page (page.name)}
			<a href={page.path}>{page.name}</a>
		{/each}
	</div>
</footer>
