import { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebaseConfig';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged, User, Unsubscribe } from 'firebase/auth';

export interface Item {
    name: string;
    price: string;
}

interface Section {
    id: string;
    title: string;
    items: Item[];
}

    const useSections = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUser(user);
            const q = query(collection(db, 'sections'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const sectionsData: Section[] = [];
            querySnapshot.forEach((doc) => {
            sectionsData.push({ id: doc.id, ...doc.data() } as Section);
            });
            setSections(sectionsData);
        } else {
            setUser(null);
            setSections([]);
        }
        });

        return () => unsubscribe();
    }, []);

    const addSection = async (title: string) => {
        if (!user) {
        console.error("User is not authenticated");
        return;
        }

        console.log('Adding section with userId:', user.uid); // Ajoutez ce journal
        const newSectionRef = doc(collection(db, 'sections'));
        const newSection = {
        userId: user.uid,
        title,
        items: []
        };

        try {
        await setDoc(newSectionRef, newSection);
        setSections([...sections, { id: newSectionRef.id, ...newSection }]);
        console.log("Section added successfully");
        } catch (error) {
        console.error("Error adding section:", error);
        }
    };

    const addItemToSection = async (sectionId: string, item: Item) => {
        const sectionRef = doc(db, 'sections', sectionId);
        const section = sections.find((section) => section.id === sectionId);
        if (section) {
        const updatedItems = [...section.items, item];
        await setDoc(sectionRef, { ...section, items: updatedItems }, { merge: true });
        setSections(sections.map((sec) => (sec.id === sectionId ? { ...sec, items: updatedItems } : sec)));
        }
    };

    return {
        sections,
        addSection,
        addItemToSection
    };
};

export default useSections;
