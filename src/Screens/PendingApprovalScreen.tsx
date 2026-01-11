
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../Context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { save, get } from '../Utils/reuabsle';
import { useState, useEffect } from 'react';
import { ShiningLoader } from '../components/ShiningLoader';

export function PendingApprovalScreen() {
    const { logout, login, fetchUserData, userData } = useAuth();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

    const userId = userData?.id || userData?._id;

    // useEffect(() => {
    //     let intervalId: ReturnType<typeof setInterval>;

    //     const checkStatus = async () => {
    //         if (!userId) return;

    //         try {
    //             const response = await fetchUserData(userId);

    //             // Use the fresh customer data from response
    //             if (response.success && response.customer) {
    //                 const newStatus = response.customer.status;

    //                 if (newStatus !== 'pending') {
    //                     console.log("Status changed to:", newStatus);
    //                     // Status changed! Update using FRESH data from API
    //                     const updatedUser = {
    //                         ...response.customer,
    //                         id: response.customer._id || response.customer.id // Ensure ID presence
    //                     };
    //                     await login(updatedUser);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Status check failed", error);
    //         }
    //     };

    //     // Check immediately
    //     checkStatus();

    //     // Poll every 5 seconds
    //     intervalId = setInterval(checkStatus, 5000);

    //     return () => clearInterval(intervalId);
    // }, [login, userId, fetchUserData]);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            // Clear pending status if needed, but mainly just logout
            await save('user_status', null);
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={80} color="#F4C430" />
                </View>
                <Text style={styles.title}>Approval Pending</Text>
                <Text style={styles.message}>
                    Your account is currently under review. Please wait for an administrator to approve your cooperative status.
                </Text>
                <Text style={styles.subMessage}>
                    This process may take up to 24-48 hours. Thank you for your patience.
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogout} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? 'Logging Out...' : 'Log Out'}</Text>
            </TouchableOpacity>

            <ShiningLoader visible={isLoading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 24,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF9E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#1C1C1E',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 12,
    },
    subMessage: {
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 20,
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
        marginBottom: 25
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
});
