<script context="module" lang="ts">
    export function load(input: LoadInput): LoadOutput {
        return protectedPage(input);
    }
</script>

<script lang="ts">
    import { protectedPage } from "$lib/protectedPage";
    import { goto } from "$app/navigation";
    import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";
    import { auth, authState, authStateInitialized } from "$lib/store/authState";
    import {
        reauthenticateWithCredential,
        EmailAuthProvider,
        updatePassword,
        sendEmailVerification
    } from "@firebase/auth";
    import { deleteUserClasses } from "$lib/firebase";

    let oldPassword: string, newPassword: string, newPasswordVerify: string;
    let deletePassword: string;
    let errorMessage: string, successMessage: string;
    let updatePasswordBtnDisabled = false;

    const handlePasswordChange = async () => {
        try {
            updatePasswordBtnDisabled = true;

            // validate form
            if (newPassword !== newPasswordVerify) throw { message: "The passwords do not match." };
            if (newPassword === oldPassword) throw { message: "You must enter a new password." };

            const credential = EmailAuthProvider.credential(
                auth.currentUser!.email!,
                deletePassword
            );
            await reauthenticateWithCredential($authState!, credential);
            await updatePassword($authState!, newPassword);

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

    const handleDeleteAccount = async () => {
        try {
            const credential = EmailAuthProvider.credential(
                auth.currentUser!.email!,
                deletePassword
            );
            await reauthenticateWithCredential($authState!, credential);

            // delete classes associated with user
            await deleteUserClasses(auth.currentUser!.uid);

            // delete user
            await auth.currentUser!.delete();

            goto("/"); // successful account deletion
        } catch (err) {
            console.error(err);

            errorMessage = err.message;
            successMessage = "";
        }
    };

    const handleResendVerificationEmail = () => {
        return sendEmailVerification($authState!);
    };
</script>

<h1 class="text-xl font-bold">Mon Compte</h1>
{#if $authStateInitialized && $authState !== null}
    <div>
        <strong>Nom/Prénom: </strong><i>{$authState.displayName}</i>
        <br />

        <strong>Email: </strong><i>{$authState.email}</i>
        (vérifié:
        {$authState.emailVerified ? "oui" : "non"})
        {#if !$authState.emailVerified}
            <span style="color: blue; cursor: pointer;" on:click={handleResendVerificationEmail}
                >Renvoyer l'email de vérification</span
            >
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
    <button class="mt-2 btn" disabled={updatePasswordBtnDisabled} on:click={handlePasswordChange}>
        Changer
    </button>

    {#if errorMessage}
        <div class="rounded red white-text ma-3 pa-2">{errorMessage}</div>
    {/if}
    {#if successMessage}
        <div class="rounded green white-text ma-3 pa-2">{successMessage}</div>
    {/if}
    <h2 class="text-lg font-semibold">Supprimer votre compte</h2>
    <span class="font-semibold text-red-500">Attention! Cette action est irréversible.</span>
    <label>
        Mot de passe
        <input
            class="input"
            type="password"
            placeholder="Mot de passe"
            bind:value={deletePassword}
        />
    </label>
    <button class="mt-2 bg-red-500 btn hover:bg-red-600" on:click={handleDeleteAccount}>
        Supprimer mon compte
    </button>
{/if}

<style>
    label {
        display: block;
    }

    .btn {
        display: block;
    }
</style>
