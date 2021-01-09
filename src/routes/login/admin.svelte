<script lang="ts">
    import { onMount } from "svelte";
    import { TextField } from "svelte-materialify";
    import { goto } from "@sapper/app";

    let email, password;
    let handleLogin;
    let loginBtnDisabled = false;

    let errorMessage = "";
    onMount(async () => {
        const { auth } = await import("../../services/firebase");

        handleLogin = async () => {
            try {
                loginBtnDisabled = true;

                const user = await auth.signInWithEmailAndPassword(
                    email,
                    password
                );
                // login successful
                goto("/");
            } catch (err) {
                console.error(err);
                errorMessage = err.message;
            } finally {
                loginBtnDisabled = false;
            }
        };
    });
</script>

<h1 class="text-xl font-bold">Connexion Enseignant/Bibliothécaire</h1>

<div class="ml-5 mr-5">
    <TextField dense outlined type="email" bind:value={email}>Email</TextField>
    <TextField dense outlined type="password" bind:value={password}>
        Mot de passe
    </TextField>
    <button
        disabled={loginBtnDisabled}
        class="btn w-full"
        on:click={handleLogin}
    >
        Connexion
    </button>

    {#if errorMessage}
        <div class="red white-text rounded ma-3 pa-2">{errorMessage}</div>
    {/if}
</div>
