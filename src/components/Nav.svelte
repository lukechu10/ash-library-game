<script>
    import { onMount } from "svelte";
    import { Button } from "svelte-materialify";
    import { goto } from "@sapper/app";

    let email = "";
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
                signedIn = true;
            } else {
                email = "";
                signedIn = false;
            }
        });
    });
</script>

Library Game
<i>{email}</i>

{#if signedIn}
    <Button class="red white-text" on:click={handleSignout}>Déconnecter</Button>
{:else}
    <Button class="red white-text" on:click={() => goto('/login/admin')}>
        Connexion
    </Button>
{/if}
