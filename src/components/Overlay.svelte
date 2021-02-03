<script lang="ts">
    import { fade, scale } from "svelte/transition";

    export let active = false;
</script>

{#if active}
    <div
        class="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50"
        transition:fade|local={{ duration: 200 }}
    >
        <div
            class="flex flex-col justify-center items-center w-full h-full"
            transition:scale|local={{ duration: 200 }}
        >
            <slot />
        </div>
    </div>
{/if}
