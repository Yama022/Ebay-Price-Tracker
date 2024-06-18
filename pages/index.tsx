import React from 'react';
import Section from '../components/Section';
import AddSectionForm from '../components/AddSectionForm';
import AuthForm from '../components/AuthForm';
import useSections from '../hooks/useSections';
import styles from '../styles/Home.module.scss';

const Home: React.FC = () => {
    const { sections, addSection, addItemToSection } = useSections();

    return (
        <div className={styles.container}>
        <div className={styles.container__header}>
            <div className={styles.container__header__section}>
            <h1>Welcome to Ebay Price Tracker</h1>
            <AddSectionForm addSection={addSection} />
            </div>
            <div className={styles.container__header__login}>
            <AuthForm />
            </div>
        </div>
        <div className={styles.sections}>
            {sections.map(section => (
            <Section
                key={section.id}
                id={section.id}
                title={section.title}
                items={section.items}
                addItem={addItemToSection}
            />
            ))}
        </div>
        </div>
    );
};

export default Home;
