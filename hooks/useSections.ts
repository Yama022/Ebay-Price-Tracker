import { useState } from 'react';

export interface Item {
    name: string;
    price: string;
}

export interface Section {
    id: number;
    title: string;
    items: Item[];
}

const useSections = () => {
    const [sections, setSections] = useState<Section[]>([]);

    const addSection = (title: string) => {
        const newSection = {
        id: sections.length ? sections[sections.length - 1].id + 1 : 1,
        title,
        items: []
        };
        setSections([...sections, newSection]);
    };

    const addItemToSection = (sectionId: number, item: Item) => {
        setSections(
        sections.map(section =>
            section.id === sectionId
            ? { ...section, items: [...section.items, item] }
            : section
        )
        );
    };

    return {
        sections,
        addSection,
        addItemToSection
    };
};

export default useSections;
