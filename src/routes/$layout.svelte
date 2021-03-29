<script lang="ts">
    import type GoogleAnalytics from "../components/GoogleAnalytics.svelte";
    import Nav from "../components/Nav.svelte";
    import { onMount } from "svelte";
    import "../global.css";

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
<main class="container relative p-0 mx-auto mt-12 bg-white">
    <slot />
</main>

<!-- only load GoogleAnalytics in client -->
<svelte:component this={GoogleAnalytics} />

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>
