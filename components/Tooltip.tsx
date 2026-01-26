/**
 * Tooltip Component - TaskTag Design System
 * 
 * Simplified version for React Native
 * Source: Reference/Tasktagdesignsystem/src/components/Tooltip.tsx
 * 
 * Note: This is a simplified version. Full positioning logic (like web portal)
 * is complex in React Native. This version uses basic positioning.
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { Text } from './primitives';

export type TooltipVariant = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipStyle = 'default' | 'success';

interface TooltipProps {
    /** Tooltip position variant */
    variant?: TooltipVariant;
    /** Tooltip size */
    size?: TooltipSize;
    /** Tooltip style */
    tooltipStyle?: TooltipStyle;
    /** The content to show in the tooltip */
    content: string | React.ReactNode;
    /** The trigger element */
    children: React.ReactNode;
    /** Force tooltip to show (controlled mode) */
    forceShow?: boolean;
    /** Disabled tooltip */
    disabled?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

// Size configurations
const sizeConfig = {
    sm: {
        padding: 8,
        fontSize: 12,
    },
    md: {
        padding: 12,
        fontSize: 14,
    },
    lg: {
        padding: 16,
        fontSize: 16,
    },
};

export function Tooltip({
    variant = 'top',
    size = 'md',
    tooltipStyle = 'default',
    content,
    children,
    forceShow = false,
    disabled = false,
    style,
}: TooltipProps) {
    const theme = useTheme<Theme>();
    const [isVisible, setIsVisible] = useState(false);
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const currentSize = sizeConfig[size];

    const handlePressIn = () => {
        if (!disabled) {
            setIsVisible(true);
        }
    };

    const handlePressOut = () => {
        if (!disabled) {
            setIsVisible(false);
        }
    };

    const handleLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setLayout({ x, y, width, height });
    };

    const shouldShow = (forceShow || isVisible) && !disabled;

    const backgroundColor =
        tooltipStyle === 'success' ? theme.colors.secondaryGreen : theme.colors.black;

    // Calculate tooltip position based on variant
    const getTooltipPosition = (): ViewStyle => {
        const offset = 8;
        switch (variant) {
            case 'top':
                return {
                    bottom: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: -50 }],
                };
            case 'bottom':
                return {
                    top: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: -50 }],
                };
            case 'left':
                return {
                    right: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: -50 }],
                };
            case 'right':
                return {
                    left: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: -50 }],
                };
            default:
                return {
                    bottom: layout.height + offset,
                };
        }
    };

    return (
        <View style={[{ position: 'relative' }, style]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLayout={handleLayout}
                {...(Platform.OS === 'web' && {
                    onHoverIn: handlePressIn,
                    onHoverOut: handlePressOut,
                } as any)}
            >
                {children}
            </Pressable>

            {shouldShow && (
                <View
                    style={[
                        {
                            position: 'absolute',
                            backgroundColor,
                            borderRadius: theme.borderRadii['8'],
                            padding: currentSize.padding,
                            maxWidth: 300,
                            zIndex: 9999,
                            ...Platform.select({
                                ios: {
                                    shadowColor: theme.colors.black,
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 4,
                                },
                                android: {
                                    elevation: 5,
                                },
                                web: {
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                } as any,
                            }),
                        },
                        getTooltipPosition(),
                    ]}
                    pointerEvents="none"
                >
                    {typeof content === 'string' ? (
                        <Text
                            style={{
                                color: theme.colors.white,
                                fontSize: currentSize.fontSize,
                                fontFamily: 'Inter_400Regular',
                                lineHeight: currentSize.fontSize * 1.5,
                            }}
                        >
                            {content}
                        </Text>
                    ) : (
                        content
                    )}
                </View>
            )}
        </View>
    );
}
