<script lang="ts">
    import { fade } from "svelte/transition";

    export let active = false;
</script>

{#if active}
    <div
        class="fixed z-50 left-0 top-0 w-full h-full bg-black bg-opacity-50"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="flex flex-col items-center justify-center w-full h-full"
        >
            <slot />
        </div>
    </div>
{/if}
