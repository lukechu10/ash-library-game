<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let email = "",
        name = "";
    let signedIn: boolean | undefined; // signedIn should be undefined until auth has loaded
    let dropdownOpen = false;

    let handleSignout: () => Promise<void>;
    onMount(async () => {
        const { auth } = await import("../services/firebase");

        handleSignout = async () => {
            await auth.signOut();
        };

        auth.onAuthStateChanged((user) => {
            if (user) {
                email = user.email;
                name = user.displayName;
                signedIn = true;
            } else {
                email = "";
                name = "";
                signedIn = false;
            }
        });
    });

    const toggleDropdown = (event: Event) => {
        event.stopImmediatePropagation();
        dropdownOpen = !dropdownOpen;
    };
    const closeDropdown = () => (dropdownOpen = false);
</script>

<nav class="fixed z-50 top-0 px-8 w-full bg-gray-800 shadow-md">
    <div class="flex flex-row items-center justify-between h-12">
        <!-- Left menu items -->
        <div class="flex-initial">
            <div class="flex text-white space-x-4">
                <a
                    href="/"
                    class="px-3 py-2 text-sm font-medium bg-gray-900 rounded-md"
                >Library Game</a>
            </div>
        </div>

        <!-- Profile dropdown -->
        <div class="flex-1">
            {#if signedIn !== undefined}
                {#if signedIn === true}
                    <div class="flex flex-row-reverse">
                        <div>
                            <button
                                class="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-white focus:ring-offset-gray-800 focus:ring-offset-2 focus:ring-2"
                                on:click={toggleDropdown}
                            >
                                <span class="sr-only">Open user menu</span>
                                <img
                                    src="/defaultAvatar.png"
                                    alt="avatar"
                                    class="w-8 h-8 rounded-full"
                                />
                            </button>
                            {#if dropdownOpen}
                                <div class="absolute mt-2 w-8">
                                    <div
                                        transition:slide={{ duration: 250, easing: cubicOut }}
                                        class="absolute right-0 py-1 w-48 bg-white rounded-md shadow-lg origin-top-right ring-black ring-opacity-5 ring-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="user-menu"
                                    >
                                        <a
                                            href="/account"
                                            class="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                        >Mon compte</a>
                                        <span
                                            href="#"
                                            class="block px-4 py-2 text-red-500 text-sm hover:bg-gray-100"
                                            role="menuitem"
                                            on:click={handleSignout}
                                        >Déconnecter</span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        <span
                            class="inline-block mr-3 my-auto text-white"
                        >{name}</span>
                    </div>
                {:else}
                    <div class="flex text-white space-x-4 ml-2">
                        <a
                            href="/login/admin"
                            class="px-3 py-2 text-sm font-medium bg-gray-900 rounded-md"
                        >Connexion</a>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</nav>

<svelte:body on:click={closeDropdown} />
