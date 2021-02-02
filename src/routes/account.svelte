<script lang="ts">
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";

    let user: firebase.default.User | undefined;
    let oldPassword: string, newPassword: string, newPasswordVerify: string;
    let deletePassword: string;
    let handlePasswordChange: () => Promise<void>,
        handleDeleteAccount: () => Promise<void>,
        handleResendVerificationEmail: () => Promise<void>;
    let errorMessage: string, successMessage: string;
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

        handleDeleteAccount = async () => {
            try {
                const credential = firebase.auth.EmailAuthProvider.credential(
                    auth.currentUser.email,
                    deletePassword
                );
                await auth.currentUser.reauthenticateWithCredential(credential);
                await auth.currentUser.delete();

                goto("/"); // successful account deletion
            } catch (err) {
                console.error(err);

                errorMessage = err.message;
                successMessage = "";
            }
        };

        handleResendVerificationEmail = async () => {
            await auth.currentUser.sendEmailVerification();
        };

        auth.onAuthStateChanged((_user) => {
            if (_user) {
                user = _user;
            } else goto("/login/admin"); // not logged in, go to login page
        });
    });
</script>

<style>
    label {
        display: block;
    }

    .btn {
        display: block;
    }
</style>

<h1 class="text-xl font-bold">Mon Compte</h1>
{#if user !== undefined}
    <div>
        <strong>Nom/Prénom: </strong><i>{user.displayName}</i>
        <br />

        <strong>Email: </strong><i>{user.email}</i>
        (vérifié:
        {user.emailVerified ? 'oui' : 'non'})
        {#if !user.emailVerified}
            <span style="color: blue; cursor: pointer;">Renvoyer l'email de
                vérification</span>
        {/if}
    </div>
    <h2 class="text-lg font-semibold">Changer le mot de passe</h2>
    <label>
        Mot de passe existant
        <input
            class="input"
            type="password"
            placeholder="Mot de passe existant"
            bind:value={oldPassword}
        />
    </label>
    <label>
        Nouveau mot de passe
        <input
            class="input"
            type="password"
            placeholder="Nouveau mot de passe"
            bind:value={newPassword}
        />
    </label>
    <label>
        Confirmer le nouveau mot de passe
        <input
            class="input"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            bind:value={newPasswordVerify}
        />
    </label>
    <button
        class="btn mt-2"
        disabled={updatePasswordBtnDisabled}
        on:click={handlePasswordChange}
    >
        Changer
    </button>

    {#if errorMessage}
        <div class="red white-text ma-3 pa-2 rounded">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="green white-text ma-3 pa-2 rounded">{successMessage}</div>
    {/if}
    <h2 class="text-lg font-semibold">Supprimer votre compte</h2>
    <span class="text-red-500 font-semibold">Attention! Cette action est
        irréversible.</span>
    <label>
        Mot de passe
        <input
            class="input"
            type="password"
            placeholder="Mot de passe"
            bind:value={deletePassword}
        />
    </label>
    <button
        class="btn mt-2 bg-red-500 hover:bg-red-600"
        on:click={handleDeleteAccount}
    >
        Supprimer mon compte
    </button>
{/if}
