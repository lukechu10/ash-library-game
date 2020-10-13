<script lang="ts">
    import { onMount } from "svelte";
    import type GameWrapper from "../components/GameWrapper.svelte";

    let GameWrapper: GameWrapper;

    onMount(async () => {
        const module = await import("../components/GameWrapper.svelte");
        GameWrapper = module.default;
    });
</script>

<svelte:head>
    <title>Ashbury Library Game</title>
</svelte:head>

<p>Game</p>
<svelte:component this={GameWrapper} />
