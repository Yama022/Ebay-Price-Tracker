import React from 'react';
import Item from './Item';
import { RxCross1 } from "react-icons/rx";
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
                <li key={index} className={styles.itemList__list}>
                    <Item item={item}/>
                    <button onClick={() => handleDeleteItem(item.id)} className='deleteButton'><RxCross1 /></button>
                </li>
            ))}
        </ul>
    );
};

export default ItemList;
