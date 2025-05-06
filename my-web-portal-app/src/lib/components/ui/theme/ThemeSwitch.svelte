<script lang="ts">
	import { Popover, Switch } from '@skeletonlabs/skeleton-svelte';
	import { X, Palette } from 'lucide-svelte';

	let openState = $state(false);

	function popoverClose() {
		openState = false;
	}

	import { themes } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let selectedTheme: string | undefined = $state();
	let darkMode: boolean | undefined = $state();

	onMount(() => {
		const storedTheme =
			localStorage.getItem('theme.name') || document.documentElement.dataset.themeDefault;
		const storedMode =
			(localStorage.getItem('theme.mode') || document.documentElement.dataset.modeDefault) ===
			'dark';
		darkMode = storedMode;
		selectedTheme = storedTheme;
	});

	function handleThemeSelect(event: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		selectedTheme = event.currentTarget.value;
		localStorage.setItem('theme.name', selectedTheme);
		document.documentElement.dataset.theme = selectedTheme;
		selectedTheme = selectedTheme;
	}

	function handleDarkModeSelect(details: { checked: boolean }): void {
		darkMode = details.checked;
		const mode = darkMode ? 'dark' : 'light';
		localStorage.setItem('theme.mode', mode);
		document.documentElement.dataset.mode = mode;
	}
</script>

<Popover
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	positioning={{ placement: 'top' }}
	triggerBase="btn hover:preset-tonal"
	contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
	arrow
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
>
	{#snippet trigger()}<Palette />{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<p class="text-xl font-bold">Choose Theme</p>
			<button class="btn-icon hover:preset-tonal" onclick={popoverClose}><X /></button>
		</header>
		<article>
			<form>
				<label class="label">
					<span class="label-text">Select</span>
					<select class="select" bind:value={selectedTheme} onchange={handleThemeSelect}>
						{#each $themes as theme (theme.value)}
							<option value={theme.value}>{theme.label}</option>
						{/each}
					</select>
				</label>
			</form>
		</article>
		<span class="flex">
			<span class="label">Dark Mode</span>
			<Switch name="darkMode" checked={darkMode} onCheckedChange={handleDarkModeSelect} />
		</span>
	{/snippet}
</Popover>
