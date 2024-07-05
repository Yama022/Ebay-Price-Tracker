import React from 'react';
import Item from './Item';
import styles from '../styles/ItemList.module.scss';

interface ItemListProps {
    sectionId: string;
    items: { id: string; name: string; price: string }[];
    deleteItem: (sectionId: string, itemId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ sectionId, items, deleteItem }) => {
    const handleDeleteItem = (itemId: string) => {
        deleteItem(sectionId, itemId);
    };

    return (
        <ul className={styles.itemList}>
            {items.map((item, index) => (
                <li key={index}>
                    <Item item={item} />
                    <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default ItemList;
