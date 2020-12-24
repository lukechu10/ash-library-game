<script>
    import { onMount } from "svelte";

    import { TextField, Button } from "svelte-materialify";

    let name, email, password;
    let handleSignup;
    let signupBtnDisabled = false;

    onMount(async () => {
        const { auth } = await import("../../services/firebase");

        handleSignup = async () => {
            try {
                signupBtnDisabled = true;

                const user = await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );
                await auth.currentUser.updateProfile({ displayName: name });
                console.log(user);
            } catch (err) {
                console.log(err);
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
    <TextField dense outlined type="password">
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
</div>
