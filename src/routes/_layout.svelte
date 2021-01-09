<script lang="ts">
    import { onMount } from "svelte";
    import type GoogleAnalytics from "../components/GoogleAnalytics.svelte";
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
        box-sizing: border-box;
    }
</style>

<Nav />
<main class="mt-12 bg-white p-0 relative container mx-auto">
    <slot />
</main>

<!-- only load GoogleAnalytics in client -->
<svelte:component this={GoogleAnalytics} />

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>
