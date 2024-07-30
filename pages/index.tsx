/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Header from '../components/Header';
import styles from '../styles/Home.module.scss';
import '../styles/globals.scss';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.presentation}>
                <h1>Bienvenue sur TCG Market Value</h1>
                <p>
                    TCG Market Value est votre plateforme de référence pour suivre et gérer vos collections de jeux de cartes à collectionner (TCG). Que vous soyez passionné de Pokémon, One Piece, Lorcana, Yu-Gi-Oh!, Magic The Gathering ou Dragon Ball, notre site vous offre toutes les fonctionnalités nécessaires pour organiser et évaluer vos collections.
                </p>
                <h2>Ajoutez et Gérez vos TCG</h2>
                <p>
                    Avec TCG Market Value, vous pouvez facilement ajouter différents TCG à votre collection. Sélectionnez simplement le TCG de votre choix et commencez à y ajouter des items. Vous pouvez également ajouter des cartes spécifiques, qu'elles soient gradées ou non.
                </p>
                <h2>Suivez l'Évolution des Prix</h2>
                <p>
                    Notre plateforme vous permet de suivre l'évolution des prix de vos cartes dans le temps. Que vos cartes soient gradées par des sociétés reconnues comme PSA, BGS, ou CCC Grading, ou non gradées, vous aurez toujours une vue d'ensemble de la valeur de votre collection.
                </p>
                <h2>Fonctionnalités Clés</h2>
                <ul>
                    <li>Ajouter différents TCG à votre collection</li>
                    <li>Ajouter et gérer des items et des cartes</li>
                    <li>Suivre l'évolution des prix de vos cartes</li>
                    <li>Visualiser les valeurs des cartes gradées</li>
                </ul>
                <p>
                    Explorez les différentes sections du site pour commencer à organiser et évaluer votre collection dès aujourd'hui. Si vous avez des questions, n'hésitez pas à nous contacter via la page Contact.
                </p>
            </div>
        </div>
    );
};

export default Home;
