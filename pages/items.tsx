import React from 'react';
import Section from '../components/Section';
import AddSectionForm from '../components/AddSectionForm';
import useSections from '../hooks/useSections';
import Header from '../components/Header';
import styles from '../styles/Home.module.scss';
import '../styles/globals.scss';

const Items: React.FC = () => {
    const { sections, addSection, addItemToSection, deleteSection, deleteItemFromSection } = useSections();

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.sections}>
                <div className={styles.sections__addSection}>
                    <AddSectionForm addSection={addSection} />
                </div>
                <div className={styles.sections__section}>
                    {sections.map(section => (
                        <Section
                            key={section.id}
                            id={section.id}
                            title={section.title}
                            items={section.items}
                            addItem={addItemToSection}
                            deleteSection={deleteSection}
                            deleteItem={deleteItemFromSection}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Items;
