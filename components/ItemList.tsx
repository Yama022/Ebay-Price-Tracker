import React from 'react';
import Item from './Item';
import styles from '../styles/ItemList.module.scss';

interface ItemListProps {
    items: { name: string; price: string }[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
    return (
        <ul className={styles.itemList}>
        {items.map((item, index) => (
            <Item key={index} item={item} />
        ))}
        </ul>
    );
};

export default ItemList;
