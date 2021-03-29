<script lang="ts">
    import type LeaderboardsView from "../components/LeaderboardsView.svelte";
    import { onMount } from "svelte";

    let LeaderboardsView: LeaderboardsView;

    onMount(async () => {
        const module = await import("../components/LeaderboardsView.svelte");
        LeaderboardsView = module.default as any;
    });
</script>

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>

<svelte:component this={LeaderboardsView} />
