/**
 * Filter App - Login/Signup Screens
 *
 * @format
 */

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RegistrationScreen } from './RegistrationScreen';
import { CustomerRegistrationScreen } from './CustomerRegistrationScreen';
import { ProviderDashboard } from './ProviderDashboard';
import { TechnicianDashboard } from './TechnicianDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthScreenProps {
    onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [showCustomerRegistration, setShowCustomerRegistration] = useState(false);
    const [dashboardType, setDashboardType] = useState<'provider' | 'technician' | null>(null);
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('owner'); // owner, cashier, technician, freelancer
    const [showRoleSelector, setShowRoleSelector] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Production Vercel URL
    const API_BASE_URL = 'https://filter-server.vercel.app';

    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    if (dashboardType === 'provider') {
        return <ProviderDashboard onLogout={() => setDashboardType(null)} />;
    }

    if (dashboardType === 'technician') {
        return <TechnicianDashboard onLogout={() => setDashboardType(null)} />;
    }

    const handleRegisterSuccess = async () => {
        try {
            const data = await AsyncStorage.getItem('user_data');
            if (data) {
                const user = JSON.parse(data);
                if (user.type === 'individual') {
                    setDashboardType('technician');
                } else if (user.type === 'customer') {
                    onLogin(); // Tell App.tsx to switch to MainApp
                } else {
                    setDashboardType('provider');
                }
            }
        } catch (e) {
            console.error(e);
        }
        setShowRegistration(false);
        setShowCustomerRegistration(false);
    };

    const handleLogin = async () => {
        if (!loginIdentifier || !loginPassword) {
            Alert.alert(t('common.error'), t('auth.error_fill_fields'));
            return;
        }

        setIsLoading(true);
        try {
            const isEmail = loginIdentifier.includes('@');
            const payload: any = {
                password: loginPassword,
            };

            if (isEmail) {
                payload['email'] = loginIdentifier;
            } else {
                payload['phone'] = loginIdentifier;
            }

            // If on Provider tab, send role
            if (!isLogin) {
                payload['role'] = selectedRole;
                console.log('Provider login with role:', selectedRole);
            }

            console.log('Login attempt:', {
                identifier: loginIdentifier,
                role: selectedRole,
                isProvider: !isLogin
            });

            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('Login response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Login failed with status:', response.status, errorText);
                Alert.alert(t('common.error'), t('auth.error_server'));
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            console.log('Login response data:', data);

            if (data.success) {
                await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

                if (data.user.type === 'customer') {
                    onLogin();
                } else if (data.user.type === 'individual') {
                    setDashboardType('technician');
                } else {
                    setDashboardType('provider');
                }
            } else {
                Alert.alert(t('auth.login_failed'), data.message || t('auth.error_invalid_credentials'));
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            console.error('Error details:', error.message);

            if (error.message === 'Network request failed') {
                Alert.alert(
                    t('auth.error_connection'),
                    t('auth.error_connection_msg')
                );
            } else {
                Alert.alert(
                    t('common.error'),
                    t('auth.error_generic') + '\n\n' + error.message
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (showRegistration) {
        return <RegistrationScreen
            onBack={() => setShowRegistration(false)}
            onRegister={handleRegisterSuccess}
        />;
    }

    if (showCustomerRegistration) {
        return <CustomerRegistrationScreen
            onBack={() => setShowCustomerRegistration(false)}
            onRegister={handleRegisterSuccess}
        />;
    }

    return (
        <ImageBackground
            source={require('./assets/car_workshop.png')}
            style={authStyles.background}
            blurRadius={5}>
            <View style={authStyles.overlay} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={authStyles.container}>
                <ScrollView
                    contentContainerStyle={[
                        authStyles.scrollContent,
                        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}>
                    {/* Logo */}
                    <View style={authStyles.logoContainer}>
                        <View style={authStyles.logoBadge}>
                            <Text style={authStyles.logoText}>FILTER</Text>
                        </View>
                        <Text style={authStyles.tagline}>Your Trusted Auto Service Partner</Text>
                    </View>

                    {/* Tab Switcher */}
                    <View style={authStyles.tabContainer}>
                        <TouchableOpacity
                            style={[authStyles.tab, isLogin && authStyles.activeTab]}
                            onPress={() => setIsLogin(true)}>
                            <Text
                                style={[
                                    authStyles.tabText,
                                    isLogin && authStyles.activeTabText,
                                ]}>
                                Customer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[authStyles.tab, !isLogin && authStyles.activeTab]}
                            onPress={() => setIsLogin(false)}>
                            <Text
                                style={[
                                    authStyles.tabText,
                                    !isLogin && authStyles.activeTabText,
                                ]}>
                                Service Provider
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={authStyles.formContainer}>
                        {/* Input Fields - Show for both tabs now (Customer and Provider Login) */}
                        <View style={authStyles.inputContainer}>
                            <MaterialCommunityIcons
                                name={isLogin ? "account-outline" : "phone-outline"}
                                size={20}
                                color="#8E8E93"
                                style={authStyles.inputIcon}
                            />
                            <TextInput
                                placeholder={isLogin ? 'Email or Mobile Number' : 'Mobile Number'}
                                placeholderTextColor="#8E8E93"
                                style={authStyles.input}
                                autoCapitalize="none"
                                keyboardType={!isLogin ? 'phone-pad' : 'default'}
                                value={loginIdentifier}
                                onChangeText={setLoginIdentifier}
                            />
                        </View>

                        {/* Role Selector - Only for Provider Tab (Dropdown Style) */}


                        {/* Role Dropdown Options */}

                        {/* Password */}
                        {!isLogin && showRoleSelector && (
                            <View style={authStyles.roleDropdown}>
                                {['owner', 'cashier', 'technician', 'freelancer'].map((role) => (
                                    <TouchableOpacity
                                        key={role}
                                        style={[
                                            authStyles.roleOption,
                                            selectedRole === role && authStyles.roleOptionSelected
                                        ]}
                                        onPress={() => {
                                            setSelectedRole(role);
                                            setShowRoleSelector(false);
                                        }}>
                                        <Text style={[
                                            authStyles.roleOptionText,
                                            selectedRole === role && authStyles.roleOptionTextSelected
                                        ]}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </Text>
                                        {selectedRole === role && (
                                            <MaterialCommunityIcons name="check" size={18} color="#F4C430" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View style={authStyles.inputContainer}>
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color="#8E8E93"
                                style={authStyles.inputIcon}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor="#8E8E93"
                                style={authStyles.input}
                                secureTextEntry={!showPassword}
                                value={loginPassword}
                                onChangeText={setLoginPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={authStyles.eyeIcon}>
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color="#8E8E93"
                                />
                            </TouchableOpacity>
                        </View>
                        {!isLogin && (
                            <TouchableOpacity
                                style={authStyles.inputContainer}
                                onPress={() => setShowRoleSelector(!showRoleSelector)}>
                                <MaterialCommunityIcons
                                    name="account-star"
                                    size={20}
                                    color="#8E8E93"
                                    style={authStyles.inputIcon}
                                />
                                <Text style={[authStyles.input, { color: selectedRole ? '#1C1C1E' : '#8E8E93' }]}>
                                    {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : 'Select Role'}
                                </Text>
                                <MaterialCommunityIcons
                                    name={showRoleSelector ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#8E8E93"
                                />
                            </TouchableOpacity>
                        )}

                        {/* Forgot Password */}
                        <TouchableOpacity style={authStyles.forgotPassword}>
                            <Text style={authStyles.forgotPasswordText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={authStyles.continueButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={authStyles.continueButtonText}>
                                {isLoading ? 'Loading...' : 'Login'}
                            </Text>
                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={20}
                                color="#1C1C1E"
                            />
                        </TouchableOpacity>
                    </View>



                    {/* Footer Links */}
                    {isLogin ? (
                        <TouchableOpacity
                            style={authStyles.customerSignupButton}
                            onPress={() => setShowCustomerRegistration(true)}>
                            <Text style={{ color: '#8E8E93', marginRight: 4 }}>
                                New User?
                            </Text>
                            <Text style={authStyles.customerSignupText}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={authStyles.technicianLinkContainer}>
                            <TouchableOpacity
                                style={authStyles.technicianLink}
                                onPress={() => setShowRegistration(true)}>
                                <Text style={authStyles.technicianText}>
                                    Want to join as Provider?{' '}
                                    <Text style={authStyles.technicianLinkText}>Apply Here</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const authStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(240, 240, 245, 0.75)',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logoBadge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logoText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#F4C430',
        letterSpacing: 2,
    },
    tagline: {
        fontSize: 13,
        color: '#1C1C1E',
        fontWeight: 'bold',
    },
    customerSignupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    customerSignupText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F4C430',
        textDecorationLine: 'underline',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#F4C430',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8E8E93',
    },
    activeTabText: {
        color: '#1C1C1E',
    },
    formContainer: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1C1C1E',
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotPasswordText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    continueButton: {
        backgroundColor: '#F4C430',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        shadowColor: '#F4C430',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginRight: 8,
    },
    technicianLinkContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    technicianLink: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    technicianText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    technicianLinkText: {
        color: '#F4C430',
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        fontSize: 11,
        color: '#8E8E93',
        marginHorizontal: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    socialButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    roleContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    roleLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 8,
        marginLeft: 4,
    },
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 8,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    roleButtonActive: {
        backgroundColor: '#F4C430',
        borderColor: '#F4C430',
    },
    roleButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
    },
    roleButtonTextActive: {
        color: '#1C1C1E',
    },
    roleDropdown: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: -8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    roleOptionSelected: {
        backgroundColor: '#FFF9E6',
    },
    roleOptionText: {
        fontSize: 15,
        color: '#1C1C1E',
        fontWeight: '500',
    },
    roleOptionTextSelected: {
        color: '#F4C430',
        fontWeight: '600',
    },
});