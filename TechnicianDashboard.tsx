/**
 * Technician Dashboard with Bottom Tab Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from 'react-i18next';
import { TechnicianHomeScreen } from './screens/TechnicianHomeScreen';
import { TechnicianOrdersScreen } from './screens/TechnicianOrdersScreen';
import { TechnicianServicesScreen } from './screens/TechnicianServicesScreen';
import { TechnicianSettingsScreen } from './screens/TechnicianSettingsScreen';

import { useTheme } from './App';

const Tab = createBottomTabNavigator();

interface TechnicianDashboardProps {
    onLogout?: () => void;
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: theme.tint,
                    tabBarInactiveTintColor: theme.subText,
                    tabBarStyle: {
                        backgroundColor: theme.tabBarBackground,
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                        elevation: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        borderTopWidth: 0,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                    headerShown: false,
                }}>
                <Tab.Screen
                    name="Home"
                    component={TechnicianHomeScreen}
                    options={{
                        tabBarLabel: t('common.welcome'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Jobs"
                    component={TechnicianOrdersScreen}
                    options={{
                        tabBarLabel: t('orders.title'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="clipboard-text-clock" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Services"
                    component={TechnicianServicesScreen}
                    options={{
                        tabBarLabel: t('products.services'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="hammer-wrench" size={size} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    options={{
                        tabBarLabel: t('settings.settings_title'),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-cog" size={size} color={color} />
                        ),
                    }}
                >
                    {(props) => <TechnicianSettingsScreen {...props} onLogout={onLogout} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
