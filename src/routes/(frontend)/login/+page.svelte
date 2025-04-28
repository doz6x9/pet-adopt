<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { goto } from '$app/navigation';

	let name = '';
	let password = '';
	let error = '';

	async function handleLogin() {
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, password })
			});

			if (res.ok) {
				const user = await res.json();
				currentUser.set(user);
				goto('/dashboard');
			} else {
				error = 'Invalid credentials!';
			}
		} catch (err) {
			error = 'Something went wrong.';
		}
	}
</script>

<h1>Login</h1>

{#if error}
	<p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleLogin}>
	<input type="text" bind:value={name} placeholder="Name" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<button type="submit">Login</button>
</form>
