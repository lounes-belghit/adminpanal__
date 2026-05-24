import React, { createContext, useContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

interface User {
    userId: number;
    email: string;
    role: 'user' | 'admin' | 'super_admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwt_decode(token);
                setUser({
                    userId: decoded.userId,
                    email: decoded.sub,
                    role: decoded.role || 'user'
                });
            } catch (error) {
                console.error('Invalid token', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded: any = jwt_decode(token);
        setUser({
            userId: decoded.userId,
            email: decoded.sub,
            role: decoded.role || 'user'
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAdmin = () => user?.role === 'admin' || user?.role === 'super_admin';
    const isSuperAdmin = () => user?.role === 'super_admin';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isSuperAdmin }}>
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
