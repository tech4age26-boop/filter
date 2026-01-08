/**
 * Filter App
 *
 * @format
 */

import React, { useState, createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageScreen } from './screens/LanguageScreen';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  ImageSourcePropType,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthScreen } from './AuthScreen';

// --- Theme System ---

const lightTheme = {
  mode: 'light',
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

const darkTheme = {
  mode: 'dark',
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

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => { },
  isDarkMode: false,
});

export const AuthContext = createContext({
  logout: () => { },
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useAuth() {
  return useContext(AuthContext);
}

// --- App Root ---

function App(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  if (isLanguageSelected === null) {
    return <View style={{ flex: 1, backgroundColor: '#121212' }} />;
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      <SafeAreaProvider>
        <AuthContext.Provider value={{ logout }}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={theme.background}
          />
          {!isLanguageSelected ? (
            <LanguageScreen onSelect={() => setIsLanguageSelected(true)} />
          ) : isAuthenticated ? (
            <MainApp />
          ) : (
            <AuthScreen onLogin={() => setIsAuthenticated(true)} />
          )}
        </AuthContext.Provider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

// --- Navigation ---
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CustomerHomeScreen } from './screens/CustomerHomeScreen';
import { CustomerFindScreen } from './screens/CustomerFindScreen';
import { CustomerOrdersScreen } from './screens/CustomerOrdersScreen';
import { CustomerSettingsScreen } from './screens/CustomerSettingsScreen';
import { CustomerMenuScreen } from './screens/CustomerMenuScreen';
import {
  NotificationsScreen,
  EditProfileScreen,
  PaymentMethodsScreen,
  SupportScreen,
  WalletScreen
} from './screens/CustomerSecondaryScreens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomerTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Find') {
            iconName = 'magnify';
          } else if (route.name === 'Orders') {
            iconName = 'clipboard-list-outline';
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerHomeScreen} />
      <Tab.Screen name="Find" component={CustomerFindScreen} />
      <Tab.Screen name="Settings" component={CustomerSettingsScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
        <Stack.Screen name="CustomerMenu" component={CustomerMenuScreen} />
        <Stack.Screen name="Orders" component={CustomerOrdersScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;