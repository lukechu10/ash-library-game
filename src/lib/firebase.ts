import { getApps, initializeApp } from "@firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGtonrsu3vadoRIHmT4SDj5A1ex5SIQqk",
    authDomain: "ash-library-game.firebaseapp.com",
    databaseURL: "https://ash-library-game.firebaseio.com",
    projectId: "ash-library-game",
    storageBucket: "ash-library-game.appspot.com",
    messagingSenderId: "245972556136",
    appId: "1:245972556136:web:70a0b6c1e7491b97389edd",
    measurementId: "G-KDGHMPNYKN"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export interface ScoreSchema {
    name: string;
    score: number;
}

export interface ClassSchema {
    /** The name of the class. */
    name: string;
    /** Class username. */
    classId: string;
    /** Class password. */
    // FIXME: do not store password as raw text
    classPassword: string;
    /** A list of student names. */
    students: string[];
    /** The user uid who owns the class. */
    owner: string;
}
