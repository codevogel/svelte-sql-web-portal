import { readable, type Readable } from 'svelte/store';

export const themes: Readable<Theme[]> = readable([
	{ label: '🐱 Catppuccin', value: 'catppuccin' },
	{ label: '🐺 Cerberus', value: 'cerberus' },
	{ label: '📺 Vintage', value: 'vintage' },
	{ label: '💮 Modern', value: 'modern' }
]);

export interface Theme {
	label: string;
	value: string;
}
