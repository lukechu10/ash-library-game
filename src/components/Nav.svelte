<script lang="ts">
    import { onMount } from "svelte";
    import { Button } from "svelte-materialify";
    import { goto } from "@sapper/app";

    let email = "",
        name = "";
    let signedIn: boolean | undefined; // signedIn should be undefined until auth has loaded

    let handleSignout;
    onMount(async () => {
        const { auth } = await import("../services/firebase");

        handleSignout = async () => {
            await auth.signOut();
        };

        auth.onAuthStateChanged((user) => {
            if (user) {
                email = user.email;
                name = user.displayName;
                signedIn = true;
            } else {
                email = "";
                name = "";
                signedIn = false;
            }
        });
    });
</script>

<nav class="bg-white px-8 pt-2 shadow-md fixed w-full z-50 top-0">
    <div>
        <a href="/" class="border-gray-400 hover:border-red-500 border-b-2"><b
            >Library Game</b></a>

        {#if signedIn !== undefined}
            {#if signedIn === true}
                <i>{email} - {name}</i>
                <a href="/account">Mon compte</a>
                <button class="red white-text" on:click={handleSignout}>
                    Déconnecter
                </button>
            {:else}
                <button
                    class="red white-text"
                    on:click={() => goto('/login/admin')}
                >
                    Connexion
                </button>
            {/if}
        {/if}
    </div>
</nav>
