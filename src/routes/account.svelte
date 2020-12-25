<script lang="ts">
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";
    import { Button, TextField } from "svelte-materialify";

    let user: firebase.default.User | undefined;
    let oldPassword, newPassword, newPasswordVerify;
    let handlePasswordChange;
    let errorMessage, successMessage;
    let updatePasswordBtnDisabled = false;

    onMount(async () => {
        const { auth } = await import("../services/firebase");
        const firebase = (await import("firebase/app")).default;

        handlePasswordChange = async () => {
            try {
                updatePasswordBtnDisabled = true;

                // validate form
                if (newPassword !== newPasswordVerify)
                    throw { message: "The passwords do not match." };
                if (newPassword === oldPassword)
                    throw { message: "You must enter a new password." };

                const credential = firebase.auth.EmailAuthProvider.credential(
                    auth.currentUser.email,
                    oldPassword
                );
                await auth.currentUser.reauthenticateWithCredential(credential);
                await auth.currentUser.updatePassword(newPassword);

                errorMessage = "";
                successMessage = "Successfully updated password.";

                // reset form
                oldPassword = "";
                newPassword = "";
                newPasswordVerify = "";
            } catch (err) {
                console.error(err);

                errorMessage = err.message;
                successMessage = "";
            } finally {
                updatePasswordBtnDisabled = false;
            }
        };

        auth.onAuthStateChanged((_user) => {
            if (_user) {
                user = _user;
            } else goto("/login/admin"); // not logged in, go to login page
        });
    });
</script>

<h3>Mon Compte</h3>
{#if user !== undefined}
    <strong>Nom/Prénom: </strong><i>{user.displayName}</i>
    <br />

    <strong>Email: </strong><i>{user.email}</i>
    (Verifié:
    {user.emailVerified})
    <br />
    Changer le mot de passe:
    <TextField type="password" bind:value={oldPassword}>
        Mot de passe existant
    </TextField>
    <TextField type="password" bind:value={newPassword}>
        Novueau mot de passe
    </TextField>
    <TextField type="password" bind:value={newPasswordVerify}>
        Confirmer le nouveau mot de passe
    </TextField>
    <Button
        depressed
        disabled={updatePasswordBtnDisabled}
        on:click={handlePasswordChange}
    >
        Changer
    </Button>

    {#if errorMessage}
        <div class="red white-text rounded ma-3 pa-2">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="green white-text rounded ma-3 pa-2">{successMessage}</div>
    {/if}
{/if}
