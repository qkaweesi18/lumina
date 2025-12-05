import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    User
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    demoLogin: () => void;
    isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemoUser, setIsDemoUser] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!isDemoUser) {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [isDemoUser]);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            setIsDemoUser(false);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsDemoUser(false);
        } catch (error) {
            console.error("Error signing in with email", error);
            throw error;
        }
    };

    const signupWithEmail = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsDemoUser(false);
        } catch (error) {
            console.error("Error signing up with email", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (isDemoUser) {
                setUser(null);
                setIsDemoUser(false);
            } else {
                await signOut(auth);
            }
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const demoLogin = () => {
        // Create a fake user object for demo purposes
        const fakeUser: any = {
            uid: 'demo-user-123',
            displayName: 'Demo User',
            email: 'demo@example.com',
            photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
        };
        setUser(fakeUser);
        setIsDemoUser(true);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signInWithGoogle,
            loginWithEmail,
            signupWithEmail,
            logout,
            demoLogin,
            isDemoUser
        }}>
            {!loading && children}
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
