import { readable, type Readable } from 'svelte/store';
import { House, Gauge, Info, User, PanelsTopLeft, Dumbbell } from 'lucide-svelte';
import type { Icon as IconType } from 'lucide-svelte';

export const pages: Readable<Page[]> = readable([
	{ name: 'Home', path: '/', icon: House },
	{ name: 'Dashboard', path: '/dashboard', icon: Gauge },
	{ name: 'About', path: '/about', icon: Info }
]);

export const dashboardPages: Readable<Page[]> = readable([
	{ name: 'Overview', path: '/dashboard', icon: PanelsTopLeft },
	{ name: 'User', path: '/dashboard/user', icon: User },
	{ name: 'Session', path: '/dashboard/session', icon: Dumbbell }
]);

export interface Page {
	name: string;
	path: string;
	icon: typeof IconType;
}
