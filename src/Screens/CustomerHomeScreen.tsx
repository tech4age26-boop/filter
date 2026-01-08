import React, { useState, useEffect } from 'react';
// Force refresh
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkshopCard, FavoriteCard } from '../components/CustomerComponents';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../Config/config';
import { useTheme } from '../Theme/GlobalTheme';

// Production Vercel URL

export function CustomerHomeScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState('Guest');
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await AsyncStorage.getItem('user_data');
                if (data) {
                    const user = JSON.parse(data);
                    setUserName(user.name || t('common.customer'));
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
            }
        };

        const fetchWorkshops = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/providers`);
                const data = await response.json();
                if (data.success) {
                    setWorkshops(data.providers);
                }
            } catch (error) {
                console.error('Failed to fetch workshops:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
        fetchWorkshops();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={{ flex: 1, backgroundColor: theme.background }}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('../../assets/user_avatar.png')}
                                style={[styles.avatar, { borderColor: theme.cardBackground }]}
                            />
                            <View style={[styles.onlineBadge, { borderColor: theme.cardBackground }]} />
                        </View>
                        <View style={styles.welcomeTextContainer}>
                            <Text style={styles.welcomeLabel}>{t('home.welcome_back').toUpperCase()}</Text>
                            <Text style={[styles.userName, { color: theme.text }]}>{userName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.bellButton, { backgroundColor: theme.cardBackground }]}
                        onPress={() => navigation.navigate('CustomerMenu')}
                    >
                        <MaterialCommunityIcons name="menu" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            placeholder="Find a workshop, service..."
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholderTextColor={theme.subText}
                        />
                        <TouchableOpacity>
                            <Text style={styles.filterIcon}>⚙️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Filter Certified Section */}
                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>FILTER Certified</Text>
                        <Text style={styles.verifiedBadge}>✓</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScrollPadding}>

                    {isLoading ? (
                        <ActivityIndicator size="small" color={theme.tint} />
                    ) : (
                        workshops.map((workshop) => (
                            <WorkshopCard
                                key={workshop.id}
                                image={workshop.logoUrl ? { uri: workshop.logoUrl } : require('../../assets/car_workshop.png')}
                                title={workshop.name}
                                rating={workshop.rating?.toString() || "N/A"}
                                distance="-- mi" // Location calc needed
                                location={workshop.address || "Unknown"}
                                tags={workshop.type === 'workshop' ? ['Workshop'] : ['Technician']}
                                isSponsored={false}
                            />
                        ))
                    )}

                    {/* Show empty state message if no workshops and not loading */}
                    {!isLoading && workshops.length === 0 && (
                        <Text style={{ color: theme.subText, marginLeft: 5 }}>No workshops found nearby.</Text>
                    )}
                </ScrollView>

                {/* My Favorites Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>My Favorites</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScrollPadding}>
                    <FavoriteCard
                        image={require('../../assets/tires_wheel.png')}
                        title="Downtown Tire & Wheel"
                        subtitle="0.8 mi • 120 Main St"
                        tag="Tires & Alignment"
                    />
                    <FavoriteCard
                        image={require('../../assets/car_workshop.png')}
                        title="Quick Lube Station"
                        subtitle="3.1 mi • Highway 9"
                        tag="Oil Change"
                    />
                </ScrollView>

                {/* Emergency Section */}
                <View style={styles.emergencyContainer}>
                    <View style={styles.emergencyContent}>
                        <Text style={styles.emergencyTitle}>Need Emergency Help?</Text>
                        <Text style={styles.emergencySubtitle}>
                            24/7 Roadside assistance is just a tap away.
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.sosButton}>
                        <Text style={styles.sosTextSmall}>SOS</Text>
                        <Text style={styles.sosTextLarge}>Get Help</Text>
                    </TouchableOpacity>
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2ECC71',
        borderWidth: 2,
    },
    welcomeTextContainer: {
        justifyContent: 'center',
    },
    welcomeLabel: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
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
    bellIcon: {
        fontSize: 20,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        borderWidth: 1.5,
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
    filterIcon: {
        fontSize: 20,
        opacity: 0.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 5,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 6,
    },
    verifiedBadge: {
        color: '#007AFF', // Blue check
        fontSize: 16,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#F4C430',
        fontWeight: '600',
    },
    horizontalScrollPadding: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emergencyContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: '#F4C430',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#F4C430',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    emergencyContent: {
        flex: 1,
        marginRight: 15,
    },
    emergencyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    emergencySubtitle: {
        fontSize: 13,
        color: '#1C1C1E',
        opacity: 0.8,
        lineHeight: 18,
    },
    sosButton: {
        backgroundColor: '#2C2C2E',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sosTextSmall: {
        color: '#F4C430',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    sosTextLarge: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
