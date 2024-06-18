import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
    const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUser(user);
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.firstName);
            }

            // Déconnexion automatique après 24 heures
            if (logoutTimer) {
            clearTimeout(logoutTimer);
            }
            const timer = setTimeout(() => {
            handleLogout();
            }, 24 * 60 * 60 * 1000); // 24 heures en millisecondes
            setLogoutTimer(timer);
        } else {
            setUser(null);
            setUserName('');
            if (logoutTimer) {
            clearTimeout(logoutTimer);
            }
        }
        });

        return () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
        unsubscribe();
        };
    }, [logoutTimer]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        if (isSignUp) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Enregistrer les informations utilisateur dans Firestore
            await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            birthDate,
            email
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
            <h2>Bienvenue, {userName}!</h2>
            <button onClick={handleLogout}>Déconnexion</button>
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
