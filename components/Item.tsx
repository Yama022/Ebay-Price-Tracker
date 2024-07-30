import React from 'react';
import { Item as ItemType } from '../hooks/useSections';
import styles from '../styles/Item.module.scss';

interface ItemProps {
    item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => {
    return (
        <div className={styles.item}>
            <h3><span>Nom : </span>{item.name}</h3>
            <p><span>Numéro : </span>{item.number}</p>
            {item.value === null ? (
                <p><span>Valeur : </span>{item.price}</p>
            ) : (
                <>
                    {item.society && <p><span>Société de gradation : </span>{item.society}</p>}
                    {item.note && <p><span>Note : </span>{item.note}</p>}
                    {item.value !== null && <p><span>Valeur : </span>{item.value} €</p>}
                </>
            )}
        </div>
    );
};

export default Item;
