<script lang="ts">
    import { onMount } from "svelte";
    import { Button, TextField } from "svelte-materialify";
    import { goto } from "@sapper/app";

    let email, password;
    let handleLogin;
    let loginBtnDisabled = false;
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
            } finally {
                loginBtnDisabled = false;
            }
        };
    });
</script>

<h3>Connexion Enseignant/Bibliothécaire</h3>

<div class="ml-5 mr-5">
    <TextField dense outlined type="email" bind:value={email}>Email</TextField>
    <TextField dense outlined type="password" bind:value={password}>
        Mot de passe
    </TextField>
    <Button
        block
        depressed
        disabled={loginBtnDisabled}
        class="mt-5"
        on:click={handleLogin}
    >
        Connexion
    </Button>
</div>
