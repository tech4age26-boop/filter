import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../Theme/GlobalTheme';
import { CustomerHomeScreen } from '../Screens/CustomerHomeScreen';
import { CustomerFindScreen } from '../Screens/CustomerFindScreen';
import { CustomerOrdersScreen } from '../Screens/CustomerOrdersScreen';
import { CustomerSettingsScreen } from '../Screens/CustomerSettingsScreen';
import { CustomerMenuScreen } from '../Screens/CustomerMenuScreen';
import {
    NotificationsScreen,
    EditProfileScreen,
    PaymentMethodsScreen,
    SupportScreen,
    WalletScreen
} from '../Screens/CustomerSecondaryScreens';
import { useAuth } from '../Context/AuthContext';
import { View } from 'react-native';
import { AuthScreen } from '../Screens/AuthScreen';
import { ForgotPasswordScreen } from '../Screens/ForgotPasswordScreen';
import { VerifyOtpScreen } from '../Screens/VerifyOtpScreen';
import { PendingApprovalScreen } from '../Screens/PendingApprovalScreen';

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

export function RootNavigator() {
    const { isAuthenticated, isPending } = useAuth();
    console.log('RootNavigator: isAuthenticated =', isAuthenticated, 'isPending =', isPending);

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {isAuthenticated ? (
                        isPending ? (
                            // Pending Group
                            <Stack.Group>
                                <Stack.Screen name="PendingApproval" component={PendingApprovalScreen} />
                            </Stack.Group>
                        ) : (
                            // Main App Group
                            <Stack.Group>
                                <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
                                <Stack.Screen name="CustomerMenu" component={CustomerMenuScreen} />
                                <Stack.Screen name="Orders" component={CustomerOrdersScreen} />
                                <Stack.Screen name="Wallet" component={WalletScreen} />
                                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                                <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
                                <Stack.Screen name="Support" component={SupportScreen} />
                            </Stack.Group>
                        )
                    ) : (
                        // Auth Group
                        <Stack.Group>
                            <Stack.Screen name="Auth" component={AuthScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
                        </Stack.Group>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}
