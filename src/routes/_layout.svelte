<script lang="ts">
    import { onMount } from "svelte";
    import type GoogleAnalytics from "../components/GoogleAnalytics.svelte";
    import { MaterialApp } from "svelte-materialify";
    import Nav from "../components/Nav.svelte";

    export let segment: string;
    segment; // noop

    let GoogleAnalytics: GoogleAnalytics;

    onMount(async () => {
        const firebase = await import("../services/firebase"); // initialize firebase
        firebase; // noop

        const module = await import("../components/GoogleAnalytics.svelte");
        GoogleAnalytics = module.default as any;
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

<MaterialApp>
    <Nav />
    <main>
        <slot />
    </main>
</MaterialApp>

<!-- only load GoogleAnalytics in client -->
<svelte:component this={GoogleAnalytics} />
