
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/GlobalTheme';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export function WorkshopDetailScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { workshop }: any = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: workshop.frontPhotoUrl }} style={styles.headerImage} />
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.8)' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#1C1C1E" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.favoriteButton, { backgroundColor: 'rgba(255,255,255,0.8)' }]}
                    >
                        <MaterialCommunityIcons name="heart-outline" size={24} color="#1C1C1E" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={[styles.content, { backgroundColor: theme.background }]}>
                    {/* Logo Overlay */}
                    <View style={[styles.logoBadgeContainer, { backgroundColor: theme.cardBackground }]}>
                        <Image source={{ uri: workshop.logoUrl }} style={styles.workshopLogo} />
                    </View>

                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.workshopName, { color: theme.text }]}>{workshop.workshopName}</Text>
                            <View style={styles.locationRow}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={theme.subText} />
                                <Text style={[styles.locationText, { color: theme.subText }]}>{workshop.address}</Text>
                            </View>
                        </View>
                        <View style={styles.ratingBadge}>
                            <MaterialCommunityIcons name="star" size={20} color="#F4C430" />
                            <Text style={styles.ratingText}>{workshop.rating}</Text>
                        </View>
                    </View>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={[styles.statItem, { backgroundColor: theme.cardBackground }]}>
                            <MaterialCommunityIcons name="tools" size={20} color="#F4C430" />
                            <Text style={[styles.statValue, { color: theme.text }]}>{workshop.services?.length || 0}</Text>
                            <Text style={[styles.statLabel, { color: theme.subText }]}>Services</Text>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: theme.cardBackground }]}>
                            <MaterialCommunityIcons name="account-group" size={20} color="#F4C430" />
                            <Text style={[styles.statValue, { color: theme.text }]}>{workshop.technicians?.length || 0}</Text>
                            <Text style={[styles.statLabel, { color: theme.subText }]}>Experts</Text>
                        </View>
                        <View style={[styles.statItem, { backgroundColor: theme.cardBackground }]}>
                            <MaterialCommunityIcons name="truck-delivery" size={20} color="#F4C430" />
                            <Text style={[styles.statValue, { color: theme.text }]}>{workshop.offersOutdoorServices ? 'YES' : 'NO'}</Text>
                            <Text style={[styles.statLabel, { color: theme.subText }]}>Outdoor</Text>
                        </View>
                    </View>

                    {/* Description Section */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>About Workshop</Text>
                    <Text style={[styles.description, { color: theme.subText }]}>
                        Professional automotive service provider with certified technicians.
                        We offer high-quality repairs and maintenance for all vehicle types.
                        CR Number: {workshop.crNumber} | VAT: {workshop.vatNumber}
                    </Text>

                    {/* Technicians */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Our Experts</Text>
                    <View style={styles.techRow}>
                        {workshop.technicians?.map((tech: string, index: number) => (
                            <View key={index} style={[styles.techChip, { backgroundColor: theme.cardBackground }]}>
                                <MaterialCommunityIcons name="account-tie" size={16} color={theme.text} />
                                <Text style={[styles.techName, { color: theme.text }]}>{tech}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Contact Info */}
                    <View style={[styles.contactCard, { backgroundColor: theme.cardBackground }]}>
                        <View style={styles.contactItem}>
                            <MaterialCommunityIcons name="phone" size={20} color="#F4C430" />
                            <Text style={[styles.contactText, { color: theme.text }]}>{workshop.phone}</Text>
                        </View>
                        <TouchableOpacity style={styles.callButton}>
                            <Text style={styles.callButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 8,
        borderRadius: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 8,
        borderRadius: 20,
    },
    content: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 24,
        paddingTop: 45, // Add padding for the logo
    },
    logoBadgeContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        position: 'absolute',
        top: -40,
        left: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    workshopLogo: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        resizeMode: 'contain',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    workshopName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 14,
        marginLeft: 4,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    ratingText: {
        color: '#F4C430',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statItem: {
        width: (width - 68) / 3,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 20,
    },
    techRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    techChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    techName: {
        fontSize: 14,
        marginLeft: 6,
        textTransform: 'capitalize',
    },
    contactCard: {
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    callButton: {
        backgroundColor: '#F4C430',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    callButtonText: {
        color: '#1C1C1E',
        fontWeight: 'bold',
    },
});
