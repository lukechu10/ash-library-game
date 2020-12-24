<script>
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";
    import { Button, TextField } from "svelte-materialify";

    let name, email, password, passwordVerify;
    let handleSignup;
    let signupBtnDisabled = false;

    let errorMessage = "";
    onMount(async () => {
        const { auth } = await import("../../services/firebase");

        handleSignup = async () => {
            try {
                signupBtnDisabled = true;

                // validate form
                if (name === "") throw { message: "Name cannot be empty." };

                if (password !== passwordVerify)
                    throw { message: "The passwords do not match." };

                const user = await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );
                await auth.currentUser.updateProfile({ displayName: name });
                // signup successful
                goto("/");
            } catch (err) {
                console.log(err);
                errorMessage = err.message;
            } finally {
                signupBtnDisabled = false;
            }
        };
    });
</script>

<h3>Inscription Enseignant/Bibliothécaire</h3>
<div class="ml-5 mr-5">
    <TextField dense outlined bind:value={name}>Nom/Prénom</TextField>
    <TextField dense outlined type="email" bind:value={email}>Email</TextField>
    <TextField dense outlined type="password" bind:value={password}>
        Mot de passe
    </TextField>
    <TextField dense outlined type="password" bind:value={passwordVerify}>
        Confirmer le mot de passe
    </TextField>
    <Button
        block
        depressed
        disabled={signupBtnDisabled}
        class="mt-5"
        on:click={handleSignup}
    >
        Inscription
    </Button>

    {#if errorMessage}
        <div class="red white-text rounded ma-3 pa-2">{errorMessage}</div>
    {/if}
</div>
