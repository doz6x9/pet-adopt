<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';
  
	// reactive subscription
	$: user = $currentUser;
  
	async function buy(item: 'food' | 'toy' | 'treat') {
	  if (!user) {
		goto('/login');
		return;
	  }
  
	  const res = await fetch('/api/shop', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userId: user.id, item })
	  });
  
	  if (res.ok) {
		const updatedUser = await res.json();
		currentUser.set(updatedUser);
	  } else {
		const msg = await res.text();
		alert(msg);
	  }
	}
  </script>
  
  <h1>🐶 Pet Shop</h1>
  
  {#if user}
	<p><strong>Budget:</strong> ${user.budget}</p>
	<p><strong>Inventory:</strong>
	  Food: {user.inventory.food},
	  Toy: {user.inventory.toy},
	  Treat: {user.inventory.treat}
	</p>
  
	<div style="margin-top:1rem;">
	  <button on:click={() => buy('food')}>Buy Food ($5)</button>
	  <button on:click={() => buy('toy')}>Buy Toy ($10)</button>
	  <button on:click={() => buy('treat')}>Buy Treat ($3)</button>
	</div>
  {:else}
	<p>Please <a href="/login">login</a> to shop.</p>
  {/if}
  
  <style>
	button {
	  margin-right: 0.5rem;
	  padding: 0.5rem 1rem;
	  border-radius: 4px;
	  border: 1px solid #888;
	  background: #eee;
	  cursor: pointer;
	}
	button:hover {
	  background: #ddd;
	}
  </style>
  