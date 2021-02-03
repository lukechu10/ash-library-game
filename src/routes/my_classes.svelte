<script lang="ts">
    import { onMount } from "svelte";
    import Overlay from "../components/Overlay.svelte";
    import type { ClassSchema } from "../services/firebase";

    let newClassOverlayActive = false;
    let classes: { data: () => ClassSchema }[] = undefined;

    onMount(async () => {
        const { auth, createClass, getUserClasses } = await import(
            "../services/firebase"
        );

        auth.onAuthStateChanged(async (user) => {
            if (user) {
                classes = await getUserClasses(user.uid);
            } else {
                classes = [];
            }
        });
    });
</script>

<h1 class="text-xl font-bold">Mes classes</h1>

<button class="btn" on:click={() => (newClassOverlayActive = true)}
    >Créer une nouvelle classe</button
>

<div class="flex flex-row class-grid">
    {#if classes === undefined}
        <p>Loading...</p>
    {:else}
        {#each classes as _class}
            <div>{_class.data().name}</div>
        {/each}
    {/if}
</div>

<!-- New class overlay -->
<Overlay active={newClassOverlayActive}>
    <div class="max-w-lg card">
        <h3 class="self-center text-lg font-bold">Créer une nouvelle classe</h3>

        <div class="flex flex-row space-x-2">
            <button
                class="flex-grow btn"
                on:click={() => (newClassOverlayActive = false)}>Créer</button
            ><!-- TODO -->
            <button
                class="flex-grow bg-red-500 btn hover:bg-red-700"
                on:click={() => (newClassOverlayActive = false)}>Annuler</button
            >
        </div>
    </div>
</Overlay>
