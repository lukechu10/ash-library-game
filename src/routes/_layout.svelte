<script context="module">
</script>

<script lang="ts">
    import { onMount } from "svelte";

    export let segment: string;
    segment; // noop

    onMount(async () => {
        const { db, perf } = await import("../services/firebase"); // initialize firebase
        console.log(db, perf);
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
