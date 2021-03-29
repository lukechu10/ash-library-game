<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Observable } from "rxjs";
    import { onMount } from "svelte";
    import { authState } from "rxfire/auth";

    let name: string, email: string, password: string, passwordVerify: string;
    let handleSignup: () => Promise<void>;
    let signupBtnDisabled = false;

    let user: Observable<firebase.default.User>;

    $: if (!!$user) goto("/account");

    onMount(async () => {
        const { auth } = await import("../../services/firebase");
        user = authState(auth);
    });

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
                await auth.currentUser!.updateProfile({ displayName: name });

                // send verification email
                await user.user!.sendEmailVerification();

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

<h1 class="inline-block text-xl font-bold">
    Inscription Enseignant/Bibliothécaire
</h1>
<span class="text-gray-500"
    >Où
    <a href="/login/admin" class="text-blue-500">connexion</a>
</span>

<div>
    <div>
        <label for="name">Nom/Prénom</label>
        <input
            class="input"
            id="name"
            placeholder="Nom/Prénom"
            bind:value={name}
        />
    </div>
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
    <div>
        <label for="password-verify">Confirmer le mot de passe</label>
        <input
            class="input"
            id="password-verify"
            placeholder="Confirmer le mot de passe"
            type="password"
            bind:value={passwordVerify}
        />
    </div>
    <button
        disabled={signupBtnDisabled}
        class="mt-2 w-full btn"
        on:click={handleSignup}
    >
        Inscription
    </button>

    {#if errorMessage}
        <div class="py-2 px-3 mt-2 text-white bg-red-500 rounded">
            {errorMessage}
        </div>
    {/if}
</div>
