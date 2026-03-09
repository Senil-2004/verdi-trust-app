import { db } from './src/firebase.js';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';

async function clearFirebaseUsers() {
    console.log('Clearing users from Firestore...');
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Deleted user profile: ${doc.id}`);
        });
        console.log('Finished initiating deletes on Firestore.');
    } catch (e) {
        console.error('Error', e);
    }
}

clearFirebaseUsers();
