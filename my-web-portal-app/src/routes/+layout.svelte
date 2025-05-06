<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/ui/nav/NavBar.svelte';

	let { children } = $props();

	$effect(() => {
		const html = document.querySelector('html');
		if (!html) {
			return;
		}
		const storedMode = localStorage.getItem('theme.mode');
		const storedTheme = localStorage.getItem('theme.name');
		const defaultMode = html.dataset.modeDefault;
		const defaultTheme = html.dataset.themeDefault;
		html.dataset.mode = storedMode || defaultMode;
		html.dataset.theme = storedTheme || defaultTheme;
	});
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<header>
		<NavBar />
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
