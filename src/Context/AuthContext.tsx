import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
    loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🔥 Restore login on app start
    useEffect(() => {
        const loadAuth = async () => {
            const user = await AsyncStorage.getItem('user_data');
            setIsAuthenticated(!!user);
            setLoading(false);
        };

        loadAuth();
    }, []);

    const login = async (userData: any) => {
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('user_data');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
