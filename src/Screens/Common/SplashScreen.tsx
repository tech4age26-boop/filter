import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../Theme/GlobalTheme';

export function SplashScreen() {
    const { theme, isDarkMode } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: theme.cardBackground,
                        shadowColor: isDarkMode ? '#000' : '#BBB',
                    },
                ]}>
                <Text style={[styles.logoText, { color: theme.tint }]}>FILTER</Text>
            </Animated.View>
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={[styles.tagline, { color: theme.subText }]}>DRIVE WITH CONFIDENCE</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        borderRadius: 20,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    tagline: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 2,
    },
});
