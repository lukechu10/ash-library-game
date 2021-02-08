<script lang="ts">
    import type { ClassSchema } from "../services/firebase";
    import Overlay from "./Overlay.svelte";

    export let active: boolean;
    export let classData: ClassSchema;
</script>

<Overlay bind:active>
    <div class="max-w-xl card">
        <h3 class="self-center text-lg font-bold">{classData.name}</h3>
        <p class="font-mono">{classData.classId}</p>

        <button class="btn" on:click={() => (active = false)}>Fermer</button>
    </div>
</Overlay>
