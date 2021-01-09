<script lang="ts">
    import { onMount } from "svelte";
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

<div>
    <div>
        <label for="email">Email</label>
        <input class="input" id="email" placeholder="Email" type="email" bind:value={email} />
    </div>
    <div>
        <label for="password">Mot de passe</label>
        <input class="input" id="password" placeholder="Mot de passe" type="password" bind:value={password} />
    </div>
    <button
        disabled={loginBtnDisabled}
        class="btn w-full mt-2"
        on:click={handleLogin}
    >
        Connexion
    </button>

    {#if errorMessage}
        <div class="rounded text-white bg-red-500 px-3 py-2 mt-2">{errorMessage}</div>
    {/if}
</div>
