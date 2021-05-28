import { browser } from "$app/env";
import { session } from "$app/stores";
import "$lib/firebase";
import { getApp } from "@firebase/app";
import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import Cookies from "js-cookie";
import { writable } from "svelte/store";

export const auth = getAuth(getApp());
export const authStateInitialized = writable(false);

function createAuthState() {
    const { set, subscribe, update } = writable<User | null>(null);

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

    return {
        set,
        subscribe,
        update
    };
}

export const authState = createAuthState();
