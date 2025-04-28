import { readable } from 'svelte/store';
import { House, Gauge, Info } from 'lucide-svelte';

export const pages = readable([
	{ name: 'Home', path: '/', icon: House },
	{ name: 'Dashboard', path: '/dashboard', icon: Gauge },
	{ name: 'About', path: '/about', icon: Info }
]);
