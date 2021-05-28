<script lang="ts">
    import { auth, authState, authStateInitialized } from "$lib/store/authState";
    import { cubicOut } from "svelte/easing";
    import { slide } from "svelte/transition";
    import { signOut } from "@firebase/auth";
    import { session } from "$app/stores";

    let dropdownOpen = false;

    const toggleDropdown = (event: Event) => {
        event.stopImmediatePropagation();
        dropdownOpen = !dropdownOpen;
    };
    const handleSignout = () => {
        signOut(auth);
        $session = { ...$session, token: undefined };
    };
    const closeDropdown = () => (dropdownOpen = false);
</script>

<nav class="fixed top-0 z-50 px-8 w-full bg-gray-800 shadow-md">
    <div class="flex flex-row justify-between items-center h-12">
        <!-- Left menu items -->
        <div class="flex-initial">
            <div class="flex space-x-4 text-white">
                <a href="/" class="py-2 px-3 text-sm font-medium bg-gray-900 rounded-md"
                    >Library Game</a
                >
            </div>
        </div>

        <!-- Authentication state -->
        {#if $authStateInitialized}
            {#if $authState === null}
                <!-- Logged out -->
                <div class="flex flex-row-reverse ml-2 space-x-4 text-white">
                    <a
                        href="/login/student"
                        class="py-2 px-3 text-sm font-medium bg-gray-900 rounded-md">Connexion</a
                    >
                </div>
            {:else}
                <div class="flex flex-row-reverse">
                    <div>
                        <button
                            class="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-white focus:ring-offset-gray-800 focus:ring-offset-2 focus:ring-2"
                            on:click={toggleDropdown}
                        >
                            <span class="sr-only">Open user menu</span>
                            <img
                                src="/images/default_avatar.png"
                                alt="avatar"
                                class="w-8 h-8 rounded-full"
                            />
                        </button>
                        {#if dropdownOpen}
                            <div class="absolute mt-2 w-8">
                                <div
                                    transition:slide={{
                                        duration: 250,
                                        easing: cubicOut
                                    }}
                                    class="absolute right-0 py-1 w-48 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                >
                                    <a
                                        href="/account"
                                        class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem">Mon compte</a
                                    >
                                    <a
                                        href="/my_classes"
                                        class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem">Mes classes</a
                                    >
                                    <span
                                        href="#"
                                        class="block py-2 px-4 text-sm text-red-500 cursor-pointer hover:bg-gray-100"
                                        role="menuitem"
                                        on:click={handleSignout}>Déconnecter</span
                                    >
                                </div>
                            </div>
                        {/if}
                    </div>
                    <span class="inline-block my-auto mr-3 text-white"
                        >{$authState.displayName}</span
                    >
                </div>
            {/if}
        {/if}
    </div>
</nav>

<svelte:body on:click={closeDropdown} />
