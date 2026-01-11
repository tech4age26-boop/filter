import React, { useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Modal,
    Dimensions,
} from 'react-native';

interface ShiningLoaderProps {
    visible: boolean;
}

export const ShiningLoader: React.FC<ShiningLoaderProps> = ({ visible }) => {
    // Animation value for opacity (breath/shine effect)
    const shineAnim = useRef(new Animated.Value(0.3)).current;
    // Animation value for scale (subtle pulse)
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            const shine = Animated.loop(
                Animated.sequence([
                    Animated.parallel([
                        Animated.timing(shineAnim, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1.1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(shineAnim, {
                            toValue: 0.3,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            );
            shine.start();

            return () => shine.stop();
        }
    }, [visible, shineAnim, scaleAnim]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Animated.Text
                        style={[
                            styles.text,
                            {
                                opacity: shineAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        FILTER
                    </Animated.Text>
                    <Text style={styles.subText}>Processing...</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 48,
        fontWeight: '900',
        color: '#F4C430', // Gold color
        letterSpacing: 4,
        textShadowColor: 'rgba(244, 196, 48, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subText: {
        marginTop: 20,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        letterSpacing: 1,
    },
});
