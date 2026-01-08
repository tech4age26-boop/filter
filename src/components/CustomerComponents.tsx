import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../Theme/GlobalTheme';

export function WorkshopCard({ image, title, rating, distance, location, tags, isSponsored, isNew, fullWidth }: any) {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: theme.cardBackground }, fullWidth && styles.fullWidthCard]}>
            <View style={styles.cardImageContainer}>
                <Image source={image} style={styles.cardImage} />
                {isSponsored && (
                    <View style={styles.sponsoredTag}>
                        <Text style={styles.sponsoredText}>SPONSORED</Text>
                    </View>
                )}
                {isNew && (
                    <View style={[styles.sponsoredTag, { backgroundColor: '#2ECC71' }]}>
                        <Text style={[styles.sponsoredText, { color: 'white' }]}>NEW</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heartIcon}>🤍</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
                    <View style={[styles.ratingContainer, { backgroundColor: theme.background }]}>
                        <Text style={styles.ratingStar}>⭐</Text>
                        <Text style={[styles.ratingText, { color: theme.text }]}>{rating}</Text>
                    </View>
                </View>
                <Text style={styles.cardSubtitle}>{distance} • {location}</Text>
                <View style={styles.tagsRow}>
                    {tags.map((tag: string, index: number) => (
                        <View key={index} style={[styles.tag, index === 1 ? styles.greenTag : null, { backgroundColor: index === 1 ? '#E6F9EF' : theme.tagBg }]}>
                            <Text style={[styles.tagText, index === 1 ? styles.greenTagText : null, { color: index === 1 ? '#2ECC71' : theme.tagText }]}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

export function FavoriteCard({ image, title, subtitle, tag }: any) {
    const { theme } = useTheme();
    return (
        <View style={[styles.miniCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.miniCardImageContainer}>
                <Image source={image} style={styles.miniCardImage} />
                <TouchableOpacity style={styles.favHeartButton}>
                    <Text style={styles.heartIconFilled}>💛</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.miniCardContent}>
                <Text style={[styles.miniCardTitle, { color: theme.text }]}>{title}</Text>
                <Text style={styles.miniCardSubtitle}>{subtitle}</Text>
                <View style={styles.miniCardFooter}>
                    <View style={[styles.smallTag, { backgroundColor: theme.background }]}>
                        <Text style={[styles.smallTagText, { color: theme.subText }]}>{tag}</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.bookText}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export function OrderCard({ title, shopName, date, status, statusColor, image }: any) {
    const { theme } = useTheme();
    return (
        <View style={[styles.orderCard, { backgroundColor: theme.cardBackground }]}>
            <Image source={image} style={styles.orderImage} />
            <View style={styles.orderContent}>
                <View style={styles.orderHeader}>
                    <Text style={[styles.orderTitle, { color: theme.text }]}>{title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                    </View>
                </View>
                <Text style={styles.shopName}>{shopName}</Text>
                <Text style={styles.orderDate}>{date}</Text>
            </View>
        </View>
    );
}

export function SettingsItem({ icon, label, color, onPress }: any) {
    const { theme } = useTheme();
    return (
        <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
            <View style={styles.settingsLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                    <MaterialCommunityIcons name={icon} size={22} color={color || theme.text} />
                </View>
                <Text style={[styles.settingsLabel, { color: color || theme.text }]}>{label}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={theme.subText} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Card
    card: {
        width: 280,
        borderRadius: 16,
        marginRight: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    fullWidthCard: {
        width: '100%',
        marginRight: 0,
        marginBottom: 20,
    },
    cardImageContainer: {
        height: 160,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    sponsoredTag: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#F4C430',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    sponsoredText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1C1C1E',
        letterSpacing: 0.5,
    },
    heartButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartIcon: {
        fontSize: 16,
        color: '#FFF',
    },
    cardContent: {
        padding: 16,
    },
    cardTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingStar: {
        fontSize: 10,
        marginRight: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    greenTag: {
        backgroundColor: '#E6F9EF',
    },
    greenTagText: {
        color: '#2ECC71',
    },

    // Mini Card
    miniCard: {
        width: 260,
        borderRadius: 16,
        marginRight: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    miniCardImageContainer: {
        height: 120,
        position: 'relative',
    },
    miniCardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    favHeartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        backgroundColor: '#FFF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    heartIconFilled: {
        fontSize: 14,
    },
    miniCardContent: {
        padding: 12,
    },
    miniCardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    miniCardSubtitle: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 8,
    },
    miniCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    smallTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    smallTagText: {
        fontSize: 11,
    },
    bookText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#F4C430',
    },

    // Orders Styling
    orderCard: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    orderImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    orderContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    orderTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    shopName: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },

    // Settings Styling
    settingsItem: {
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
});
