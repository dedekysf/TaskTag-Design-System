/**
 * TabItem Component - TaskTag Design System
 * 
 * Refactored from React web component to React Native with Restyle
 * Source: Reference/Tasktagdesignsystem/src/components/TabItem.tsx
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { LucideIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { Text } from './primitives';

export type TabItemVariant = 'default' | 'icon-left' | 'icon-right';
export type TabItemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TabItemProps {
    /** Tab variant: default, icon-left, icon-right */
    variant?: TabItemVariant;
    /** Tab size: xs, sm, md, lg, xl */
    size?: TabItemSize;
    /** Tab label text */
    label: string;
    /** Optional icon component from lucide-react-native */
    icon?: LucideIcon;
    /** Optional badge number or text */
    badge?: string | number;
    /** Whether the tab is active */
    isActive?: boolean;
    /** Whether the tab is disabled */
    disabled?: boolean;
    /** Click handler */
    onPress?: () => void;
    /** Custom style */
    style?: ViewStyle;
}

// Size configurations
const sizeConfig = {
    xs: { height: 24, paddingVertical: 6, paddingHorizontal: 12, fontSize: 10, iconSize: 12, gap: 6 },
    sm: { height: 32, paddingVertical: 8, paddingHorizontal: 14, fontSize: 12, iconSize: 14, gap: 6 },
    md: { height: 40, paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16, gap: 8 },
    lg: { height: 48, paddingVertical: 12, paddingHorizontal: 20, fontSize: 16, iconSize: 18, gap: 8 },
    xl: { height: 56, paddingVertical: 14, paddingHorizontal: 24, fontSize: 18, iconSize: 20, gap: 10 },
};

export function TabItem({
    variant = 'default',
    size = 'md',
    label,
    icon: Icon,
    badge,
    isActive = false,
    disabled = false,
    onPress,
    style,
}: TabItemProps) {
    const theme = useTheme<Theme>();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const currentSize = sizeConfig[size];

    // Determine styles based on state
    let textColor = theme.colors.textSecondary;
    let borderBottomColor = 'transparent';
    let opacity = 1;

    if (disabled) {
        textColor = theme.colors.grey04;
        borderBottomColor = 'transparent';
        opacity = 1;
    } else if (isPressed) {
        textColor = theme.colors.primary;
        borderBottomColor = theme.colors.primary;
        opacity = 0.7;
    } else if (isActive) {
        textColor = theme.colors.primary;
        borderBottomColor = theme.colors.primary;
        opacity = 1;
    } else if (isHovered) {
        textColor = theme.colors.primary;
        borderBottomColor = 'transparent';
        opacity = 1;
    }

    return (
        <Pressable
            onPress={!disabled ? onPress : undefined}
            onPressIn={() => !disabled && setIsPressed(true)}
            onPressOut={() => !disabled && setIsPressed(false)}
            {...(Platform.OS === 'web' && {
                onHoverIn: () => !disabled && setIsHovered(true),
                onHoverOut: () => !disabled && setIsHovered(false),
            } as any)}
            disabled={disabled}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: currentSize.height,
                    paddingVertical: currentSize.paddingVertical,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    backgroundColor: 'transparent',
                    borderBottomWidth: 2,
                    borderBottomColor,
                    gap: currentSize.gap,
                    opacity,
                    ...(Platform.OS === 'web' && {
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                    } as any),
                },
                style,
            ]}
        >
            {variant === 'icon-left' && Icon && (
                <Icon size={currentSize.iconSize} color={textColor} />
            )}

            <Text
                style={{
                    color: textColor,
                    fontSize: currentSize.fontSize,
                    fontFamily: 'Inter_500Medium',
                }}
            >
                {label}
            </Text>

            {variant === 'icon-right' && Icon && (
                <Icon size={currentSize.iconSize} color={textColor} />
            )}

            {badge !== undefined && (
                <View
                    style={{
                        backgroundColor: disabled ? theme.colors.grey04 : theme.colors.secondaryGreen,
                        borderRadius: theme.borderRadii.full,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        minWidth: 18,
                        height: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 4,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.white,
                            fontSize: 10,
                            fontFamily: 'Inter_500Medium',
                        }}
                    >
                        {badge}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}
