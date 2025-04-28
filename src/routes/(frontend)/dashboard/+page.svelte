<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet, SafeUser } from '$lib/types';
	import { goto } from '$app/navigation';
  
	let pets: Pet[] = [];
	let error = '';
	let success = '';
	let user: SafeUser | null = null;
	// subscribe store
	$: user = $currentUser;
  
	// fetch this user's adopted pets
	async function loadDashboard() {
	  error = '';
	  success = '';
	  if (!user) return;
	  const res = await fetch(`/api/pets?ownerId=${user.id}`);
	  if (res.ok) {
		pets = await res.json();
	  } else {
		error = 'Failed to load your pets.';
	  }
	}
  
	// on mount, ensure logged in then load
	onMount(() => {
	  if (!user) {
		alert('Please login first.');
		goto('/login');
		return;
	  }
	  loadDashboard();
	});
  
	// handle feed/toy/return actions
	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
	  if (!user) {
		alert('Please login first.');
		goto('/login');
		return;
	  }
  
	  const res = await fetch('/api/actions', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ petId, action, userId: user.id })
	  });
  
	  if (res.ok) {
		success = `${action[0].toUpperCase() + action.slice(1)} successful!`;
		error = '';
		await loadDashboard();
	  } else {
		const msg = await res.text();
		// redirect to shop if out of both items & budget
		if (msg.startsWith('Not enough')) {
		  goto('/shop');
		  return;
		}
		error = msg;
		success = '';
	  }
	}
  </script>
  
  <h1>🐶 Your Adopted Pets</h1>
  <p><strong>Budget:</strong> {user?.budget}</p>
  
  {#if success}
	<p style="color: green;">{success}</p>
  {/if}
  {#if error}
	<p style="color: red;">{error}</p>
  {/if}
  
  {#if pets.length === 0}
	<p>You haven’t adopted any pets yet.</p>
  {:else}
	<ul>
	  {#each pets as pet}
		<li style="margin-bottom: 1.5rem;">
		  <img
			src={pet.picture}
			alt={pet.name}
			width="120"
			style="border-radius: 8px; margin-bottom: 0.5rem;"
		  />
		  <br />
  
		  <strong>{pet.name}</strong>  
		  – Hunger: {pet.hunger}% | Happiness: {pet.happiness}%
  
		  <div class="actions" style="margin-top: 0.5rem;">
			<button
			  on:click={() => handleAction(pet.id, 'feed')}
			  disabled={pet.hunger === 0}
			>Feed 🥣</button>
  
			<button
			  on:click={() => handleAction(pet.id, 'toy')}
			  disabled={pet.happiness === 100}
			>Play 🧸</button>
  
			<button on:click={() => handleAction(pet.id, 'return')}>
			  Return 🏠
			</button>
		  </div>
		</li>
	  {/each}
	</ul>
  {/if}
  
  <style>
	.actions button {
	  margin-right: 0.5rem;
	  padding: 0.5rem 1rem;
	  border-radius: 8px;
	  border: 1px solid #ccc;
	  background-color: #f0f0f0;
	  cursor: pointer;
	  font-weight: bold;
	}
	.actions button:hover:enabled {
	  background-color: #e0e0ff;
	}
	.actions button:disabled {
	  background-color: #ddd;
	  cursor: not-allowed;
	}
	img {
	  display: block;
	}
  </style>
  