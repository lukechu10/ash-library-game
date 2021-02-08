<script lang="ts">
    import { fade } from "svelte/transition";
    import type { ClassSchema } from "../services/firebase";
    import ClassDetailOverlay from "./ClassDetailOverlay.svelte";

    export let classData: ClassSchema;
    let active = false;
</script>

<div
    class="inline-block flex-grow p-2 m-2 w-72 bg-gray-100 rounded-md transition-colors cursor-pointer hover:bg-gray-200"
    transition:fade|local={{ duration: 200 }}
    on:click={() => (active = true)}
>
    <h2 class="text-lg font-semibold">{classData.name}</h2>
    <p class="font-mono text-sm">{classData.classId}</p>
    <p>
        <span class="font-semibold">{classData.students.length}</span>
        {classData.students.length === 1 ? "élève" : "élèves"}
    </p>
</div>

<ClassDetailOverlay {classData} bind:active />
