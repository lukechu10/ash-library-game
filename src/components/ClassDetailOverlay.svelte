<script lang="ts">
    import { onMount } from "svelte";

    import type { ClassSchema } from "../services/firebase";
    import Overlay from "./Overlay.svelte";

    export let active: boolean;
    export let classData: ClassSchema;

    let newStudentName: string;

    let handleAddStudent: () => Promise<void>;

    onMount(async () => {
        const { addStudentToClass } = await import("../services/firebase");

        handleAddStudent = async () => {
            await addStudentToClass(classData.classId, newStudentName);
            newStudentName = "";
        };
    });
</script>

<Overlay bind:active>
    <div class="max-w-xl card">
        <h3 class="self-center text-2xl font-bold">{classData.name}</h3>
        <p class="self-center font-mono">{classData.classId}</p>

        <!-- Student list -->
        <h4 class="self-center text-lg font-bold">Élèves</h4>
        <ul>
            {#each classData.students as student}
                <li>{student}</li>
            {/each}
        </ul>

        <div class="flex flex-row">
            <input class="input rounded-r-none" bind:value={newStudentName} />
            <button
                class="btn rounded-l-none"
                on:click={handleAddStudent}
                disabled={!newStudentName}>Ajouter</button
            >
        </div>

        <button class="btn mt-2" on:click={() => (active = false)}
            >Fermer</button
        >
    </div>
</Overlay>
