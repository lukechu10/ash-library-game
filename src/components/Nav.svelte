<script lang="ts">
    import { onMount } from "svelte";
    import { Button } from "svelte-materialify";
    import { goto } from "@sapper/app";

    let email = "",
        name = "";
    let signedIn = false;

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

<b>Library Game</b>
<i>{email} - {name}</i>

{#if signedIn}
    <Button class="red white-text" on:click={handleSignout}>Déconnecter</Button>
{:else}
    <Button class="red white-text" on:click={() => goto('/login/admin')}>
        Connexion
    </Button>
{/if}
