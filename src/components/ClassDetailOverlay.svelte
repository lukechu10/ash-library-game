<script lang="ts">
    import type { ClassSchema } from "../services/firebase";
    import Overlay from "./Overlay.svelte";

    export let active: boolean;
    export let classData: ClassSchema;
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
            <input class="input rounded-r-none" />
            <button class="btn rounded-l-none bg-gray-400 hover:bg-gray-500"
                >Ajouter</button
            >
        </div>

        <button class="btn mt-2" on:click={() => (active = false)}
            >Fermer</button
        >
    </div>
</Overlay>
