
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, I18nManager } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../Config/config';
import { ShiningLoader } from '../components/ShiningLoader';
import { useTranslation } from 'react-i18next';

export function ForgotPasswordScreen({ navigation }: any) {
    const { t, i18n } = useTranslation();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();



    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            Alert.alert(t('common.error'), t('auth.enter_valid_mobile'));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert(t('common.success'), t('auth.otp_sent'));
                navigation.navigate('VerifyOtp', { phone });
            } else {
                Alert.alert(t('common.error'), data.message || t('auth.failed_send_otp'));
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
            Alert.alert(t('common.error'), t('auth.error_connection'));
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#1C1C1E" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{t('auth.forgot_password_title')}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    {t('auth.forgot_password_desc')}
                </Text>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="phone-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                        placeholder={t('auth.mobile')}
                        placeholderTextColor="#8E8E93"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSendOtp}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{t('auth.send_otp')}</Text>
                </TouchableOpacity>

                <ShiningLoader visible={isLoading} />
            </View>
        </View >

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomColor: '#F2F2F7',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] // Mirror back button for RTL if needed, but usually icon flip is enough or handled by library. Vector icons verify.
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    content: {
        padding: 24,
    },
    description: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 32,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
    },
    button: {
        backgroundColor: '#F4C430',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#F4C430',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
});
