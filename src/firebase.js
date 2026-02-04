import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdAvjyDiSDKs3J-z36u7sb6mC-ATXPdAs",
    authDomain: "verdi-trust.firebaseapp.com",
    projectId: "verdi-trust",
    storageBucket: "verdi-trust.firebasestorage.app",
    messagingSenderId: "926971544366",
    appId: "1:926971544366:web:654a861572f11ed85a70bf",
    measurementId: "G-5HL7KZ7D77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
