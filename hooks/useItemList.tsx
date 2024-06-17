import { useState } from 'react';

const useItemList = () => {
    const [items, setItems] = useState<{ name: string; price: string }[]>([]);

    const addItem = (item: { name: string; price: string }) => {
        if (items.length < 10) {
        setItems([...items, item]);
        } else {
        alert('La liste est pleine !');
        }
    };

    return {
        items,
        addItem,
    };
};

export default useItemList;
