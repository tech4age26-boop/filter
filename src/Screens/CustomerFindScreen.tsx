import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkshopCard } from '../components/CustomerComponents';
import { useTheme } from '../Theme/GlobalTheme';

export function CustomerFindScreen() {
    const { theme } = useTheme();
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ flex: 1, backgroundColor: theme.background }}>

            <View style={[styles.header, { paddingBottom: 5 }]}>
                <View style={styles.headerLeft}>
                    <Text style={[styles.sectionTitle, { fontSize: 24, color: theme.text }]}>Find Workshops</Text>
                </View>
                <TouchableOpacity style={[styles.bellButton, { backgroundColor: theme.cardBackground }]}>
                    <MaterialCommunityIcons name="filter-variant" size={24} color={theme.iconColor} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        placeholder="Search by name, service..."
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholderTextColor={theme.subText}
                    />
                </View>
            </View>

            <View style={styles.listPadding}>
                <WorkshopCard
                    image={require('../../assets/car_workshop.png')}
                    title="AutoFix Pro Center"
                    rating="4.8"
                    distance="2.5 mi"
                    location="Downtown Area"
                    tags={['Diagnostics', 'Quick Service']}
                    isSponsored={true}
                    fullWidth={true}
                />
                <WorkshopCard
                    image={require('../../assets/tires_wheel.png')}
                    title="Speedy Repair Hub"
                    rating="4.6"
                    distance="4.2 mi"
                    location="North Hills"
                    tags={['Engine', 'Tuning']}
                    fullWidth={true}
                />
                <WorkshopCard
                    image={require('../../assets/car_workshop.png')}
                    title="Premium Auto Care"
                    rating="5.0"
                    distance="5.0 mi"
                    location="Eastside"
                    tags={['Detailing', 'Oil Change']}
                    isNew={true}
                    fullWidth={true}
                />
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6,
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
        opacity: 0.5,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    listPadding: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
