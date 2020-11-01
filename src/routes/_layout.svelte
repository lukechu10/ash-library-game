<script context="module">
</script>

<script lang="ts">
    export let segment: string;
    segment; // noop

    import { onMount } from "svelte";

    onMount(async () => {
        await import("../services/firebase"); // initialize firebase
    });
</script>

<style>
    main {
        position: relative;
        /* max-width: 56em; */
        background-color: white;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
</style>

<main>
    <slot />
</main>
