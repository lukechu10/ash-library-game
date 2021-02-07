<script lang="ts">
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Overlay from "../components/Overlay.svelte";
    import type { ClassSchema } from "../services/firebase";

    let newClassOverlayActive = false;
    let newClassErrorMessage = "";
    let classes: { data: () => ClassSchema }[] = undefined;

    let newClass = {
        name: "",
        classId: "",
    };

    let refreshClasses: () => Promise<void>;
    let handleCreateClass: () => Promise<void>;
    const handleCancelClass = () => {
        newClass = {
            name: "",
            classId: "",
        };
        newClassErrorMessage = "";
        newClassOverlayActive = false;
    };

    onMount(async () => {
        const { auth, createClass, getUserClasses } = await import(
            "../services/firebase"
        );

        auth.onAuthStateChanged(async (user) => {
            if (user) {
                classes = await getUserClasses(user.uid);
            } else {
                goto("/login/admin"); // not logged in, go to login page
            }
        });

        refreshClasses = async () => {
            classes = await getUserClasses(auth.currentUser.uid);
        };

        handleCreateClass = async () => {
            if (
                await createClass({
                    ...newClass,
                    students: [],
                    owner: auth.currentUser.uid,
                })
            ) {
                newClass = {
                    name: "",
                    classId: "",
                };
                newClassErrorMessage = "";
                newClassOverlayActive = false;
                refreshClasses();
            } else {
                // class with id already exists
                newClassErrorMessage = "une classe avec cet identifiant éxiste déjà";
                return;
            }
        };
    });
</script>

<h1 class="text-xl font-bold">Mes classes</h1>

<button class="btn" on:click={() => (newClassOverlayActive = true)}
    >Créer une nouvelle classe</button
>

<div class="flex flex-row flex-wrap -m-2 mt-2 class-grid">
    {#if classes === undefined}
        <p class="ml-2">Loading...</p>
    {:else}
        {#each classes as _class}
            <div
                class="inline-block flex-grow p-2 m-2 w-72 bg-gray-100 rounded-md transition-colors cursor-pointer hover:bg-gray-200"
                transition:fade|local={{ duration: 200 }}
            >
                <h2 class="text-lg font-semibold">{_class.data().name}</h2>
                <p class="font-mono text-sm">{_class.data().classId}</p>
                <p>
                    <span class="font-semibold"
                        >{_class.data().students.length}</span
                    >
                    {_class.data().students.length === 1 ? "élève" : "élèves"}
                </p>
            </div>
        {/each}
    {/if}
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
        </div>

        <div class="flex flex-row mt-2 space-x-2">
            <button
                class="flex-grow btn"
                disabled={newClass.name === "" || newClass.classId === ""}
                on:click={handleCreateClass}>Créer</button
            >
            <button
                class="flex-grow bg-red-500 btn hover:bg-red-700"
                on:click={handleCancelClass}>Annuler</button
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
