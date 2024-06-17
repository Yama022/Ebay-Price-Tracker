import React from 'react';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';
import useItemList from '../hooks/useItemList';
// import styles from '../styles/globals.scss';

const Home: React.FC = () => {
    const { items, addItem } = useItemList();

    return (
        <div className="App">
        <h1>eBay Price Tracker</h1>
        <ItemForm addItem={addItem} />
        <ItemList items={items} />
        </div>
    );
};

export default Home;
