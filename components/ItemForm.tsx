import React, { useState, ChangeEvent, useEffect } from 'react';
import { Item } from '../hooks/useSections';
import { Input, Select, SelectItem, RadioGroup, Radio } from "@nextui-org/react";
import styles from '../styles/ItemForm.module.scss';
import '../styles/globals.scss';

interface ItemFormProps {
    addItem: (item: Item) => void;
    sectionTitle: string;
}

export interface gradedCard {
    society: string;
    note: number | string;
    value: number | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ addItem, sectionTitle }) => {
    const [price, setPrice] = useState('');
    const [cardName, setCardName] = useState('');
    const [gradedCard, setGradedCard] = useState('non');
    const [notes, setNotes] = useState<(number | string)[]>([]);
    const [gradedCardValue, setGradedCardValue] = useState<gradedCard>({ society: '', note: 0, value: null });
    const [isGradedCardOpen, setIsGradedCardOpen] = useState(false);
    const [selectedSociety, setSelectedSociety] = useState('');

    const gradationSocieties = ["PSA", "BGS", "CGC", "PCA", "COLLECT AURA", "CCC GRADING", "CGG", "AFG", "SFG", "SCA"];
    const specialNotesCCC = ["10 pristine - Gold Label", "10 pristine - Black Label"];
    const specialNotesCGG = ["10 PERFECT", "10+ JEWEL"];
    const specialNotesSCA = ["10 STAR"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cardName.trim() && (price.trim() || gradedCardValue.value !== null)) {
            const newItem: Item = {
                id: Math.random().toString(36).substr(2, 9),
                name: cardName,
                price: isGradedCardOpen ? `${gradedCardValue.value} €` : price,
                series: sectionTitle,
                society: gradedCardValue.society,
                note: notes[gradedCardValue.note as number] || gradedCardValue.note,
                value: gradedCardValue.value
            };
            addItem(newItem);
            setCardName('');
            setPrice('');
            setGradedCard('non');
            setGradedCardValue({ society: '', note: 0, value: null });
            setIsGradedCardOpen(false);
            setSelectedSociety('');
        }
    };
    

    const handleSelectGradedCard = (value: string) => {
        setGradedCard(value);
        setIsGradedCardOpen(value === 'oui');
    };

    const handleSelectSociety = (value: string | Set<string>) => {
        const societyIndex = Array.from(value instanceof Set ? value : [value])[0] as string;
        const society = gradationSocieties[parseInt(societyIndex, 10)];
        setSelectedSociety(society);
        setGradedCardValue(prev => ({ ...prev, society }));
    
        // Update available notes based on selected society
        let availableNotes: (number | string)[];
        if (society === 'PCA' || society === 'COLLECT AURA' || society === 'AFG') {
            availableNotes = [1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.5, 10];
        } else if (society === 'CCC GRADING') {
            availableNotes = [1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.5, 10, ...specialNotesCCC];
        } else if (society === 'CGG') {
            availableNotes = [1, 2, 3, 4, 5, 6, 7, 8, 8.5, 9, 9.5, 10, ...specialNotesCGG];
        } else if (society === 'SCA') {
            availableNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5, 10, ...specialNotesSCA];
        } else if (society === 'SFG') {
            availableNotes = [1, 2, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
        } else {
            availableNotes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
        setNotes(availableNotes);
    };
    
    
    const handleSelectNote = (value: string | number | Set<string>) => {
        const note = value instanceof Set ? Array.from(value).join(', ') : value;
        setGradedCardValue(prev => ({ ...prev, note }));
    };
    

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <Input
                type="text"
                placeholder="Nom de la carte"
                value={cardName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCardName(e.target.value)}
                className='input'
            />
            {cardName && (
                <div className="flex gap-4">
                    <h4>Est-ce une carte gradée ?</h4>
                    <div className="flex gap-4">
                        <RadioGroup 
                            name="gradedCard"
                            orientation='horizontal'
                            value={gradedCard} onChange={(e) => handleSelectGradedCard(e.target.value)}
                        >
                            <Radio value="oui">Oui</Radio>
                            <Radio value="non">Non</Radio>
                        </RadioGroup>
                    </div>
                </div>
            )}

            {isGradedCardOpen && (
                <div className="flex flex-col gap-4">
                    <Select
                        label="Choisissez une société de gradation"
                        value={gradationSocieties.indexOf(selectedSociety).toString()}
                        onSelectionChange={(value) => handleSelectSociety(value as string)}
                        className="select"
                    >
                        {gradationSocieties.map((society, index) => (
                            <SelectItem key={index} value={index.toString()} textValue={society}>
                                {society}
                            </SelectItem>
                        ))}
                    </Select>

                    {selectedSociety && (
                        <Select
                            label="Choisissez une note"
                            value={gradedCardValue.note.toString()}
                            onSelectionChange={(value) => handleSelectNote(value as string | number)}
                            className="select"
                        >
                            {notes.map((note, index) => (
                                <SelectItem key={index} value={note} textValue={note.toString()}>
                                    {note}
                                </SelectItem>
                            ))}
                        </Select>
                    )}

                    <Input
                        type="number"
                        label="Prix"
                        placeholder="0.00"
                        labelPlacement="outside"
                        value={gradedCardValue.value !== null ? gradedCardValue.value.toString() : ''}
                        onChange={(e) => setGradedCardValue({...gradedCardValue, value: e.target.value ? parseInt(e.target.value) : null})}
                        className="input-price"
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">€</span>
                            </div>
                        }
                    />
                </div>
            )}

            {cardName && !isGradedCardOpen && (
                <Input
                    type="number"
                    label="Prix"
                    placeholder="0.00"
                    labelPlacement="outside"
                    value={price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                    className="input-price"
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">€</span>
                        </div>
                    }
                />
            )}

            {(cardName && (price || gradedCardValue.value !== null)) && (
                <button type="submit" className={`${styles.itemForm__submitBbutton} mt-4`}>Ajouter</button>
            )}
        </form>
    );
};

export default ItemForm;
