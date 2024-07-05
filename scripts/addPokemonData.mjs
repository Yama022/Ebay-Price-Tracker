import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { addLanguageWithBlocks } from "../services/firebaseService.mjs";
import fs from 'fs';
import path from 'path';

const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
});

const auth = getAuth(app);
const db = getFirestore(app);

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/[éèêë]/g, 'e')
        .replace(/[àâä]/g, 'a')
        .replace(/[îï]/g, 'i')
        .replace(/[ôö]/g, 'o')
        .replace(/[ûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9_]/g, '_')  // Remplacer les espaces et autres caractères spéciaux par des _
        .replace(/_+/g, '_');  // Éviter les doubles _
};

const validateBlocksAndSeries = (blockData, cardFiles) => {
    const errors = [];
    for (const block of blockData.blocks) {
        const blockFileName = normalizeName(block.name) + '.json';
        if (!cardFiles.includes(blockFileName)) {
            errors.push(`Missing card file for block: ${block.name} (${blockFileName})`);
        } else {
            const seriesRawData = fs.readFileSync(path.join('./scripts', blockFileName));
            const seriesData = JSON.parse(seriesRawData);
            const seriesNames = seriesData.map(cardSet => normalizeName(cardSet.serie));

            for (const series of block.series) {
                if (!seriesNames.includes(normalizeName(series.name))) {
                    errors.push(`Missing series data for: ${series.name} in block file: ${blockFileName}`);
                }
            }
        }
    }
    return errors;
};

const importData = async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Successfully signed in as", user.email);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "admin") {
                const directoryPath = './scripts';
                const blockFiles = fs.readdirSync(directoryPath).filter(file => file.startsWith('PokemonFR') && file.endsWith('.json'));
                const cardFiles = fs.readdirSync(directoryPath).filter(file => !file.startsWith('PokemonFR') && file.endsWith('.json'));

                for (const blockFile of blockFiles) {
                    const blockRawData = fs.readFileSync(path.join(directoryPath, blockFile));
                    const blockData = JSON.parse(blockRawData);
                    const collectionName = blockFile.replace('.json', '');

                    const validationErrors = validateBlocksAndSeries(blockData, cardFiles);
                    if (validationErrors.length > 0) {
                        console.error("Validation errors found:");
                        validationErrors.forEach(error => console.error(error));
                        process.exit(1);
                    }

                    for (const block of blockData.blocks) {
                        const blockFileName = normalizeName(block.name) + '.json';
                        const seriesRawData = fs.readFileSync(path.join(directoryPath, blockFileName));
                        const seriesData = JSON.parse(seriesRawData);

                        for (const series of block.series) {
                            const seriesCards = seriesData.find(cardSet => normalizeName(cardSet.serie) === normalizeName(series.name));
                            if (seriesCards) {
                                series.cards = seriesCards.cartes;
                            }
                        }
                    }

                    await addLanguageWithBlocks(collectionName, blockData.language, blockData.nameTCG, blockData.blocks);
                }
                console.log("All data added successfully");
            } else {
                console.error("Error: User does not have admin privileges.");
            }
        } else {
            console.error("Error: User document does not exist.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error signing in or adding data: ", error);
        process.exit(1);
    }
};

importData();

