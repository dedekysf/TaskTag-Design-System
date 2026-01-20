
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Check } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from './primitives';

export type CheckboxVariant = 'circular' | 'rectangular';

interface CheckboxProps {
    /** Checkbox variant: circular or rectangular */
    variant?: CheckboxVariant;
    /** Custom className style replacement */
    style?: any;
    /** Checked state */
    checked?: boolean;
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Label text */
    label?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Input ID */
    id?: string;
}

export function Checkbox({
    variant = 'circular',
    style,
    checked = false,
    onChange,
    label,
    disabled = false,
    id,
}: CheckboxProps) {
    const theme = useTheme<Theme>();
    const [isChecked, setIsChecked] = useState(checked);
    const [isHovered, setIsHovered] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
        if (disabled) return;
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        onChange?.(newChecked);
    };

    const handlePressIn = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    const borderRadius = variant === 'circular' ? 999 : 6;
    const checkboxSize = 24;

    // Hover ring color: usually a very light primary color
    // We can use opacity on primary or a specific light color. Use 'grey02' or custom.
    const hoverColor = theme.colors.grey02;

    return (
        <Pressable
            onPress={handleChange}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onHoverIn={() => !disabled && setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
            disabled={disabled}
            style={[styles.container, style, Platform.OS === 'web' && { cursor: disabled ? 'not-allowed' : 'pointer' } as any]}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {/* Hover Ring */}
                {isHovered && !disabled && (
                    <View
                        style={{
                            position: 'absolute',
                            width: checkboxSize + 12,
                            height: checkboxSize + 12,
                            borderRadius: borderRadius + 6,
                            backgroundColor: hoverColor,
                            opacity: 0.5,
                        }}
                    />
                )}

                <Animated.View
                    style={[
                        styles.checkboxBase,
                        {
                            transform: [{ scale: scaleAnim }],
                            borderRadius,
                            width: checkboxSize,
                            height: checkboxSize,
                            borderColor: disabled
                                ? theme.colors.grey03
                                : isChecked
                                    ? theme.colors.secondaryGreen
                                    : theme.colors.grey04,
                            backgroundColor: isChecked
                                ? (disabled ? theme.colors.grey03 : theme.colors.secondaryGreen)
                                : 'transparent',
                            borderWidth: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    {(isChecked || (isHovered && !disabled)) && (
                        <Check
                            size={16}
                            color={isChecked ? "white" : theme.colors.grey04}
                            strokeWidth={3}
                        />
                    )}
                </Animated.View>
            </View>

            {label && (
                <Text
                    variant="label"
                    style={{
                        marginLeft: 12,
                        color: disabled ? theme.colors.grey05 : theme.colors.textPrimary,
                    }}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxBase: {
        // sizing handled inline
    },
});
