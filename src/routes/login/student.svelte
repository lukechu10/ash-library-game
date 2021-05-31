<script context="module" lang="ts">
    export function load({ session }: LoadInput): LoadOutput {
        if (session.token !== undefined) return { status: 302, redirect: "/account" };
        else return { status: 200 };
    }
</script>

<script lang="ts">
    import type { ClassSchema } from "$lib/firebase";
    import { collection, doc, getDoc, getFirestore } from "@firebase/firestore";
    import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";

    const db = getFirestore();

    let classId = "";
    let classPassword = "";

    let errorMessage = "";
    let phase: "class" | "student" = "class";

    let classData: ClassSchema;

    const handleContinue = async () => {
        let data = await getDoc(doc(collection(db, "classes"), classId));
        if (data.exists() && data.data()!.classPassword === classPassword) {
            classData = data.data() as ClassSchema;
            errorMessage = "";
            phase = "student";
            classPassword = classId = "";
        } else {
            errorMessage = "Identifiant ou mot de passe incorrect.";
        }
    };
</script>

<h1 class="inline-block text-xl font-bold">Connexion Élève</h1>
<span class="text-gray-500"
    >Où
    <a href="/login/admin" class="text-blue-500">connexion enseignant/bibliothécaire</a>
</span>

<div>
    {#if phase === "class"}
        <div>
            <label
                >Identifiant de la classe
                <input class="input" placeholder="Identifiant de la classe" bind:value={classId} />
            </label>
        </div>
        <div>
            <label
                >Mot de passe de la classe
                <input
                    class="input"
                    placeholder="Mot de passe de la classe"
                    type="password"
                    bind:value={classPassword}
                />
            </label>
        </div>
        <button
            disabled={classId.trim() === "" || classPassword === ""}
            class="mt-2 w-full btn"
            on:click={handleContinue}
        >
            Continuer
        </button>
    {:else if phase === "student"}
        <button class="mt-2 btn" on:click={() => (phase = "class")}> Back</button>

        <h3 class="text-lg font-bold">Qui est-tu?</h3>

        <ul>
            {#each classData.students.sort() as student}
                <li
                    class="my-1 w-full h-10 font-semibold leading-10 text-center bg-gray-100 rounded transition-colors hover:bg-gray-200"
                >
                    {student}
                </li>
            {/each}
        </ul>
    {/if}

    {#if errorMessage}
        <div class="py-2 px-3 mt-2 text-white bg-red-500 rounded">
            {errorMessage}
        </div>
    {/if}
</div>
