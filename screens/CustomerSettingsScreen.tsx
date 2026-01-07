import React from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../App';
import { SettingsItem } from '../components/CustomerComponents';

import { useNavigation } from '@react-navigation/native';

export function CustomerSettingsScreen() {
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const navigation = useNavigation<any>();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ flex: 1, backgroundColor: theme.background }}>

            <View style={styles.header}>
                <Text style={[styles.sectionTitle, { fontSize: 24, color: theme.text }]}>Settings</Text>
            </View>

            <View style={styles.listPadding}>
                {/* Appearance Section */}
                <Text style={[styles.settingsHeader, { color: theme.subText }]}>APPEARANCE</Text>

                <View style={[styles.settingsCard, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.settingsRow}>
                        <View style={styles.settingsLeft}>
                            <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                                <MaterialCommunityIcons name="theme-light-dark" size={22} color={theme.text} />
                            </View>
                            <Text style={[styles.settingsLabel, { color: theme.text }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#767577", true: "#F4C430" }}
                            thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Account Section */}
                <Text style={[styles.settingsHeader, { color: theme.subText, marginTop: 24 }]}>ACCOUNT</Text>

                <View style={[styles.settingsCard, { backgroundColor: theme.cardBackground }]}>
                    <SettingsItem
                        icon="account"
                        label="Edit Profile"
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingsItem
                        icon="credit-card"
                        label="Payment Methods"
                        onPress={() => navigation.navigate('PaymentMethods')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingsItem
                        icon="bell"
                        label="Notifications"
                        onPress={() => navigation.navigate('Notifications')}
                    />
                </View>

                {/* More Section */}
                <Text style={[styles.settingsHeader, { color: theme.subText, marginTop: 24 }]}>MORE</Text>

                <View style={[styles.settingsCard, { backgroundColor: theme.cardBackground }]}>
                    <SettingsItem
                        icon="help-circle"
                        label="Help & Support"
                        onPress={() => navigation.navigate('Support')}
                    />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingsItem icon="logout" label="Log Out" color="#FF3B30" />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6,
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    settingsHeader: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    settingsCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    settingsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingsLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginLeft: 60,
    },
});
