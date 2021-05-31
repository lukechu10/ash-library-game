<script lang="ts">
    import type { ClassSchema } from "$lib/firebase";
    import Overlay from "$lib/Overlay.svelte";
    import { arrayUnion, collection, doc, getFirestore, updateDoc } from "@firebase/firestore";

    const db = getFirestore();

    export let active: boolean;
    export let classData: ClassSchema;

    let newStudentName: string;

    const handleAddStudent = async () => {
        let name = newStudentName;
        newStudentName = "";
        updateDoc(doc(collection(db, "classes"), classData.classId), {
            students: arrayUnion(name)
        });
    };
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
            <input class="rounded-r-none input" bind:value={newStudentName} />
            <button
                class="rounded-l-none btn"
                on:click={handleAddStudent}
                disabled={!newStudentName}>Ajouter</button
            >
        </div>

        <button class="mt-2 btn" on:click={() => (active = false)}>Fermer</button>
    </div>
</Overlay>
