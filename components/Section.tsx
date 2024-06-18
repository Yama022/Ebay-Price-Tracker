import React from 'react';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import { Item } from '../hooks/useSections';
import styles from '../styles/Section.module.scss';

interface SectionProps {
    id: string;
    title: string;
    items: Item[];
    addItem: (sectionId: string, item: Item) => void;
}

    const Section: React.FC<SectionProps> = ({ id, title, items, addItem }) => {
    const handleAddItem = (item: Item) => {
        addItem(id, item);
    };

    return (
        <div className={styles.section}>
        <h2>{title}</h2>
        <ItemForm addItem={handleAddItem} />
        <ItemList items={items} />
        </div>
    );
};

export default Section;
