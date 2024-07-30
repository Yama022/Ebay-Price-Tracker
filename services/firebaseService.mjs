// services/firebaseService.ts
import { collection, addDoc } from "firebase/firestore";
import { getAuth, updatePassword as firebaseUpdatePassword } from "firebase/auth";
import { db } from "../utils/firebaseConfig.mjs";

export const addLanguageWithBlocks = async (collectionName, languageName, tcgName, blocks) => {
    try {
        const languageRef = await addDoc(collection(db, collectionName), { language: languageName, nameTCG: tcgName });
        const languageId = languageRef.id;

        for (const block of blocks) {
            const blockRef = await addDoc(collection(db, collectionName, languageId, "blocks"), { name: block.name });
            const blockId = blockRef.id;

            for (const series of block.series) {
                await addDoc(collection(db, collectionName, languageId, "blocks", blockId, "series"), series);
            }
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


export const deleteSectionFromFirebase = async (sectionId) => {
    try {
        await deleteDoc(doc(db, "sections", sectionId));
        console.log("Section deleted successfully");
    } catch (e) {
        console.error("Error deleting section: ", e);
    }
};

export const deleteItemFromSection = async (sectionId, itemId) => {
    try {
        const sectionRef = doc(db, "sections", sectionId);
        const sectionSnapshot = await getDoc(sectionRef);
        const sectionData = sectionSnapshot.data();

        const updatedItems = sectionData.items.filter(item => item.id !== itemId);

        await setDoc(sectionRef, { ...sectionData, items: updatedItems }, { merge: true });
        console.log("Item deleted successfully");
    } catch (e) {
        console.error("Error deleting item: ", e);
    }
};

export const getUserData = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            console.log("User data:", userSnapshot.data());
            return userSnapshot.data();
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (e) {
        console.error("Error getting user data: ", e);
        return null;
    }
};

export const updatePassword = async (currentUser, newPassword) => {
    try {
        const auth = getAuth();
        await updatePassword(currentUser, newPassword);
        console.log("Password updated successfully");
    } catch (e) {
        console.error("Error updating password: ", e);
    }
};