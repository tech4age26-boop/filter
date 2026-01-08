
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../App';
import { SettingsItem } from '../components/CustomerComponents';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export function CustomerMenuScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: theme.background }}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('menu.title')}</Text>
            </View>

            <View style={styles.listPadding}>
                <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                    <SettingsItem
                        icon="wallet-outline"
                        label={t('menu.wallet')}
                        onPress={() => navigation.navigate('Wallet')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingsItem
                        icon="clipboard-list-outline"
                        label={t('menu.my_orders')}
                        onPress={() => navigation.navigate('Orders')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingsItem
                        icon="bell-outline"
                        label={t('menu.notifications')}
                        onPress={() => navigation.navigate('Notifications')}
                    />
                </View>

                <Text style={[styles.headerText, { color: theme.subText }]}>{t('menu.more').toUpperCase()}</Text>
                <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
                    <SettingsItem
                        icon="help-circle-outline"
                        label={t('menu.support')}
                        onPress={() => navigation.navigate('Support')}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: 10,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listPadding: {
        padding: 20,
    },
    headerText: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        marginLeft: 56,
    },
});
