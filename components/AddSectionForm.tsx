import React, { useState } from 'react';
import { Select, SelectItem, Button } from "@nextui-org/react";
import styles from '../styles/AddSectionForm.module.scss';
import '../styles/globals.scss';

interface AddSectionFormProps {
    addSection: (title: string) => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ addSection }) => {
    const [selectedSection, setSelectedSection] = useState('Pokémon');

    const sectionSelect = ['Pokémon', 'One Piece', 'Lorcana', 'Yu-Gi-Oh!', 'Magic The Gathering', 'Dragon Ball'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSection.trim()) {
            addSection(selectedSection);
            setSelectedSection('Pokémon'); // Reset to default or initial state
        }
    };

    const handleSelectChange = (value: string) => {
        setSelectedSection(value);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addSectionForm}>
            <h4>Ajoute un TCG au choix parmi la liste suivante</h4>
            <div className={styles.customSelectContainer}>
                <Select 
                    label="Choisissez une section"
                    placeholder="Sélectionnez une section"
                    value={selectedSection}
                    onChange={(e) => handleSelectChange(e.target.value)}
                    className={styles.select}
                >
                    {sectionSelect.map((section) => (
                        <SelectItem key={section} value={section} textValue={section}>
                            {section}
                        </SelectItem>
                    ))}
                </Select>
            </div>
            <Button type="submit" className="mt-4 button">Ajouter une section</Button>
        </form>
    );
};

export default AddSectionForm;
