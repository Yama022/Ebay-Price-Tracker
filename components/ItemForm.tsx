import React, { useState, useEffect, useRef } from 'react';
import { Item } from '../hooks/useSections';
import styles from '../styles/ItemForm.module.scss';
import '../styles/globals.scss';

interface ItemFormProps {
    addItem: (item: Item) => void;
    sectionTitle: string;
}

interface Card {
    name: string;
}

interface Serie {
    serie: string;
    cartes: Card[];
}

const ItemForm: React.FC<ItemFormProps> = ({ addItem, sectionTitle }) => {
    const [price, setPrice] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [seriesData, setSeriesData] = useState<Serie[]>([]);
    const [selectedSerie, setSelectedSerie] = useState('');
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState('');
    const [isBlockOpen, setIsBlockOpen] = useState(false);
    const [isSerieOpen, setIsSerieOpen] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);

    const blockPokemonSelect = ["Ecarlate et Violet", "Epée et Bouclier", "Soleil et Lune", "XY", "Noir et Blanc", "Appel des légendes", "HeartGold SoulSilver", "Platine", "Diamant et Perle", "Ex", "Wizards", "Promo"];
    const blockOnePieceSelect = ["OP01", "OP02", "OP03", "OP04", "OP05", "OP06", "OP07", "EB01", "OP08"];

    const handleSelectBlock = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const block = e.target.value;
        setSelectedBlock(block);
        setIsBlockOpen(false);
        try {
            const response = await fetch(`/data/${block}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Response is not JSON");
            }
            const data: Serie[] = await response.json();
            setSeriesData(data);
            setSelectedSerie('');
            setCards([]);
            setSelectedCard('');
            setPrice('');
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            setSeriesData([]);
        }
    };

    const handleSelectSerie = (serie: string) => {
        setSelectedSerie(serie);
        const selectedSeries = seriesData.find(item => item.serie === serie);
        setCards(selectedSeries ? selectedSeries.cartes : []);
        setSelectedCard('');
        setPrice('');
        setIsSerieOpen(false);
    };

    const handleSelectCard = (card: string) => {
        setSelectedCard(card);
        setIsCardOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCard.trim() && price.trim()) {
            const newItem: Item = {
                id: Math.random().toString(36).substr(2, 9),
                name: selectedCard,
                price,
                series: sectionTitle
            };
            addItem(newItem);
            setSelectedCard('');
            setPrice('');
        }
    };

    const toggleBlockSelect = () => setIsBlockOpen(!isBlockOpen);
    const toggleSerieSelect = () => setIsSerieOpen(!isSerieOpen);
    const toggleCardSelect = () => setIsCardOpen(!isCardOpen);

    const blockSelect = sectionTitle === "Pokémon" ? blockPokemonSelect : blockOnePieceSelect;

    // Handlers for clicks outside the custom selects
    const blockSelectRef = useRef<HTMLDivElement>(null);
    const serieSelectRef = useRef<HTMLDivElement>(null);
    const cardSelectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (blockSelectRef.current && !blockSelectRef.current.contains(event.target as Node)) {
                setIsBlockOpen(false);
            }
            if (serieSelectRef.current && !serieSelectRef.current.contains(event.target as Node)) {
                setIsSerieOpen(false);
            }
            if (cardSelectRef.current && !cardSelectRef.current.contains(event.target as Node)) {
                setIsCardOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className={styles.itemForm}>
            <div ref={blockSelectRef} className="customSelectContainer" onClick={toggleBlockSelect}>
                <div className="customSelectTrigger">
                    {selectedBlock || `Sélectionnez un bloc ${sectionTitle}`}
                </div>
                {isBlockOpen && (
                    <div className="customOptions">
                        {blockSelect.map((block, index) => (
                            <div key={index} className="customOption" onClick={() => handleSelectBlock({ target: { value: block } } as React.ChangeEvent<HTMLSelectElement>)}>
                                {block}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {seriesData.length > 0 && (
                <div ref={serieSelectRef} className="customSelectContainer" onClick={toggleSerieSelect}>
                    <div className="customSelectTrigger">
                        {selectedSerie || 'Sélectionnez une série'}
                    </div>
                    {isSerieOpen && (
                        <div className="customOptions">
                            {seriesData.map((item, id) => (
                                <div key={id} className="customOption" onClick={() => handleSelectSerie(item.serie)}>
                                    {item.serie}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {cards.length > 0 && (
                <div ref={cardSelectRef} className="customSelectContainer" onClick={toggleCardSelect}>
                    <div className="customSelectTrigger">
                        {selectedCard || 'Sélectionnez une carte'}
                    </div>
                    {isCardOpen && (
                        <div className="customOptions">
                            {cards.map((card, index) => (
                                <div key={index} className="customOption" onClick={() => handleSelectCard(card.name)}>
                                    {card.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedCard && (
                <input
                    type="text"
                    placeholder="Prix de l'item"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={styles.priceInput}
                />
            )}
            <button type="submit" className={styles.submitButton}>Ajouter</button>
        </form>
    );
};

export default ItemForm;
