import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { DEFAULT_ROLE } from '../data/roles';

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
     * Kullanıcı role bilgisini Firestore'dan yükler
     * @param {Object} user - Firebase Auth user objesi
     * @returns {Object} Role bilgisi eklenmiş user objesi
     */
    async function loadUserRole(user) {
        if (!user) return null;

        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    ...user,
                    role: userData.role || DEFAULT_ROLE,
                    department: userData.department || null,
                    permissions: userData.permissions || []
                };
            } else {
                // Eğer Firestore'da kullanıcı yoksa default role ile oluştur
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName,
                    role: DEFAULT_ROLE,
                    department: null,
                    permissions: [],
                    createdAt: new Date().toISOString()
                });

                return {
                    ...user,
                    role: DEFAULT_ROLE,
                    department: null,
                    permissions: []
                };
            }
        } catch (error) {
            console.error('Role yükleme hatası:', error);
            return {
                ...user,
                role: DEFAULT_ROLE,
                department: null,
                permissions: []
            };
        }
    }

    /**
     * Yeni kullanıcı kaydı oluşturur
     * @param {string} email - Kullanıcı email
     * @param {string} password - Kullanıcı şifresi
     * @param {string} displayName - Kullanıcı adı
     * @param {string} role - Kullanıcı rolü (opsiyonel)
     */
    async function signup(email, password, displayName, role = DEFAULT_ROLE) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Kullanıcı profil ismini güncelle
        if (displayName) {
            await updateProfile(userCredential.user, {
                displayName: displayName
            });
        }

        // Firestore'a kullanıcı bilgilerini kaydet
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
            email: email,
            displayName: displayName,
            role: role,
            department: null,
            permissions: [],
            createdAt: new Date().toISOString()
        });

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

    // Auth state değişikliklerini dinle ve role bilgisini yükle
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Role bilgisini Firestore'dan yükle
                const userWithRole = await loadUserRole(user);
                setCurrentUser(userWithRole);
            } else {
                setCurrentUser(null);
            }
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
