// src/lib/stores.ts
import { writable } from 'svelte/store';
import type { SafeUser } from './types';

function createUserStore() {
  // on init, try to read from localStorage
  let initial: SafeUser | null = null;
  if (typeof localStorage !== 'undefined') {
    const json = localStorage.getItem('currentUser');
    if (json) {
      initial = JSON.parse(json);
    }
  }

  const { subscribe, set } = writable<SafeUser | null>(initial);

  return {
    subscribe,
    set: (user: SafeUser | null) => {
      if (typeof localStorage !== 'undefined') {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          localStorage.removeItem('currentUser');
        }
      }
      set(user);
    }
  };
}

export const currentUser = createUserStore();
