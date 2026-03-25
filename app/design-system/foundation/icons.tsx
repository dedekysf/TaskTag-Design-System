import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
    Box as BoxIcon,
    CheckSquare,
    Circle,
    ExternalLink,
    Image as ImageIcon,
    Menu,
    MousePointerClick,
    Palette,
    Sparkles,
    Square,
    TextCursor,
    Type,
    User
} from 'lucide-react-native';
import React from 'react';
import { Linking, ScrollView, View } from 'react-native';

export default function IconsScreen() {
    const theme = useTheme<Theme>();

    // Use a subset of Lucide icons for demonstration
    // Reordered to match image roughly where possible, plus standardizing on 'Popular'
    // Image shows: Palette, Type, Square, Box, User, Image, Menu, CheckSquare, Circle, Sparkles, MousePointerClick, TextCursor
    const popularIcons = [
        { name: 'Palette', icon: Palette },
        { name: 'Type', icon: Type },
        { name: 'Square', icon: Square },
        { name: 'Box', icon: BoxIcon },
        { name: 'User', icon: User },
        { name: 'Image', icon: ImageIcon },
        { name: 'Menu', icon: Menu },
        { name: 'CheckSquare', icon: CheckSquare },
        { name: 'Circle', icon: Circle },
        { name: 'Sparkles', icon: Sparkles },
        { name: 'MousePointerClick', icon: MousePointerClick },
        { name: 'TextCursor', icon: TextCursor },
    ];

    const totalItems = popularIcons.length;

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader
                    title="Icons"
                    description="1,500+ icons from Lucide available for use in your project"
                />

                {/* Header Section matching the image */}
                <Card marginBottom="xl" padding="xl" alignItems="center" justifyContent="center">
                    <Text variant="h3" marginBottom="xs" textAlign="center">Lucide Icons Library</Text>
                    <Text variant="body" color="textSecondary" textAlign="center" marginBottom="lg">
                        Browse the complete collection of icons used in TaskTag Design System
                    </Text>
                    <Button
                        variant="fill"
                        color="secondary"
                        size="md"
                        onPress={() => Linking.openURL('https://lucide.dev/icons/')}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                        <Text color="white" fontWeight="bold">Visit Lucide Icons</Text>
                        <ExternalLink size={16} color="white" />
                    </Button>
                </Card>


                <Box marginBottom="xl">
                    <Text variant="h3" marginBottom="lg">Popular Icons Used in TaskTag</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        {popularIcons.map(({ name, icon: IconComponent }) => (
                            <Card
                                key={name}
                                alignItems="center"
                                justifyContent="center"
                                flexGrow={1}
                                minWidth={150} // Wider cards as per image
                                borderRadius="m"
                                gap="sm"
                                padding="md"
                            >
                                <IconComponent size={32} color={theme.colors.textPrimary} />
                                <Text variant="label" numberOfLines={1}>{name}</Text>
                            </Card>
                        ))}
                    </View>
                </Box>

            </Box>
        </ScrollView>
    );
}
