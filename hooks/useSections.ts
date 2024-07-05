import { useState, useEffect } from 'react';
import { db, auth } from '../utils/firebaseConfig.mjs';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface Item {
    id: string;
    name: string;
    price: string;
    series: string;
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        if (!user) return;

        const newSectionRef = doc(collection(db, 'sections'));
        const newSection = {
            userId: user.uid,
            title,
            items: []
        };
        await setDoc(newSectionRef, newSection);
        setSections([...sections, { id: newSectionRef.id, ...newSection }]);
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

    const deleteSection = async (sectionId: string) => {
        await deleteDoc(doc(db, 'sections', sectionId));
        setSections(sections.filter((section) => section.id !== sectionId));
    };

    const deleteItemFromSection = async (sectionId: string, itemId: string) => {
        const sectionRef = doc(db, 'sections', sectionId);
        const section = sections.find((section) => section.id === sectionId);
        if (section) {
            const updatedItems = section.items.filter((item) => item.id !== itemId);
            await setDoc(sectionRef, { ...section, items: updatedItems }, { merge: true });
            setSections(sections.map((sec) => (sec.id === sectionId ? { ...sec, items: updatedItems } : sec)));
        }
    };

    return {
        sections,
        addSection,
        addItemToSection,
        deleteSection,
        deleteItemFromSection
    };
};

export default useSections;
