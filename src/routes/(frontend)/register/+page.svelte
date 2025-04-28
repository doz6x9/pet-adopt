<script lang="ts">
	import { currentUser } from '$lib/stores'; // correct store import
	import { goto } from '$app/navigation';

	let name = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	async function handleRegister() {
		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, password })
			});

			if (res.ok) {
				const user = await res.json();
				currentUser.set(user);
				goto('/dashboard');
			} else {
				error = 'Registration failed. Try a different username.';
			}
		} catch (err) {
			error = 'Something went wrong during registration.';
		}
	}
</script>

<h1>Register</h1>

{#if error}
	<p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleRegister}>
	<input type="text" bind:value={name} placeholder="Name" required />
	<input type="password" bind:value={password} placeholder="Password" required />
	<input type="password" bind:value={confirmPassword} placeholder="Confirm Password" required />
	<button type="submit">Register</button>
</form>
