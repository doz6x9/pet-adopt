<script lang="ts">
	import { currentUser } from '$lib/stores';
	import type { SafeUser } from '$lib/types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  
	let name = '';
	let picture = '';
	let type = 'puppy';
  
	// explicitly type user so TS knows what fields it has
	let user: SafeUser | null = null;
	$: user = $currentUser;
  
	onMount(() => {
	  // give the store a moment to initialize
	  setTimeout(() => {
		if (!user) {
		  goto('/login');
		} else if (user.name !== 'admin') {
		  goto('/');
		}
	  }, 100);
	});
  
	async function addPet() {
	  if (!name || !picture || !type) {
		alert('Fill all fields!');
		return;
	  }
  
	  const res = await fetch('/api/pets', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, picture, type })
	  });
  
	  if (res.ok) {
		alert('Pet added!');
		name = '';
		picture = '';
		type = 'puppy';
	  } else {
		alert('Failed to add pet.');
	  }
	}
  </script>
  
  <h1>Admin Panel - Add a New Pet</h1>
  
  {#if user && user.name === 'admin'}
	<form on:submit|preventDefault={addPet}>
	  <input type="text" bind:value={name} placeholder="Pet Name" required />
	  <input type="text" bind:value={picture} placeholder="Picture URL" required />
	  <select bind:value={type} required>
		<option value="puppy">Puppy</option>
		<option value="kitten">Kitten</option>
	  </select>
	  <button type="submit">Add Pet</button>
	</form>
  {:else}
	<p>Loading…</p>
  {/if}
  
  <style>
	form {
	  display: flex;
	  flex-direction: column;
	  gap: 1rem;
	  width: 250px;
	  margin-top: 1rem;
	}
  </style>
  