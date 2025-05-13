<script lang="ts">
	import { onMount } from 'svelte';

	import { Sun } from 'lucide-svelte';
	import { modes } from '$lib/stores/theme';

	function toggleDarkMode() {
		let mode = localStorage.getItem('theme.mode');
		if (!mode) {
			// Set mode to default mode
			const html = document.querySelector('html');
			const defaultMode = html!.dataset.modeDefault;
			if (!defaultMode) {
				throw new Error('No default mode found');
			}
			localStorage.setItem('theme.mode', defaultMode);
			mode = defaultMode;
		}
		const newMode = mode === modes.dark ? modes.light : modes.dark;
		changeMode(newMode);
	}

	function changeMode(mode: string) {
		const html = document.querySelector('html');
		if (!html) {
			return;
		}
		html.dataset.mode = mode;
		localStorage.setItem('theme.mode', mode);
	}
</script>

<button type="button" on:click={toggleDarkMode} class="btn hover:preset-tonal w-fit">
	<Sun size={24} />
</button>
