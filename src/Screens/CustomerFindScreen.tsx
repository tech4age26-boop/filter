
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkshopCard } from '../components/CustomerComponents';
import { useTheme } from '../Theme/GlobalTheme';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../Config/config';

export function CustomerFindScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/workshops`);
            const data = await response.json();
            if (data.success) {
                setWorkshops(data.data);
            }
        } catch (error) {
            console.error('Error fetching workshops:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWorkshops = workshops.filter(w =>
        w.workshopName.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <MaterialCommunityIcons name="filter-variant" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.cardBackground }]}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        placeholder="Search by name, service..."
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholderTextColor={theme.subText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {loading ? (
                <View style={{ marginTop: 50 }}>
                    <ActivityIndicator size="large" color="#F4C430" />
                </View>
            ) : (
                <View style={styles.listPadding}>
                    {filteredWorkshops.map((workshop) => (
                        <TouchableOpacity
                            key={workshop._id}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('WorkshopDetail', { workshop })}
                        >
                            <WorkshopCard
                                image={{ uri: workshop.frontPhotoUrl }}
                                title={workshop.workshopName}
                                rating={workshop.rating.toString()}
                                distance="2.5 mi"
                                location={workshop.address || "Riyadh"}
                                tags={workshop.services?.slice(0, 2) || []}
                                isSponsored={workshop.status === 'active'}
                                fullWidth={true}
                            />
                        </TouchableOpacity>
                    ))}
                    {filteredWorkshops.length === 0 && (
                        <Text style={{ textAlign: 'center', color: theme.subText, marginTop: 20 }}>No workshops found</Text>
                    )}
                </View>
            )}
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
