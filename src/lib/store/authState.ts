import "$lib/firebase";
import { getApp } from "@firebase/app";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import type { User } from "@firebase/auth";
import Cookies from "js-cookie";
import { writable } from "svelte/store";
import { browser } from "$app/env";

export const auth = browser ? getAuth(getApp()) : null;
export const authStateInitialized = writable(false);

function createAuthState() {
    const { set, subscribe, update } = writable<User | null>(null);

    if (auth !== null) {
        onAuthStateChanged(auth, async (user) => {
            authStateInitialized.set(true);

            if (user) {
                set(user);
                const token = await user.getIdToken();
                Cookies.set("token", token);
            } else {
                set(null);
                Cookies.remove("token");
            }
        });
    }

    return {
        set,
        subscribe,
        update
    };
}

export const authState = createAuthState();
