/**
 * Filter App
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './src/Theme/GlobalTheme';
import { AuthProvider, useAuth } from './src/Context/AuthContext';
import { LanguageProvider, useLanguage } from './src/Context/LanguageContext';
import { MainApp } from './src/Navigation/Navigation';
import { LanguageScreen } from './src/Screens/LanguageScreen';
import { AuthScreen } from './src/Screens/AuthScreen';
import { SplashScreen } from './src/Screens/Common/SplashScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { theme, isDarkMode } = useTheme();
  const { isLanguageSelected, setLanguageSelected } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 Splash always first
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // 🔥 Language gate
  if (!isLanguageSelected) {
    return <LanguageScreen onSelect={() => setLanguageSelected(true)} />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {isAuthenticated ? <MainApp /> : <AuthScreen />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}


export default App;
