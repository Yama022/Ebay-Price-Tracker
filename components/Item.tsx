import React from 'react';
import styles from '../styles/Item.module.scss';

interface ItemProps {
    item: { name: string; price: string };
}

const Item: React.FC<ItemProps> = ({ item }) => {
    return (
        <li className={styles.item}>
        {item.name}: {item.price} €
        </li>
    );
};

export default Item;
