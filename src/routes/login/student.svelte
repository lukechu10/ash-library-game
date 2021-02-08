<script lang="ts">
    let classId: string;
    let classPassword: string;

    let errorMessage = "";

    let handleLogin: () => Promise<void>;
    let loginBtnDisabled = false;
</script>

<h1 class="inline-block text-xl font-bold">Connexion Élève</h1>
<span class="text-gray-500"
    >Où
    <a href="/login/admin" class="text-blue-500"
        >connexion enseignant/bibliothécaire</a
    >
</span>

<div>
    <div>
        <label for="email">Identifiant de la classe</label>
        <input
            class="input"
            placeholder="Identifiant de la classe"
            bind:value={classId}
        />
    </div>
    <div>
        <label for="password">Mot de passe de la classe</label>
        <input
            class="input"
            placeholder="Mot de passe de la classe"
            type="password"
            bind:value={classPassword}
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
