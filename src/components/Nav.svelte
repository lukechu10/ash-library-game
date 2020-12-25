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

<style>
    nav {
        height: 42px;
    }

    nav > b,
    i {
        line-height: 40px;
    }
</style>

<nav>
    <a href="/"><b>Library Game</b></a>

    {#if signedIn !== undefined}
        <i>{email} - {name}</i>

        {#if signedIn === true}
            <a href="/account">Mon compte</a>
            <Button depressed class="red white-text" on:click={handleSignout}>
                Déconnecter
            </Button>
        {:else}
            <Button
                depressed
                class="red white-text"
                on:click={() => goto('/login/admin')}
            >
                Connexion
            </Button>
        {/if}
    {/if}
</nav>
