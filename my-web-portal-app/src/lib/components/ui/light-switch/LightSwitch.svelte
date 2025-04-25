<script lang="ts">
	import { Sun } from 'lucide-svelte';

	function changeDarkMode() {
		// Queries the html element and toggles the data-mode attribute
		const html = document.querySelector('html');
		if (html) {
			html.dataset.mode = html.dataset.mode === 'dark' ? 'light' : 'dark';
		}
	}
</script>

<button type="button" on:click={changeDarkMode} class="btn-icon preset-tonal-surface w-24">
	<Sun />
</button>
