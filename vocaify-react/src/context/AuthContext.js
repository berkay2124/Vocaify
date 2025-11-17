import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

/**
 * AuthContext'i kullanmak için custom hook
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

/**
 * Authentication Provider Component
 * Kullanıcı giriş/çıkış/kayıt işlemlerini yönetir
 */
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Yeni kullanıcı kaydı oluşturur
     * @param {string} email - Kullanıcı email
     * @param {string} password - Kullanıcı şifresi
     * @param {string} displayName - Kullanıcı adı
     */
    async function signup(email, password, displayName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Kullanıcı profil ismini güncelle
        if (displayName) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            });
        }

        return userCredential;
    }

    /**
     * Kullanıcı girişi yapar
     * @param {string} email - Kullanıcı email
     * @param {string} password - Kullanıcı şifresi
     */
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    /**
     * Kullanıcı çıkışı yapar
     */
    function logout() {
        return signOut(auth);
    }

    // Auth state değişikliklerini dinle
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
