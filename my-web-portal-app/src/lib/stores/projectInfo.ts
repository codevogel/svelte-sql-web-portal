import { readable, type Readable } from 'svelte/store';

export const gameName: Readable<string> = readable('DemoBots');
export const adminEmail: Readable<string> = readable('admin@demobots.com');
