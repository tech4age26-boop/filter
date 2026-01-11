import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../Config/config';

type AuthContextType = {
    isAuthenticated: boolean;
    isPending: boolean;
    userData: any;
    login: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    fetchUserData: (userId: string) => Promise<any>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isPending: false,
    userData: null,
    login: async () => { },
    logout: async () => { },
    fetchUserData: async () => ({}),
    loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔥 Restore login on app start
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const user = await AsyncStorage.getItem('user_data');
                const status = await AsyncStorage.getItem('user_status');

                if (user) {
                    setUserData(JSON.parse(user));
                }

                setIsPending(status === 'pending');
                setIsAuthenticated(!!user);
            } catch (e) {
                console.error("Failed to load auth status", e);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    const login = React.useCallback(async (userData: any) => {
        setUserData(userData);
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));

        if (userData.status === 'pending') {
            await AsyncStorage.setItem('user_status', 'pending');
            setIsPending(true);
            console.log("Pending Status Set: True");
        } else {
            // Ensure pending status is cleared if user is no longer pending
            await AsyncStorage.removeItem('user_status');
            setIsPending(false);
            console.log("Pending Status Set: False");
        }

        setIsAuthenticated(true);
    }, []);

    const logout = React.useCallback(async () => {
        await AsyncStorage.removeItem('user_data');
        await AsyncStorage.removeItem('user_status');
        setIsAuthenticated(false);
        setIsPending(false);
        setUserData(null);
    }, []);

    const fetchUserData = React.useCallback(async (userId: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/customer/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return { success: false, message: 'Network Error' };
        }
    }, []);

    const value = React.useMemo(() => ({
        isAuthenticated,
        isPending,
        userData,
        login,
        logout,
        fetchUserData,
        loading
    }), [isAuthenticated, isPending, userData, login, logout, fetchUserData, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
