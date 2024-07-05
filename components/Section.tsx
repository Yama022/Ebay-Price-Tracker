import React from 'react';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import { Item } from '../hooks/useSections';
import { RxCross1 } from "react-icons/rx";
import styles from '../styles/Section.module.scss';

interface SectionProps {
    id: string;
    title: string;
    items: Item[];
    addItem: (sectionId: string, item: Item) => void;
    deleteSection: (sectionId: string) => void;
    deleteItem: (sectionId: string, itemId: string) => void;
}

const Section: React.FC<SectionProps> = ({ id, title, items, addItem, deleteSection, deleteItem }) => {
    const handleAddItem = (item: Item) => {
        addItem(id, item);
    };

    const handleDeleteSection = () => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            deleteSection(id);
        }
    };

    return (
        <div className={styles.section}>
            <h2>{title}</h2>
            <ItemForm addItem={handleAddItem} sectionTitle={title} />
            <ItemList items={items} sectionId={id} deleteItem={deleteItem} />
            <button onClick={handleDeleteSection} className={styles.section__delete}><RxCross1 /></button>
        </div>
    );
};

export default Section;
