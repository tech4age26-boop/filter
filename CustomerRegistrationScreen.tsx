/**
 * Customer Registration Screen
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Production Vercel URL
const API_BASE_URL = 'https://filter-server.vercel.app';
// const API_BASE_URL = 'http://10.0.2.2:5000'; // LOCAL DEBUGGING

interface CustomerRegistrationScreenProps {
    onBack: () => void;
    onRegister: () => void;
}

export function CustomerRegistrationScreen({ onBack, onRegister }: CustomerRegistrationScreenProps) {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !phone || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
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
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store user data in local storage
                const userData = {
                    id: data.customerId || data.customer?._id,
                    type: 'customer',
                    name: data.customer?.name,
                    phone: data.customer?.phone,
                    email: data.customer?.email,
                };
                await AsyncStorage.setItem('user_data', JSON.stringify(userData));

                Alert.alert('Success', 'Account created successfully!');
                onRegister();
            } else {
                Alert.alert('Error', data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration Error:', error);
            Alert.alert('Error', 'Network request failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('./assets/car_workshop.png')}
            style={styles.background}
            blurRadius={2}>

            {/* Semi-transparent yellow overlay for theme */}
            <View style={styles.overlay} />

            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1C1C1E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('auth.signup_title')}</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}>

                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Customer Details</Text>

                        {/* Name */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="account-outline" size={20} color="#F4C430" style={styles.inputIcon} />
                            <TextInput
                                placeholder={t('registration.full_name')}
                                placeholderTextColor="#8E8E93"
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Phone */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="phone-outline" size={20} color="#F4C430" style={styles.inputIcon} />
                            <TextInput
                                placeholder={t('auth.mobile')}
                                placeholderTextColor="#8E8E93"
                                style={styles.input}
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                        {/* Email (Optional) */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" size={20} color="#F4C430" style={styles.inputIcon} />
                            <TextInput
                                placeholder={`${t('auth.email')} (Optional)`}
                                placeholderTextColor="#8E8E93"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-outline" size={20} color="#F4C430" style={styles.inputIcon} />
                            <TextInput
                                placeholder={t('auth.password')}
                                placeholderTextColor="#8E8E93"
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#F4C430" />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-check-outline" size={20} color="#F4C430" style={styles.inputIcon} />
                            <TextInput
                                placeholder={t('auth.confirm_password')}
                                placeholderTextColor="#8E8E93"
                                style={styles.input}
                                secureTextEntry={!showConfirmPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <MaterialCommunityIcons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#F4C430" />
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={isLoading}>
                            {isLoading ? (
                                <Text style={styles.submitButtonText}>{t('common.loading')}</Text>
                            ) : (
                                <Text style={styles.submitButtonText}>{t('common.register')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // White overlay with opacity to show background faintly
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F4C430', // Yellow border for theme
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
    },
    eyeIcon: {
        padding: 8,
    },
    submitButton: {
        backgroundColor: '#F4C430', // Primary Yellow
        borderRadius: 12,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        shadowColor: 'rgba(244, 196, 48, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        color: '#1C1C1E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
