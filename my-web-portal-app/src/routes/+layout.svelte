<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/ui/nav/NavBar.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header>
		<NavBar loggedIn={data.loggedIn} />
	</header>
	<!-- Page -->
	<div class="mx-auto grid w-full grid-cols-1">
		<!-- Sidebar (Left) -->
		<!-- NOTE: hidden in smaller screen sizes -->
		<!-- Main -->
		<main class="col-span-1 space-y-4">
			{@render children()}
		</main>
		<!-- Sidebar (Right) -->
		<!-- NOTE: hidden in smaller screen sizes -->
	</div>
	<!-- Footer -->
	<footer></footer>
</div>
