import "$lib/firebase";
import { getApp } from "@firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { writable } from "svelte/store";

const auth = getAuth(getApp());

function createAuthState() {
    const { set, subscribe, update } = writable<User | null>(null);

    onAuthStateChanged(auth, user => {
        if (user) {
            set(user);
        } else {
            set(null);
        }
    });

    return {
        set, subscribe, update
    };
}

export const authState = createAuthState();
