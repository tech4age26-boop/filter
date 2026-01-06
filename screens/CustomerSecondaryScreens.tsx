import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

function GenericScreen({ title, children }: any) {
    const { theme } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
                <View style={{ width: 40 }} />
            </View>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

export function NotificationsScreen() {
    const { theme } = useTheme();
    return (
        <GenericScreen title="Notifications">
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="bell-off-outline" size={64} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>No new notifications</Text>
            </View>
        </GenericScreen>
    );
}

export function EditProfileScreen() {
    const { theme } = useTheme();
    return (
        <GenericScreen title="Edit Profile">
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="account-edit-outline" size={64} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>Edit Profile Content Here</Text>
            </View>
        </GenericScreen>
    );
}

export function PaymentMethodsScreen() {
    const { theme } = useTheme();
    return (
        <GenericScreen title="Payment Methods">
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="credit-card-outline" size={64} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>No payment methods added</Text>
            </View>
        </GenericScreen>
    );
}

export function SupportScreen() {
    const { theme } = useTheme();
    return (
        <GenericScreen title="Help & Support">
            <View style={styles.emptyState}>
                <MaterialCommunityIcons name="help-circle-outline" size={64} color={theme.subText} />
                <Text style={[styles.emptyText, { color: theme.subText }]}>How can we help you?</Text>
            </View>
        </GenericScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});
