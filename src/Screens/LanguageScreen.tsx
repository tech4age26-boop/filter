import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    I18nManager,
    SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { useTranslation } from 'react-i18next';

interface LanguageScreenProps {
    onSelect: () => void;
}

export function LanguageScreen({ onSelect }: LanguageScreenProps) {
    const { i18n } = useTranslation();

    const selectLanguage = async (lang: string) => {
        const isRTL = lang === 'ar';

        // Save language preference
        await AsyncStorage.setItem('user-language', lang);
        await AsyncStorage.setItem('has-selected-language', 'true');

        // Change i18n language
        i18n.changeLanguage(lang);

        // Handle RTL layout flip if necessary
        if (I18nManager.isRTL !== isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);

            // Restart is required for layout flip to take effect
            setTimeout(() => {
                RNRestart.Restart();
            }, 100);
        } else {
            onSelect();
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/car_workshop.png')}
            style={styles.container}
            blurRadius={2}
        >
            <View style={styles.overlay} />
            <SafeAreaView style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="translate" size={60} color="#F4C430" />
                        <Text style={styles.title}>Filter</Text>
                    </View>
                    <Text style={styles.subtitle}>Choose your language</Text>
                    <Text style={styles.subtitleArabic}>اختر لغتك</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => selectLanguage('en')}
                    >
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonTitle}>English</Text>
                            <Text style={styles.buttonSubtitle}>Default Interface</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#F4C430" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { marginTop: 20 }]}
                        onPress={() => selectLanguage('ar')}
                    >
                        <View style={styles.buttonTextContainer}>
                            <Text style={styles.buttonTitle}>العربية</Text>
                            <Text style={styles.buttonSubtitle}>الواجهة العربية</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#F4C430" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>You can change this later in settings</Text>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        color: '#1C1C1E',
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle: {
        color: '#1C1C1E',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
    },
    subtitleArabic: {
        color: '#8E8E93',
        fontSize: 18,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonTextContainer: {
        flex: 1,
    },
    buttonTitle: {
        color: '#1C1C1E',
        fontSize: 22,
        fontWeight: 'bold',
    },
    buttonSubtitle: {
        color: '#8E8E93',
        fontSize: 14,
        marginTop: 4,
    },
    footer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        color: '#8E8E93',
        fontSize: 14,
    },
});
