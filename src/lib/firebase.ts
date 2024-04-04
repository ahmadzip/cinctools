// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBtl3fIor7t9KHibxClhVCjK8CtZQ7lIT0",
    authDomain: "cinc487.firebaseapp.com",
    projectId: "cinc487",
    storageBucket: "cinc487.appspot.com",
    messagingSenderId: "462872578991",
    appId: "1:462872578991:web:af6fbe203d688814c0bd5a",
    measurementId: "G-W8C57CE8XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);