<script context="module" lang="ts">
    export function load({ session }: LoadInput): LoadOutput {
        if (session.token !== undefined) return { status: 302, redirect: "/account" };
        else return { status: 200 };
    }
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import { session } from "$app/stores";
    import { auth } from "$lib/store/authState";
    import { signInWithEmailAndPassword } from "@firebase/auth";
    import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";
    import { getIdToken } from "@firebase/auth";

    let email: string, password: string;
    let loginBtnDisabled = false;

    let errorMessage = "";

    const handleLogin = async () => {
        try {
            loginBtnDisabled = true;
            const cred = await signInWithEmailAndPassword(auth, email, password);
            $session = { ...$session, token: await getIdToken(cred.user) };
            goto("/");
        } catch (err) {
            console.error(err);
            errorMessage = err.message;
        } finally {
            loginBtnDisabled = false;
        }
    };
</script>

<h1 class="inline-block text-xl font-bold">Connexion Enseignant/Bibliothécaire</h1>
<span class="text-gray-500"
    >Où
    <a href="/signup/admin" class="text-blue-500">inscription</a>
</span>

<div>
    <div>
        <label for="email">Email</label>
        <input class="input" id="email" placeholder="Email" type="email" bind:value={email} />
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
    <button disabled={loginBtnDisabled} class="mt-2 w-full btn" on:click={handleLogin}>
        Connexion
    </button>

    {#if errorMessage}
        <div class="py-2 px-3 mt-2 text-white bg-red-500 rounded">
            {errorMessage}
        </div>
    {/if}
</div>
