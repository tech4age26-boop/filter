/**
 * Filter App - Unified Login/Signup Screens
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
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../Config/config';
import { useAuth } from '../Context/AuthContext';
import { save } from '../Utils/reuabsle';
import { ShiningLoader } from '../components/ShiningLoader';
import RNRestart from 'react-native-restart';

export function AuthScreen() {
    const { login, fetchUserData } = useAuth();
    const navigation = useNavigation<any>();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Login states
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup states
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCooperative, setIsCooperative] = useState(false);



    // Production Vercel URL
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const insets = useSafeAreaInsets();

    const { t, i18n } = useTranslation();

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en';
        await i18n.changeLanguage(newLang);
        // Force reload to ensure all layout/text changes propagate, especially for RTL
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^\d{10,}$/.test(phone);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const handleLogin = async () => {
        if (!loginIdentifier || !loginPassword) {
            showError(t('auth.error_fill_fields'));
            return;
        }

        const isEmail = loginIdentifier.includes('@');
        if (isEmail && !validateEmail(loginIdentifier)) {
            showError("Please enter a valid email address");
            return;
        }
        if (!isEmail && !/^\d+$/.test(loginIdentifier)) {
            showError("Please enter a valid email or mobile number");
            return;
        }

        setIsLoading(true);
        try {
            const payload: any = {
                password: loginPassword,
            };

            if (isEmail) {
                payload['email'] = loginIdentifier;
            } else {
                payload['phone'] = loginIdentifier;
            }

            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                showError(t('auth.error_server'));
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            if (data.success) {
                if (data.user.type !== 'customer') {
                    showError('Access denied: Not a customer account.');
                    return;
                }

                let userData = data.user;

                // Fetch fresh data to ensure status is up-to-date
                try {
                    const userId = userData.id || userData._id;
                    const freshData = await fetchUserData(userId);
                    console.log("Fresh login data:", freshData);

                    if (freshData.success && freshData.customer) {
                        userData = {
                            ...userData,
                            ...freshData.customer,
                            id: freshData.customer._id || freshData.customer.id || userId,
                            status: freshData.customer.status,
                        };
                    }
                } catch (err) {
                    console.error("Error fetching fresh user data after login:", err);
                }

                await save('user_data', userData);
                await login(userData);
            }

        } catch (error: any) {
            console.error('Login Error:', error);
            showError(t('auth.error_connection'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name || !phone || !password || !confirmPassword) {
            showError('Please fill all required fields');
            return;
        }

        if (email && !validateEmail(email)) {
            showError("Please enter a valid email address");
            return;
        }

        if (!validatePhone(phone)) {
            showError("Mobile number must be at least 10 digits");
            return;
        }

        if (!validatePassword(password)) {
            showError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/register-customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    password,
                    isCooperative,
                }),
            });

            const data = await response.json();
            if (data.success) {
                const userId = data.customerId || data.customer?._id;
                let userData = {
                    id: userId,
                    type: 'customer',
                    name: data.customer?.name,
                    phone: data.customer?.phone,
                    email: data.customer?.email,
                };

                try {
                    const freshData = await fetchUserData(userId);
                    console.log("Fresh registration data:", freshData);
                    if (freshData.success && freshData.customer) {
                        userData = {
                            ...userData,
                            ...freshData.customer,
                            id: freshData.customer._id || freshData.customer.id || userId,
                            status: freshData.customer.status,
                        };
                    }
                } catch (err) {
                    console.error("Error fetching fresh user data after register:", err);
                }

                await save('user_data', userData);
                await login(userData);

            } else {
                showError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            showError('Network request failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/car_workshop.png')}
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

                    {/* Logo Section */}
                    <View style={authStyles.logoContainer}>
                        <View style={authStyles.logoBadge}>
                            <Text style={authStyles.logoText}>FILTER</Text>
                        </View>
                        <Text style={authStyles.tagline}>{t('auth.tagline')}</Text>
                    </View>

                    {/* Language Toggle - Floating Top Right */}
                    <TouchableOpacity
                        style={authStyles.languageButton}
                        onPress={toggleLanguage}
                    >
                        <Text style={authStyles.languageButtonText}>
                            {i18n.language === 'en' ? 'Ar' : 'En'}
                        </Text>
                    </TouchableOpacity>

                    {/* Tab Switcher */}
                    <View style={authStyles.tabContainer}>
                        <TouchableOpacity
                            style={[authStyles.tab, isLogin && authStyles.activeTab]}
                            onPress={() => setIsLogin(true)}>
                            <Text style={[authStyles.tabText, isLogin && authStyles.activeTabText]}>{t('common.login')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[authStyles.tab, !isLogin && authStyles.activeTab]}
                            onPress={() => setIsLogin(false)}>
                            <Text style={[authStyles.tabText, !isLogin && authStyles.activeTabText]}>{t('common.register')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Content */}
                    <View style={authStyles.formContainer}>
                        {isLogin ? (
                            <>
                                {/* Login Form */}
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="account-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.email_or_phone')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        autoCapitalize="none"
                                        value={loginIdentifier}
                                        onChangeText={setLoginIdentifier}
                                    />
                                </View>
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.password')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        secureTextEntry={!showPassword}
                                        value={loginPassword}
                                        onChangeText={setLoginPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
                                        <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8E8E93" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={authStyles.forgotPassword} onPress={() => navigation.navigate("ForgotPassword")}>
                                    <Text style={authStyles.forgotPasswordText}>{t('auth.forgot_password')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={authStyles.continueButton} onPress={handleLogin} disabled={isLoading}>
                                    <Text style={authStyles.continueButtonText}>{isLoading ? t('common.loading') : t('auth.logging_in')}</Text>
                                    <MaterialCommunityIcons name={i18n.language === 'ar' ? "arrow-left" : "arrow-right"} size={20} color="#1C1C1E" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                {/* Signup Form */}
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="account-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('registration.full_name')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="phone-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.mobile')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="email-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.email')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="lock-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.password')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
                                        <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8E8E93" />
                                    </TouchableOpacity>
                                </View>
                                <View style={authStyles.inputContainer}>
                                    <MaterialCommunityIcons name="lock-check-outline" size={20} color="#8E8E93" style={authStyles.inputIcon} />
                                    <TextInput
                                        placeholder={t('auth.confirm_password')}
                                        placeholderTextColor="#8E8E93"
                                        style={authStyles.input}
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={authStyles.eyeIcon}>
                                        <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#8E8E93" />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={authStyles.checkboxContainer}
                                    onPress={() => setIsCooperative(!isCooperative)}
                                    activeOpacity={0.7}
                                >

                                    <View style={{ borderColor: '#F4C430', borderWidth: 1, backgroundColor: isCooperative ? '#F4C430' : '#FFFFFF', borderRadius: 4, padding: 0 }}>
                                        <MaterialCommunityIcons
                                            name={"check"}
                                            color={"#FFFFFF"}
                                            size={20}
                                        />
                                    </View>
                                    <Text style={authStyles.checkboxLabel}>{t('auth.are_you_cooperative')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={authStyles.continueButton} onPress={handleRegister} disabled={isLoading}>
                                    <Text style={authStyles.continueButtonText}>{isLoading ? t('common.loading') : t('auth.signing_up')}</Text>
                                    <MaterialCommunityIcons name={i18n.language === 'ar' ? "arrow-left" : "arrow-right"} size={20} color="#1C1C1E" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* <View style={authStyles.dividerContainer}>
                        <View style={authStyles.dividerLine} />
                        <Text style={authStyles.dividerText}>OR CONTINUE WITH</Text>
                        <View style={authStyles.dividerLine} />
                    </View>

                    <View style={authStyles.socialContainer}>
                        <TouchableOpacity style={authStyles.socialButton}>
                            <MaterialCommunityIcons name="google" size={22} color="#DB4437" />
                            <Text style={authStyles.socialButtonText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={authStyles.socialButton}>
                            <MaterialCommunityIcons name="apple" size={22} color="#000000" />
                            <Text style={authStyles.socialButtonText}>Apple</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={authStyles.technicianLink}>
                        <Text style={authStyles.technicianText}>
                            Are you a technician? <Text style={authStyles.technicianLinkText}>Apply here</Text>
                        </Text>
                    </TouchableOpacity> */}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Error Modal */}
            <Modal
                transparent
                visible={errorModalVisible}
                animationType="fade"
                onRequestClose={() => setErrorModalVisible(false)}
            >
                <View style={authStyles.modalOverlay}>
                    <View style={authStyles.errorModalContent}>
                        <View style={authStyles.errorIconContainer}>
                            <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#FF3B30" />
                        </View>
                        <Text style={authStyles.errorModalTitle}>Error</Text>
                        <Text style={authStyles.errorModalMessage}>{errorMessage}</Text>
                        <TouchableOpacity
                            style={authStyles.errorModalButton}
                            onPress={() => setErrorModalVisible(false)}
                        >
                            <Text style={authStyles.errorModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Loading Overlay */}
            <ShiningLoader visible={isLoading} />
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
        marginBottom: 20,
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
    technicianLink: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    technicianText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    technicianLinkText: {
        color: '#F4C430',
        fontWeight: '600',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingCard: {
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    errorIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    errorModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    errorModalMessage: {
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    errorModalButton: {
        backgroundColor: '#F4C430',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    errorModalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 4,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#28282bff',
    },
    languageButton: {
        position: 'absolute',
        top: 30, // Adjust based on insets if needed, but safe area handles general container
        right: 20,
        backgroundColor: '#F4C430',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 10,
    },
    languageButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
});
