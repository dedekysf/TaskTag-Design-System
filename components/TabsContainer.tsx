/**
 * TabsContainer Component - TaskTag Design System
 * 
 * Refactored from React web component to React Native with Restyle
 * Source: Reference/Tasktagdesignsystem/src/components/TabsContainer.tsx
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { TabItem, TabItemSize, TabItemVariant } from './TabItem';

interface Tab {
    value: string;
    label: string;
    icon?: any;
    badge?: string | number;
}

interface TabsContainerProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: Tab[];
    children: ReactNode;
    size?: TabItemSize;
    variant?: TabItemVariant;
}

export function TabsContainer({
    activeTab,
    onTabChange,
    tabs,
    children,
    size = 'md',
    variant = 'default',
}: TabsContainerProps) {
    const theme = useTheme<Theme>();

    return (
        <View>
            <View
                style={{
                    flexDirection: 'row',
                    gap: 4,
                    marginBottom: theme.spacing['24'],
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.grey03,
                }}
            >
                {tabs.map((tab) => (
                    <TabItem
                        key={tab.value}
                        variant={variant}
                        label={tab.label}
                        size={size}
                        icon={tab.icon}
                        badge={tab.badge}
                        isActive={activeTab === tab.value}
                        onPress={() => onTabChange(tab.value)}
                    />
                ))}
            </View>
            <View>{children}</View>
        </View>
    );
}

interface TabPanelProps {
    value: string;
    activeTab: string;
    children: ReactNode;
}

export function TabPanel({ value, activeTab, children }: TabPanelProps) {
    if (value !== activeTab) return null;
    return <View>{children}</View>;
}
