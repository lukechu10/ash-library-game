import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
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
export const analytics = firebase.analytics();
export const perf = firebase.performance();
export const db = firebase.firestore();
