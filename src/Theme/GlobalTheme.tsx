import React, { createContext, useContext, useState, ReactNode } from 'react';

// Light Theme
export const lightTheme = {
    mode: 'light' as const,
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    text: '#1C1C1E',
    subText: '#8E8E93',
    border: '#F0F0F0',
    iconColor: '#1C1C1E',
    tabBarBackground: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputPlaceholder: '#C7C7CD',
    tint: '#F4C430',
    success: '#2ECC71',
    tagBg: '#E8F1FF',
    tagText: '#007AFF',
};

// Dark Theme
export const darkTheme = {
    mode: 'dark' as const,
    background: '#121212',
    cardBackground: '#1E1E1E',
    text: '#FFFFFF',
    subText: '#A1A1AA',
    border: '#333333',
    iconColor: '#FFFFFF',
    tabBarBackground: '#1E1E1E',
    inputBackground: '#2C2C2E',
    inputPlaceholder: '#A1A1AA',
    tint: '#F4C430',
    success: '#2ECC71',
    tagBg: '#1A2A40',
    tagText: '#4DA3FF',
};

export type Theme = typeof lightTheme | typeof darkTheme;

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    toggleTheme: () => { },
    isDarkMode: false,
});

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}
