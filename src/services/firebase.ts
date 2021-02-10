import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDGtonrsu3vadoRIHmT4SDj5A1ex5SIQqk",
    authDomain: "ash-library-game.firebaseapp.com",
    databaseURL: "https://ash-library-game.firebaseio.com",
    projectId: "ash-library-game",
    storageBucket: "ash-library-game.appspot.com",
    messagingSenderId: "245972556136",
    appId: "1:245972556136:web:70a0b6c1e7491b97389edd",
    measurementId: "G-KDGHMPNYKN",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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

export async function addNewScore(score: ScoreSchema): Promise<void> {
    await db.collection("scores").add(score);
}

/**
 * @returns `true` if the class was successfully added or `false` if a class with the same `classId` already exists.
 */
export async function createClass(_class: ClassSchema): Promise<boolean> {
    if (
        await (await db.collection("classes").doc(_class.classId).get()).exists
    ) {
        return false;
    } else {
        await db.collection("classes").doc(_class.classId).set(_class);
        return true;
    }
}

export async function addStudentToClass(
    classId: string,
    student: string
): Promise<void> {
    await db
        .collection("classes")
        .doc(classId)
        .update({
            students: firebase.firestore.FieldValue.arrayUnion(student),
        });
}

/** Deletes all the classes associated with a user. This should be called prior to deleting the user account. */
export async function deleteUserClasses(uid: string): Promise<void> {
    (await db.collection("classes").where("owner", "==", uid).get()).forEach(
        async (doc) => await doc.ref.delete()
    );
}

export const analytics = firebase.analytics();
export const perf = firebase.performance();
export const db = firebase.firestore();
export const auth = firebase.auth();

if (process.env.NODE_ENV === "development") {
    console.log("Disabling Google Analytics collection in DEV mode");
    analytics.setAnalyticsCollectionEnabled(false); // disable analytics in dev mode
}
