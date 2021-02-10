<script lang="ts">
    import { goto } from "@sapper/app";
    import { onMount } from "svelte";

    let email: string, password: string;
    let handleLogin: () => Promise<void>;
    let loginBtnDisabled = false;

    let errorMessage = "";
    onMount(async () => {
        const { auth } = await import("$services/firebase");

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

<h1 class="inline-block text-xl font-bold">
    Connexion Enseignant/Bibliothécaire
</h1>
<span class="text-gray-500"
    >Où
    <a href="/signup/admin" class="text-blue-500">inscription</a>
</span>

<div>
    <div>
        <label for="email">Email</label>
        <input
            class="input"
            id="email"
            placeholder="Email"
            type="email"
            bind:value={email}
        />
    </div>
    <div>
        <label for="password">Mot de passe</label>
        <input
            class="input"
            id="password"
            placeholder="Mot de passe"
            type="password"
            bind:value={password}
        />
    </div>
    <button
        disabled={loginBtnDisabled}
        class="mt-2 w-full btn"
        on:click={handleLogin}
    >
        Connexion
    </button>

    {#if errorMessage}
        <div class="py-2 px-3 mt-2 text-white bg-red-500 rounded">
            {errorMessage}
        </div>
    {/if}
</div>
