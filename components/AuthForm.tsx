import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebaseConfig.mjs';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Button, NavbarItem, Link } from "@nextui-org/react";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {Avatar} from "@nextui-org/react";
import styles from '../styles/AuthForm.module.scss';

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.firstName);
                }
            } else {
                setUser(null);
                setUserName('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Enregistrer les informations utilisateur dans Firestore avec un rôle par défaut
                await setDoc(doc(db, 'users', user.uid), {
                    firstName,
                    lastName,
                    birthDate,
                    email,
                    role: 'user'  // Rôle par défaut
                });

                setUserName(firstName);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.firstName);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className={styles.authForm}>
            {user ? (
                <>
                    <NavbarItem>
                        <Link href="/profile">
                            <Avatar showFallback name={userName} src='https://images.unsplash.com/broken' />
                        </Link>
                    </NavbarItem>
                    
                    <Button onClick={handleLogout} size='sm' className={styles.logoutButton}>Déconnexion</Button>
                </>
            ) : (
                <>
                    <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                    <form onSubmit={handleAuth}>
                        {isSignUp && (
                            <>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <input
                                    type="date"
                                    placeholder="Birth Date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </>
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
                    </form>
                    <button onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </button>
                </>
            )}
        </div>
    );
};

export default AuthForm;
