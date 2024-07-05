import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig.mjs';

const updateUserRole = async (userId: string, role: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
        role: role
        });
        console.log(`Updated user ${userId} to role ${role}`);
    } catch (error) {
        console.error("Error updating user role: ", error);
    }
};

export default updateUserRole;
