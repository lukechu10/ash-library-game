<script context="module" lang="ts">
    export function load(input: LoadInput): LoadOutput {
        return protectedPage(input);
    }
</script>

<script lang="ts">
    import ClassListItem from "$lib/ClassListItem.svelte";
    import type { ClassSchema } from "$lib/firebase";
    import Overlay from "$lib/Overlay.svelte";
    import { protectedPage } from "$lib/protectedPage";
    import { authState } from "$lib/store/authState";
    import {
        addDoc,
        collection,
        doc,
        getDoc,
        getFirestore,
        onSnapshot,
        query,
        where
    } from "@firebase/firestore";
    import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";
    import { onDestroy } from "svelte";
    import { writable } from "svelte/store";

    const db = getFirestore();

    let newClassOverlayActive = false;
    let newClassErrorMessage = "";
    let newClass = {
        name: "",
        classId: "",
        classPassword: ""
    };
    let classPasswordConfirm = "";

    const classes = writable<ClassSchema[]>([]);
    let unsubscribeOnSnapshot: (() => void) | null = null;
    $: if ($authState !== null) {
        const q = query(collection(db, "classes"), where("owner", "==", $authState.uid));
        if (unsubscribeOnSnapshot !== null) unsubscribeOnSnapshot();
        unsubscribeOnSnapshot = onSnapshot(q, (snapshot) => {
            const newClasses: ClassSchema[] = [];
            snapshot.forEach((c) => newClasses.push(c.data() as ClassSchema));
            classes.set(newClasses);
        });
    }
    onDestroy(() => {
        if (unsubscribeOnSnapshot !== null) unsubscribeOnSnapshot();
    });

    const handleCancelClass = () => {
        newClass = {
            name: "",
            classId: "",
            classPassword: ""
        };
        classPasswordConfirm = "";
        newClassErrorMessage = "";
        newClassOverlayActive = false;
    };

    const handleNewClass = async () => {
        if (newClass.classPassword !== classPasswordConfirm) {
            newClassErrorMessage = "les mots de passes ne sont pas identiques";
        } else {
            if ((await getDoc(doc(collection(db, "classes"), newClass.classId))).exists()) {
                // class with id already exists
                newClassErrorMessage = "une classe avec cet identifiant éxiste déjà";
            } else {
                await addDoc(collection(db, "classes"), {
                    ...newClass,
                    students: [],
                    owner: $authState?.uid
                });
                newClass = {
                    name: "",
                    classId: "",
                    classPassword: ""
                };
                classPasswordConfirm = "";
                newClassErrorMessage = "";
                newClassOverlayActive = false;
            }
        }
    };
</script>

<h1 class="text-xl font-bold">Mes classes</h1>

<button class="btn" on:click={() => (newClassOverlayActive = true)}
    >Créer une nouvelle classe</button
>

<div class="flex flex-row flex-wrap -m-2 mt-2 class-grid">
    {#each $classes as _class (_class.classId)}
        <ClassListItem classData={_class} />
    {/each}
</div>

<!-- New class overlay -->
<Overlay active={newClassOverlayActive}>
    <div class="max-w-lg card">
        <h3 class="self-center text-lg font-bold">Créer une nouvelle classe</h3>

        <div class="flex flex-col">
            <label class="flex-grow">
                Nom de la classe
                <input
                    type="text"
                    class="input"
                    placeholder="Nom de la classe"
                    autocomplete="off"
                    bind:value={newClass.name}
                />
            </label>
            <label class="flex-grow">
                Identifiant de la classe
                <input
                    type="text"
                    class="input"
                    placeholder="Identifiant de la classe"
                    bind:value={newClass.classId}
                />
            </label>
            <label class="flex-grow">
                Mot de passe de la classe
                <input
                    type="password"
                    class="input"
                    placeholder="Identifiant de la classe"
                    bind:value={newClass.classPassword}
                />
            </label>
            <label class="flex-grow">
                Confirmer le mot de passe de la classe
                <input
                    type="password"
                    class="input"
                    placeholder="Identifiant de la classe"
                    bind:value={classPasswordConfirm}
                />
            </label>
        </div>

        <div class="flex flex-row mt-2 space-x-2">
            <button
                class="flex-grow btn"
                disabled={newClass.name === "" ||
                    newClass.classId === "" ||
                    newClass.classPassword === "" ||
                    classPasswordConfirm === ""}
                on:click={handleNewClass}>Créer</button
            >
            <button class="flex-grow bg-red-500 btn hover:bg-red-700" on:click={handleCancelClass}
                >Annuler</button
            >
        </div>

        {#if newClassErrorMessage !== ""}
            <div class="text-white bg-red-500 footer">
                <p>
                    <span class="font-bold">Erreur: </span>{newClassErrorMessage}
                </p>
            </div>
        {/if}
    </div>
</Overlay>
