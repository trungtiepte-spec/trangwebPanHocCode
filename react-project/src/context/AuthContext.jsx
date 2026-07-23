import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('examcore_current_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const getUsers = () => {
        try {
            const users = localStorage.getItem('examcore_users');
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    };

    const saveUsers = (users) => {
        localStorage.setItem('examcore_users', JSON.stringify(users));
    };

    const register = ({ fullName, email, password }) => {
        const users = getUsers();
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            return { success: false, error: 'An account with this email already exists.' };
        }
        const newUser = { id: Date.now(), fullName, email, password };
        saveUsers([...users, newUser]);
        return { success: true };
    };

    const login = ({ email, password, rememberMe }) => {
        const users = getUsers();
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
            return { success: false, error: 'Invalid email or password.' };
        }
        const userData = { id: user.id, fullName: user.fullName, email: user.email };
        setCurrentUser(userData);
        if (rememberMe) {
            localStorage.setItem('examcore_current_user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('examcore_current_user', JSON.stringify(userData));
        }
        return { success: true };
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('examcore_current_user');
        sessionStorage.removeItem('examcore_current_user');
    };

    // Restore session user on mount
    useEffect(() => {
        if (!currentUser) {
            try {
                const session = sessionStorage.getItem('examcore_current_user');
                if (session) setCurrentUser(JSON.parse(session));
            } catch {}
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
