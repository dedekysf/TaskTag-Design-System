/**
 * Alert Component - TaskTag Design System
 * 
 * Refactored from React web component to React Native with Restyle
 * Source: Reference/Tasktagdesignsystem/src/components/Alert.tsx
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, CircleCheckBig, Info } from 'lucide-react-native';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from './Button';
import { Text } from './primitives';

export type AlertVariant = 'warning' | 'info' | 'success' | 'error';

export interface AlertProps {
    /** Alert variant: warning, info, success, error */
    variant?: AlertVariant;
    /** Alert title */
    title?: string;
    /** Alert description */
    description?: string;
    /** Button text (optional) */
    buttonText?: string;
    /** Button click handler */
    onButtonClick?: () => void;
    /** Custom style */
    style?: ViewStyle;
}

// Variant style configurations
const variantConfig = {
    warning: {
        backgroundColor: '#fdf4e0', // lightCream
        borderColor: '#e6b566', // pastelYellow
        iconColor: '#0a1629', // textPrimary
        Icon: AlertTriangle,
    },
    info: {
        backgroundColor: '#dceeff', // lightSky
        borderColor: '#138eff', // blue
        iconColor: '#0a1629', // textPrimary
        Icon: Info,
    },
    success: {
        backgroundColor: '#dcf2ec', // lightMint
        borderColor: '#18a87d', // secondaryGreen
        iconColor: '#0a1629', // textPrimary
        Icon: CircleCheckBig,
    },
    error: {
        backgroundColor: '#ffdada', // lightPink
        borderColor: '#ff4444', // alertRed
        iconColor: '#0a1629', // textPrimary
        Icon: AlertTriangle,
    },
};

export function Alert({
    variant = 'warning',
    title = 'Access to Team Plan for TaskTag Project has ended',
    description = 'Your access ended on September 17, 2025. Upgrade to a Team plan to use advanced project features.',
    buttonText,
    onButtonClick,
    style,
}: AlertProps) {
    const theme = useTheme<Theme>();
    const config = variantConfig[variant];
    const IconComponent = config.Icon;

    return (
        <View
            style={[
                {
                    backgroundColor: config.backgroundColor,
                    borderWidth: 1,
                    borderColor: config.borderColor,
                    borderRadius: theme.borderRadii['8'],
                    padding: theme.spacing['16'],
                    width: '100%',
                },
                style,
            ]}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing['24'],
                    width: '100%',
                }}
            >
                {/* Content Section */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.spacing['12'],
                        flex: 1,
                        minHeight: 51,
                    }}
                >
                    {/* Icon */}
                    <IconComponent
                        size={24}
                        color={config.iconColor}
                        style={{ flexShrink: 0 }}
                    />

                    {/* Text Container */}
                    <View
                        style={{
                            flexDirection: 'column',
                            gap: theme.spacing['4'],
                            flex: 1,
                        }}
                    >
                        <Text
                            variant="webLargeLabel"
                            style={{
                                color: theme.colors.textPrimary,
                            }}
                        >
                            {title}
                        </Text>
                        <Text
                            variant="label"
                            style={{
                                color: theme.colors.textSecondary,
                            }}
                        >
                            {description}
                        </Text>
                    </View>
                </View>

                {/* Button (Optional) */}
                {buttonText && onButtonClick && (
                    <View style={{ flexShrink: 0 }}>
                        <Button
                            variant="fill"
                            color="secondary"
                            size="md"
                            onPress={onButtonClick}
                        >
                            {buttonText}
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
}
