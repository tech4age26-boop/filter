import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
    isLanguageSelected: boolean | null;
    setLanguageSelected: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    isLanguageSelected: null,
    setLanguageSelected: () => { },
});

export function useLanguage() {
    return useContext(LanguageContext);
}

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [isLanguageSelected, setIsLanguageSelected] = useState<boolean | null>(null);

    useEffect(() => {
        checkLanguageSelection();
    }, []);

    const checkLanguageSelection = async () => {
        try {
            const selected = await AsyncStorage.getItem('has-selected-language');
            setIsLanguageSelected(selected === 'true');
        } catch (error) {
            setIsLanguageSelected(false);
        }
    };

    const setLanguageSelected = async (selected: boolean) => {
        try {
            await AsyncStorage.setItem('has-selected-language', selected.toString());
            setIsLanguageSelected(selected);
        } catch (error) {
            console.error('Error saving language selection:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ isLanguageSelected, setLanguageSelected }}>
            {children}
        </LanguageContext.Provider>
    );
}
