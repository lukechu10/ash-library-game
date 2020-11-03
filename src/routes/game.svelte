<script lang="ts">
    import { onMount } from "svelte";
    import type SortGameView from "../components/SortGameView.svelte";

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
