/**
 * EmptyState Component - TaskTag Design System
 *
 * Used to display an empty/zero-data state with an icon, title, description, and optional CTA.
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from './Button';
import { Text } from './primitives';

export interface EmptyStateAction {
    label: string;
    onPress: () => void;
    /**
     * 'primary'  → filled black button
     * 'outline'  → outlined secondary button
     * 'ghost'    → ghost button
     * Default: 'outline'
     */
    variant?: 'primary' | 'outline' | 'ghost';
    /** Optional leading icon element, e.g. <UserPlus size={16} color="#fff" /> */
    icon?: React.ReactNode;
}

export interface EmptyStateProps {
    /** Icon element to render above the title */
    icon?: React.ReactNode;
    /** Main title text */
    title: string;
    /** Supporting description text */
    description?: string;
    /** Action buttons */
    actions?: EmptyStateAction[];
    /** Custom container style */
    style?: ViewStyle;
}

export function EmptyState({ icon, title, description, actions, style }: EmptyStateProps) {
    const theme = useTheme<Theme>();

    return (
        <View
            style={[
                {
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 48,
                    paddingHorizontal: 24,
                    gap: 12,
                },
                style,
            ]}
        >
            {/* Icon slot */}
            {icon && (
                <View style={{ marginBottom: 4 }}>
                    {icon}
                </View>
            )}

            {/* Texts */}
            <View style={{ alignItems: 'center', gap: 4 }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '400',
                        color: theme.colors.textPrimary,
                        textAlign: 'center',
                    }}
                >
                    {title}
                </Text>
                {description && (
                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.textSecondary,
                            textAlign: 'center',
                            lineHeight: 18,
                        }}
                    >
                        {description}
                    </Text>
                )}
            </View>

            {/* Actions */}
            {actions && actions.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
                    {actions.map((action, i) => {
                        const isPrimary = action.variant === 'primary';
                        const isGhost = action.variant === 'ghost';

                        return (
                            <Button
                                key={i}
                                variant={isPrimary ? 'fill' : isGhost ? 'ghost' : 'outline'}
                                color="secondary"
                                size="md"
                                onPress={action.onPress}
                                style={isPrimary ? { backgroundColor: theme.colors.black } as any : undefined}
                            >
                                {action.icon ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        {action.icon}
                                        <Text
                                            variant="labelMedium"
                                            style={{ color: isPrimary ? '#fff' : theme.colors.foreground }}
                                        >
                                            {action.label}
                                        </Text>
                                    </View>
                                ) : (
                                    action.label
                                )}
                            </Button>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
