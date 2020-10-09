<script lang="ts">
    import { onMount } from "svelte";
    import type GameWrapper from "../components/GameWrapper.svelte";

    let GameWrapper: GameWrapper;

    onMount(async () => {
        const module = await import("../components/GameWrapper.svelte");
        GameWrapper = module.default;
    });
</script>

<p>Game</p>
<svelte:component this={GameWrapper} />
