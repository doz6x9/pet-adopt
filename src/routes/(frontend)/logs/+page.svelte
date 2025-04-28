<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';
  
	let logs: { message: string; timestamp: string }[] = [];
	let error = '';
  
	$: user = $currentUser;
  
	onMount(async () => {
	  if (!user) {
		goto('/login');
	  } else {
		await loadLogs();
	  }
	});
  
	async function loadLogs() {
	  const res = await fetch('/api/log');
	  if (res.ok) {
		logs = await res.json();
		error = '';
	  } else {
		error = 'Failed to load logs.';
	  }
	}
  </script>
  
  <h1>📜 Action Logs</h1>
  
  <!-- ← Insert the refresh button here: -->
  <button on:click={loadLogs}>🔄 Refresh</button>
  
  {#if error}
	<p style="color: red;">{error}</p>
  {/if}
  
  {#if logs.length === 0}
	<p>No actions logged yet.</p>
  {:else}
	<ul>
	  {#each logs as log}
		<li>
		  <strong>{new Date(log.timestamp).toLocaleString()}</strong>: {log.message}
		</li>
	  {/each}
	</ul>
  {/if}
  