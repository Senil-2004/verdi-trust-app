import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAdAvjyDiSDKs3J-z36u7sb6mC-ATXPdAs",
    authDomain: "verdi-trust.firebaseapp.com",
    projectId: "verdi-trust",
    storageBucket: "verdi-trust.firebasestorage.app",
    messagingSenderId: "926971544366",
    appId: "1:926971544366:web:654a861572f11ed85a70bf",
    measurementId: "G-5HL7KZ7D77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function test() {
    try {
        await createUserWithEmailAndPassword(auth, "senilmca@gmail.com", "password123");
        console.log("Success");
    } catch (error) {
        console.log("Error Code:", error.code);
        console.log("Error Message:", error.message);
    }
}

test();
