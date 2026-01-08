import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../Theme/GlobalTheme';
import { OrderCard } from '../components/CustomerComponents';

export function CustomerOrdersScreen() {
    const { theme } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={{ flex: 1, backgroundColor: theme.background }}>

                <View style={styles.header}>
                    <Text style={[styles.sectionTitle, { fontSize: 24, color: theme.text }]}>My Orders</Text>
                </View>

                {/* Current Orders */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 }]}>Current Orders</Text>
                </View>

                <View style={styles.listPadding}>
                    <OrderCard
                        title="Oil Change & Inspection"
                        shopName="AutoFix Pro Center"
                        date="Today, 2:00 PM"
                        status="In Progress"
                        statusColor="#F4C430"
                        image={require('../../assets/car_workshop.png')}
                    />
                </View>

                {/* Previous Orders */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 }]}>Previous Orders</Text>
                </View>

                <View style={styles.listPadding}>
                    <OrderCard
                        title="Tire Replacement"
                        shopName="Downtown Tire & Wheel"
                        date="Dec 15, 2024"
                        status="Completed"
                        statusColor="#2ECC71"
                        image={require('../../assets/tires_wheel.png')}
                    />
                    <OrderCard
                        title="Brake Pad Replacement"
                        shopName="Quick Lube Station"
                        date="Nov 28, 2024"
                        status="Completed"
                        statusColor="#2ECC71"
                        image={require('../../assets/car_workshop.png')}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 5,
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
