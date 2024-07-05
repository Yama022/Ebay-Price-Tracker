import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/AddSectionForm.module.scss';
import '../styles/globals.scss';

interface AddSectionFormProps {
    addSection: (title: string) => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ addSection }) => {
    const [selectedSection, setSelectedSection] = useState('Pokémon');
    const [isOpen, setIsOpen] = useState(false);

    const sectionSelect = ['Pokémon', 'One Piece'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSection.trim()) {
            addSection(selectedSection);
            setSelectedSection('Pokémon'); // Reset to default or initial state
        }
    };

    const handleSelectChange = (section: string) => {
        setSelectedSection(section);
        setIsOpen(false);
    };

    const toggleSelect = () => {
        setIsOpen(!isOpen);
    };

    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className={styles.addSectionForm}>
            <h4>Ajoute un TCG au choix parmis la liste suivante</h4>
            <div ref={selectRef} className="customSelectContainer">
                <div className="customSelect" onClick={toggleSelect}>
                    <div className="customSelectTrigger">
                        {selectedSection}
                    </div>
                    {isOpen && (
                        <div className="customOptions">
                            {sectionSelect.map((section, id) => (
                                <div 
                                    key={id} 
                                    className="customOption"
                                    onClick={() => handleSelectChange(section)}
                                >
                                    {section}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <button type="submit">Ajouter une section</button>
        </form>
    );
};

export default AddSectionForm;
