import React, { useState } from 'react';
import styles from '../styles/AddSectionForm.module.scss';

interface AddSectionFormProps {
    addSection: (title: string) => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ addSection }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
        addSection(title);
        setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addSectionForm}>
        <input
            type="text"
            placeholder="Nom de la section"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Ajouter une section</button>
        </form>
    );
};

export default AddSectionForm;
