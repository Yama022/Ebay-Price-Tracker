// Dans un fichier nommé AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    user: UserType | null; // Utilisez le type UserType ici
    login: (username: string, password: string) => void;
    logout: () => void;
}

interface UserType {
    uid: any;
    username: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);

    const login = (username: string, password: string) => {
        // Exemple: Générer un UID fictif ou utiliser une logique pour obtenir un UID réel
        const uid = "N7xpYrIDQGOqfn2Ym397nIoT49j1"; // Cette valeur devrait être générée ou récupérée de manière appropriée
        setUser({ uid, username });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};