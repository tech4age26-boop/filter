
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../Config/config';
import { ShiningLoader } from '../components/ShiningLoader';
import { useTranslation } from 'react-i18next';

export function VerifyOtpScreen({ route, navigation }: any) {
    const { t, i18n } = useTranslation();
    const { phone } = route.params;
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();



    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 4) {
            Alert.alert(t('common.error'), t('auth.verify_otp_invalid'));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert(t('common.success'), t('auth.verify_success'));
                // For now, just go back to login or simulate login
                // User requirement: "make sure you do both frontne and bavkend for that and for now otp teake stayic in backned to verify for now"
                // Doesn't specify what happens AFTER verify. Assuming reset password or login.
                // Let's go back to Login for simplicity as it wasn't specified.
                navigation.navigate('Auth');
            } else {
                Alert.alert(t('common.error'), data.message || t('auth.invalid_otp'));
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
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

                <Text style={styles.headerTitle}>{t('auth.verify_otp_title')}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>
                    {t('auth.verify_otp_desc')} {phone}
                </Text>

                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="lock-check-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                    <TextInput
                        placeholder="0000"
                        placeholderTextColor="#8E8E93"
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={4}
                        value={otp}
                        onChangeText={setOtp}
                        autoFocus
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleVerifyOtp}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{t('auth.verify_button')}</Text>
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
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
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
        letterSpacing: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 24,
        color: '#1C1C1E',
        letterSpacing: 8,
        textAlign: 'center',
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
