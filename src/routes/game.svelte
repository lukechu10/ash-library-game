<script lang="ts">
    import type SortGameView from "../components/SortGameView.svelte";
    import { onMount } from "svelte";

    let SortGameView: SortGameView;

    onMount(async () => {
        const module = await import("../components/SortGameView.svelte");
        SortGameView = module.default as any;
    });
</script>

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>

<svelte:component this={SortGameView} />
