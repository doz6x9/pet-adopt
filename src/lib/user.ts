import { writable } from 'svelte/store';
import type { SafeUser } from '$lib/types';

export const currentUser = writable<SafeUser | null>(null);
