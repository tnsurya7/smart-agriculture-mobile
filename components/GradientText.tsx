import React from 'react';
import { Text, TextStyle, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/theme';

interface GradientTextProps {
    text: string;
    style?: TextStyle | TextStyle[];
    colors?: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}

export default function GradientText({
    text,
    style,
    colors: gradientColors = colors.sensors.soil, // Default to a rich green gradient
    start = { x: 0, y: 0 },
    end = { x: 1, y: 0 },
}: GradientTextProps) {
    return (
        <MaskedView
            maskElement={
                <Text style={[style, { backgroundColor: 'transparent' }]}>
                    {text}
                </Text>
            }
        >
            <LinearGradient
                colors={gradientColors as any}
                start={start}
                end={end}
            >
                <Text style={[style, { opacity: 0 }]}>{text}</Text>
            </LinearGradient>
        </MaskedView>
    );
}
