import React, { useState } from 'react';
import styles from '../styles/ItemForm.module.scss';

interface ItemFormProps {
    addItem: (item: { name: string; price: string }) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ addItem }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addItem({ name, price });
        setName('');
        setPrice('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.itemForm}>
        <input
            type="text"
            placeholder="Nom de l'objet"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        <input
            type="number"
            placeholder="Prix"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Ajouter</button>
        </form>
    );
};

export default ItemForm;
