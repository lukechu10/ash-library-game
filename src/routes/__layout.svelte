<script lang="ts">
    import GoogleAnalytics from "$lib/GoogleAnalytics.svelte";
    import Nav from "$lib/Nav.svelte";
    import "../app.postcss";
    import { initialize } from "./_firebase";

    initialize();
</script>

<Nav />
<main class="container relative p-0 mx-auto mt-12 bg-white">
    <slot />
</main>

<GoogleAnalytics />

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>
