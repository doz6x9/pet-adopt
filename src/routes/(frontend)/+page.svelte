<script lang="ts">
    import { onMount } from 'svelte';
    import { currentUser } from '$lib/stores';
    import type { Pet } from '$lib/types';
    import { goto } from '$app/navigation';

    let pets: Pet[] = [];
    let error = '';
    let success = '';
    let filterType: string = '';

    $: user = $currentUser;

    onMount(async () => {
        await loadPets();
    });

    async function loadPets() {
        let url = '/api/pets';
        if (filterType) {
            url += `?type=${encodeURIComponent(filterType)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
            pets = await res.json();
        } else {
            error = 'Failed to load pets.';
        }
    }

    async function adoptPet(petId: number) {
        if (!user) {
            alert('Please login first.');
            goto('/login');
            return;
        }

        const res = await fetch('/api/adopt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petId, userId: user.id })
        });

        if (res.ok) {
            success = 'Pet adopted successfully!';
            error = '';
            await loadPets();
        } else {
            error = 'Failed to adopt pet.';
            success = '';
        }
    }
</script>

<h1>🐾 Browse Adoptable Pets</h1>

<label for="filter">Filter by type:</label>
<select id="filter"
        bind:value={filterType}
        on:change={loadPets}>
    <option value="">All</option>
    <option value="puppy">Puppies</option>
    <option value="kitten">Kittens</option>
</select>

{#if success}
    <p style="color: green;">{success}</p>
{/if}
{#if error}
    <p style="color: red;">{error}</p>
{/if}

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <ul>
        {#each pets as pet}
            <li style="margin-bottom: 1rem;">
                <img
  src={pet.picture}
  alt={pet.name}
  width="150"
  style="border-radius: 8px; margin-bottom: 0.5rem;"
/>

                <br />
                <strong>{pet.name}</strong> ({pet.type})
                {#if !pet.adopted}
                    <br />
                    <button on:click={() => adoptPet(pet.id)}>Adopt</button>
                {:else}
                    <br />
                    <span>Already Adopted</span>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<style>
    button {
        padding: 0.5rem 1rem;
        margin-top: 0.5rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        background-color: #f0f0f0;
        cursor: pointer;
        font-weight: bold;
    }
    button:hover {
        background-color: #e0e0ff;
    }
    img {
        margin-bottom: 0.5rem;
    }
</style>