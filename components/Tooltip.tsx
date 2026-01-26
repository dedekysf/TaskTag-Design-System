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

export type TooltipVariant = 'top-left' | 'top-center' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipStyle = 'default' | 'success' | 'custom';

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
    /** Make wrapper take full width */
    fullWidth?: boolean;
    /** Disabled tooltip */
    disabled?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

// Size configurations matching reference
const sizeConfig = {
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 12,
    },
    md: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    lg: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
    },
};

export function Tooltip({
    variant = 'top-center',
    size = 'md',
    tooltipStyle = 'default',
    content,
    children,
    forceShow = false,
    fullWidth = false,
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

    // Web specific handlers
    const handleMouseEnter = () => {
        if (Platform.OS === 'web' && !disabled) {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (Platform.OS === 'web' && !disabled) {
            setIsVisible(false);
        }
    };

    const handleLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setLayout({ x, y, width, height });
    };

    const shouldShow = (forceShow || isVisible) && !disabled;

    const backgroundColor =
        tooltipStyle === 'success' ? theme.colors.secondaryGreen :
            tooltipStyle === 'custom' ? 'transparent' : theme.colors.black;

    // Calculate tooltip position based on variant
    const getTooltipPosition = (): ViewStyle => {
        const offset = 8;
        switch (variant) {
            case 'top-left':
                return {
                    bottom: layout.height + offset,
                    left: 0,
                };
            case 'top-center':
                return {
                    bottom: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
            case 'top-right':
                return {
                    bottom: layout.height + offset,
                    right: 0,
                    // If right: 0 doesn't align perfectly with right edge of trigger because of parent width, 
                    // absolute positioning relative to trigger works if trigger is layout measurement reference.
                    // Assuming Tooltip container wraps Trigger exactly.
                };
            case 'bottom-left':
                return {
                    top: layout.height + offset,
                    left: 0,
                };
            case 'bottom-center':
                return {
                    top: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
            case 'bottom-right':
                return {
                    top: layout.height + offset,
                    right: 0,
                };
            case 'left':
                return {
                    right: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: '-50%' as any }],
                };
            case 'right':
                return {
                    left: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: '-50%' as any }],
                };
            default:
                return {
                    bottom: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
        }
    };

    return (
        <View style={[{ position: 'relative', zIndex: shouldShow ? 9999 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLayout={handleLayout}
                {...(Platform.OS === 'web' ? {
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    style: { cursor: 'pointer', width: fullWidth ? '100%' : 'auto' } as any
                } : {})}
            >
                {children}
            </Pressable>

            {shouldShow && (
                <View
                    style={[
                        {
                            position: 'absolute',
                            backgroundColor,
                            borderRadius: tooltipStyle === 'custom' ? 0 : theme.borderRadii['8'],
                            paddingVertical: tooltipStyle === 'custom' ? 0 : currentSize.paddingVertical,
                            paddingHorizontal: tooltipStyle === 'custom' ? 0 : currentSize.paddingHorizontal,
                            maxWidth: 200,
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
                                    whiteSpace: 'normal',
                                    wordWrap: 'break-word',
                                    width: 'max-content',
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
